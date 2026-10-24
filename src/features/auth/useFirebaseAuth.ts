/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../../lib/firebase';
import { AnalysisResult } from '../../types';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      if (currentUser) {
        // Upsert user profile to Firestore
        const userDocPath = `users/${currentUser.uid}`;
        try {
          await setDoc(
            doc(db, 'users', currentUser.uid),
            {
              userId: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Anonymous User',
              photoURL: currentUser.photoURL || '',
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.error('Failed to sync user profile to Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setAuthError(err.message || 'Google sign-in failed');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  // Save analysis record to Firestore
  const saveAnalysisToFirestore = async (analysis: AnalysisResult) => {
    if (!user) return;
    const path = `users/${user.uid}/analysisRecords`;
    try {
      await addDoc(collection(db, 'users', user.uid, 'analysisRecords'), {
        id: analysis.id,
        userId: user.uid,
        fileName: analysis.fileName || 'Audio Recording',
        overallRisk: analysis.overallRisk,
        status: analysis.status,
        source: analysis.source,
        durationSec: analysis.durationSec || 0,
        warningLatencySec: analysis.warningLatencySec || 0,
        evidenceCount: analysis.evidence.length,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  // Save chat message to Firestore
  const saveChatMessageToFirestore = async (
    role: 'user' | 'model' | 'system',
    content: string,
    modelUsed: string,
    botRole: string
  ) => {
    if (!user) return;
    const path = `users/${user.uid}/chatMessages`;
    try {
      await addDoc(collection(db, 'users', user.uid, 'chatMessages'), {
        id: `msg-${Date.now()}`,
        userId: user.uid,
        role,
        content,
        modelUsed,
        botRole,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  // Save transcription to Firestore
  const saveTranscriptionToFirestore = async (
    transcriptText: string,
    audioDurationSec: number,
    modelUsed: string = 'gemini-3.5-transcribe'
  ) => {
    if (!user) return;
    const path = `users/${user.uid}/transcriptions`;
    try {
      await addDoc(collection(db, 'users', user.uid, 'transcriptions'), {
        id: `trans-${Date.now()}`,
        userId: user.uid,
        transcriptText,
        audioDurationSec,
        modelUsed,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  return {
    user,
    isLoading,
    authError,
    signInWithGoogle,
    signOut,
    saveAnalysisToFirestore,
    saveChatMessageToFirestore,
    saveTranscriptionToFirestore,
  };
};
