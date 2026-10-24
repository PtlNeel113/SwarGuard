/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared GoogleGenAI Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Audio Transcription using gemini-3.5-transcribe
app.post('/api/gemini/transcribe', async (req, res) => {
  try {
    const { base64Audio, mimeType = 'audio/webm' } = req.body;

    if (!base64Audio) {
      return res.status(400).json({ error: 'Missing base64Audio in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in server environment.',
      });
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: base64Audio,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this spoken audio verbatim in its original spoken language (English, Hindi, or Gujarati). Do not add commentary.',
          },
        ],
      },
    });

    const transcript = response.text || '';
    return res.json({ transcript });
  } catch (error: any) {
    console.error('Transcription Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to transcribe audio with gemini-3.5-transcribe',
    });
  }
});

// 2. Multi-turn Gemini Chatbot with model tiers (gemini-4-argon, gemini-3.8-flash, gemini-3.1-flash-lite)
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const {
      messages = [],
      systemInstruction = 'You are SwarGuard Cyber Safety Advisor, an expert in detecting Indian telephonic voice scams (Digital Arrest, fake KYC, courier extortion). Provide clear, evidence-based guidance and actionable protective steps.',
      model = 'gemini-3.8-flash',
      role = 'Safety Advisor',
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in server environment.',
      });
    }

    // Format history for @google/genai
    const contents = messages.map((m: any) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || m.text || '' }],
    }));

    let selectedModel = model;
    let responseText = '';

    try {
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      responseText = response.text || '';
    } catch (modelError: any) {
      // If gemini-4-argon fails (e.g. key permissions), gracefully fall back to gemini-3.8-flash
      if (selectedModel === 'gemini-4-argon') {
        console.warn('gemini-4-argon request failed, falling back to gemini-3.8-flash:', modelError?.message);
        selectedModel = 'gemini-3.8-flash';
        const fallbackResponse = await ai.models.generateContent({
          model: selectedModel,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        responseText = fallbackResponse.text || '';
      } else {
        throw modelError;
      }
    }

    return res.json({
      response: responseText,
      modelUsed: selectedModel,
      role,
    });
  } catch (error: any) {
    console.error('Chat Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate chat response',
    });
  }
});

// 2.1 Google Search Grounding with gemini-3.8-flash (Search Grounding tool)
app.post('/api/gemini/grounded-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in server environment.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are SwarGuard Cyber Threat Intelligence Analyst. Provide an accurate, up-to-date briefing with verified facts, official government or police advisories (such as Indian Cybercrime Coordination Centre I4C, CERT-In, RBI circulars, CBI warnings), and concrete safety steps for the following inquiry: "${query}".`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const sources = groundingChunks
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Web Reference',
        url: chunk.web?.uri || '',
      }))
      .filter((s: any) => Boolean(s.url));

    return res.json({
      text,
      sources,
      searchQueries: response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [],
    });
  } catch (error: any) {
    console.error('Search Grounding Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to perform grounded search with gemini-3.8-flash',
    });
  }
});

// 2.2 Bioscience & Acoustic Literature Search (Science Skill - Europe PMC integration)
app.get('/api/science/literature', async (req, res) => {
  try {
    const query = (req.query.q as string) || 'voice biometric deepfake acoustic stress detection';
    const pageSize = Number(req.query.pageSize) || 6;

    // Europe PMC Open Science REST API
    const epmcUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(
      query
    )}&resultType=lite&pageSize=${pageSize}&format=json`;

    const fetchResponse = await fetch(epmcUrl, {
      headers: {
        'User-Agent': 'SwarGuard-ScienceWorkbench/1.0 (science-biometrics)',
      },
    });

    if (!fetchResponse.ok) {
      throw new Error(`Europe PMC API returned HTTP ${fetchResponse.status}`);
    }

    const data = await fetchResponse.json();
    const resultList = data.resultList?.result || [];

    const papers = resultList.map((item: any) => ({
      id: item.id,
      title: item.title,
      authorString: item.authorString || 'Unknown Authors',
      journalTitle: item.journalTitle || 'Peer-Reviewed Forensic Science',
      pubYear: item.pubYear || '2024',
      doi: item.doi ? `https://doi.org/${item.doi}` : `https://europepmc.org/article/MED/${item.id}`,
      citedByCount: item.citedByCount || 0,
      isOpenAccess: item.isOpenAccess === 'Y',
      abstractText: item.abstractText || '',
    }));

    return res.json({ papers, totalCount: data.hitCount || papers.length });
  } catch (error: any) {
    console.error('Science Literature Fetch Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to fetch scientific papers from Europe PMC',
      papers: [],
    });
  }
});

// 3. WebSocket Server for Live Voice Conversations (gemini-3.8-live)
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to /live WebSocket');

  if (!process.env.GEMINI_API_KEY) {
    clientWs.send(
      JSON.stringify({
        error: 'GEMINI_API_KEY is not configured on the server. Live voice conversation requires an API key.',
      })
    );
    clientWs.close();
    return;
  }

  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction:
          'You are SwarGuard Live Safety Guardian. You speak with concise, reassuring, calm, and protective Indian voice safety guidance to assist users encountering suspicious phone calls in real-time.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
          console.log('Gemini Live session closed');
        },
        onerror: (err) => {
          console.error('Gemini Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ error: err.message || 'Live session error' }));
          }
        },
      },
    });

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('Failed to parse client audio packet:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('Client disconnected from /live');
      if (session) {
        try {
          session.close();
        } catch {}
      }
    });
  } catch (err: any) {
    console.error('Failed to initiate Gemini Live session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: err?.message || 'Failed to start Live API session' }));
      clientWs.close();
    }
  }
});

// Mount Vite or static build
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`SwarGuard full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
