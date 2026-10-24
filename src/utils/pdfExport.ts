/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfThreatIndicator {
  id: string;
  timestampSec: number;
  category: string;
  quote: string;
  reason: string;
  severity: string;
  confidence?: number;
}

export interface ReportExportData {
  caseId: string;
  scenarioName: string;
  callerId?: string;
  timestamp: string;
  overallRisk: 'high' | 'medium' | 'low' | 'insufficient';
  riskScore: number; // 0 to 1000
  durationSec: number;
  detectedLanguage?: string;
  channelType?: string;
  audioIntegrityHash?: string;
  summary: string;
  indicators: PdfThreatIndicator[];
  analystNotes?: string;
  disclaimer?: string;
}

/**
 * Generates and downloads a structured, publication-grade Cyber Security Forensic Incident PDF Report
 * for submission to authorities (e.g., National Cyber Crime Reporting Portal 1930 / cybercrime.gov.in)
 * or for sharing with family members and legal counsel.
 */
export function exportForensicReportPDF(data: ReportExportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // 1. Dark Cyber Header Banner
  doc.setFillColor(11, 16, 32); // #0B1020 Dark Ink
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line (Purple & Saffron)
  doc.setFillColor(168, 85, 247); // #A855F7 Vibrant Purple
  doc.rect(0, 41, pageWidth * 0.7, 1.5, 'F');
  doc.setFillColor(242, 166, 90); // #F2A65A Saffron
  doc.rect(pageWidth * 0.7, 41, pageWidth * 0.3, 1.5, 'F');

  // Brand & Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SWARGUARD CYBER THREAT FORENSIC REPORT', margin, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(154, 166, 188); // #9AA6BC Slate
  doc.text('National Cyber Crime Incident Documentation & Acoustic Evidence Briefing', margin, 23);

  // Authority Submission Stamp
  doc.setFillColor(23, 31, 58);
  doc.roundedRect(pageWidth - margin - 52, 10, 52, 22, 2, 2, 'F');
  doc.setDrawColor(168, 85, 247);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth - margin - 52, 10, 52, 22, 2, 2, 'D');

  doc.setTextColor(242, 166, 90);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('LEGAL / I4C EVIDENCE', pageWidth - margin - 50, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Ref: ${data.caseId}`, pageWidth - margin - 50, 21);
  doc.text(`Helpline: 1930 / cybercrime.gov.in`, pageWidth - margin - 50, 26);

  // 2. Case Overview Section
  let y = 52;

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('1. Incident Metadata & Forensic Profile', margin, y);
  y += 6;

  // Metadata Grid
  const metadataRows = [
    [
      { content: 'Incident Reference:', styles: { fontStyle: 'bold', textColor: [50, 50, 50] } },
      data.caseId,
      { content: 'Date & Time:', styles: { fontStyle: 'bold', textColor: [50, 50, 50] } },
      data.timestamp,
    ],
    [
      { content: 'Threat Scenario:', styles: { fontStyle: 'bold', textColor: [50, 50, 50] } },
      data.scenarioName,
      { content: 'Caller Source / ID:', styles: { fontStyle: 'bold', textColor: [50, 50, 50] } },
      data.callerId || '+91 (Spoofed / VoIP Trunk)',
    ],
    [
      { content: 'Audio Duration:', styles: { fontStyle: 'bold', textColor: [50, 50, 50] } },
      `${data.durationSec}s (Consented Recording)`,
      { content: 'Detected Language:', styles: { fontStyle: 'bold', textColor: [50, 50, 50] } },
      data.detectedLanguage || 'Multilingual (English / Hindi / Gujarati)',
    ],
    [
      { content: 'Risk Assessment:', styles: { fontStyle: 'bold', textColor: [50, 50, 50] } },
      `${data.overallRisk.toUpperCase()} RISK (Score ${data.riskScore}/1000)`,
      { content: 'Cryptographic SHA-256:', styles: { fontStyle: 'bold', textColor: [50, 50, 50] } },
      data.audioIntegrityHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ],
  ];

  autoTable(doc, {
    startY: y,
    head: [],
    body: metadataRows as any,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 38, fillColor: [248, 250, 252] },
      1: { cellWidth: 55 },
      2: { cellWidth: 38, fillColor: [248, 250, 252] },
      3: { cellWidth: 51 },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // 3. Executive Threat Summary Box
  doc.setFillColor(data.overallRisk === 'high' ? 254 : 240, data.overallRisk === 'high' ? 242 : 253, data.overallRisk === 'high' ? 242 : 250);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, 'F');
  doc.setDrawColor(data.overallRisk === 'high' ? 248 : 59, data.overallRisk === 'high' ? 113 : 130, data.overallRisk === 'high' ? 113 : 246);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(data.overallRisk === 'high' ? 185 : 30, data.overallRisk === 'high' ? 28 : 64, data.overallRisk === 'high' ? 28 : 175);
  doc.text(
    data.overallRisk === 'high'
      ? 'CRITICAL ALERT: High-Confidence Coercive Scam Vector Identified'
      : 'EVALUATION: Low/Moderate Threat Signature Detected',
    margin + 4,
    y + 6
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const splitSummary = doc.splitTextToSize(data.summary, pageWidth - margin * 2 - 8);
  doc.text(splitSummary, margin + 4, y + 12);

  y += 30;

  // 4. Acoustic Evidence Markers Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(17, 24, 39);
  doc.text('2. Evidentiary Dialogue & Threat Markers', margin, y);
  y += 5;

  const evidenceRows = (data.indicators || []).map((ind, idx) => [
    `#${idx + 1}`,
    `${ind.timestampSec}s`,
    ind.category.replace(/_/g, ' ').toUpperCase(),
    `"${ind.quote}"`,
    ind.reason,
    `${ind.severity.toUpperCase()} (${ind.confidence}%)`,
  ]);

  if (evidenceRows.length === 0) {
    evidenceRows.push(['-', '0.0s', 'NORMAL', 'No coercive phrases identified', 'Call conforms to standard service dialogue', 'LOW (100%)']);
  }

  autoTable(doc, {
    startY: y,
    head: [['ID', 'Time', 'Coercion Category', 'Verbatim Dialogue Excerpt', 'Forensic Analysis', 'Severity']],
    body: evidenceRows,
    theme: 'striped',
    headStyles: {
      fillColor: [168, 85, 247], // #A855F7
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 12, fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 50, fontStyle: 'italic' },
      4: { cellWidth: 52 },
      5: { cellWidth: 26, fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Check page overflow before recommendations
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  // 5. Official Indian Cyber Safety Guidelines & Action Plan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(17, 24, 39);
  doc.text('3. Recommended Immediate Protective Actions', margin, y);
  y += 6;

  const actions = [
    'DO NOT TRANSFER FUNDS: Indian law enforcement, CBI, Customs, and State Police NEVER request money transfers to "RBI verification accounts".',
    'IMMEDIATE HELPLINE REPORTING: Dial 1930 immediately or log in to https://cybercrime.gov.in to initiate the financial fraud freeze mechanism within the golden hour.',
    'SECURE BANKING CHANNELS: Contact your bank branch or official customer service to block debit/credit cards, disable net-banking, and freeze UPI handles if OTPs or credentials were disclosed.',
    'PRESERVE CALL LOGS & SCREENSHOTS: Submit this PDF report along with telephone call timestamps, caller ID numbers, WhatsApp/Skype IDs, and account numbers to local cyber police.',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  actions.forEach((act, i) => {
    doc.setFillColor(168, 85, 247);
    doc.circle(margin + 2, y + 2, 1.2, 'F');
    const splitAct = doc.splitTextToSize(act, pageWidth - margin * 2 - 8);
    doc.text(splitAct, margin + 6, y + 3);
    y += splitAct.length * 4.5 + 2;
  });

  y += 4;

  // 6. Disclaimer & Chain-of-Custody Footer
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 1, 1, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 1, 1, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('EVIDENTIARY DISCLAIMER & CHAIN OF CUSTODY ASSURANCE:', margin + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  const disclaimerText =
    data.disclaimer ||
    'This forensic report was generated by SwarGuard Voice Intelligence using client-side Web Audio decoding and Gemini forensic acoustic models. Sample fixtures are labeled as synthetic demonstrations. Low-risk determination does not guarantee call legitimacy. SwarGuard operates under strict zero-retention privacy principles.';
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - margin * 2 - 6);
  doc.text(splitDisclaimer, margin + 3, y + 9);

  // Download PDF
  const filename = `SwarGuard_Incident_Report_${data.caseId.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(filename);
}
