/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserPreferences, AnalysisResult, TestResult, ActivityLogItem } from '../types';

const STORAGE_KEY_PREFIX = 'swarguard_';

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  reducedMotion: 'system',
  playbackSpeed: 1.0,
  autoplay: false,
  skipIntervalSec: 5,
  warningPosition: 'top',
  autoDismissWarnings: false,
  showTranslatedWarning: true,
};

export const getStoredPreferences = (): UserPreferences => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}preferences`);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load preferences from storage', e);
    return DEFAULT_PREFERENCES;
  }
};

export const saveStoredPreferences = (prefs: Partial<UserPreferences>): void => {
  try {
    const current = getStoredPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}preferences`, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to persist preferences', e);
  }
};

export const getStoredSessionResults = (): AnalysisResult[] => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}results`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load results from storage', e);
    return [];
  }
};

export const saveStoredSessionResults = (results: AnalysisResult[]): void => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}results`, JSON.stringify(results));
  } catch (e) {
    console.warn('Failed to save session results', e);
  }
};

export const clearAllSwarGuardData = (): void => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.warn('Failed to clear storage data', e);
  }
};
