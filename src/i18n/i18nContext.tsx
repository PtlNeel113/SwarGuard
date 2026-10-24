/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import { getStoredPreferences, saveStoredPreferences } from '../lib/storage';
import en from './en.json';
import gu from './gu.json';
import hi from './hi.json';

type LocaleDictionary = typeof en;

const dictionaries: Record<SupportedLanguage, LocaleDictionary> = {
  en: en as LocaleDictionary,
  gu: gu as unknown as LocaleDictionary,
  hi: hi as unknown as LocaleDictionary,
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyPath: string, variables?: Record<string, string | number>) => string;
  dict: LocaleDictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return getStoredPreferences().language || 'en';
  });

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    saveStoredPreferences({ language: newLang });
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const dict = dictionaries[language] || dictionaries.en;

  const t = (keyPath: string, variables?: Record<string, string | number>): string => {
    const keys = keyPath.split('.');
    let value: any = dict;
    let fallbackValue: any = dictionaries.en;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        value = undefined;
      }

      if (fallbackValue && typeof fallbackValue === 'object' && key in fallbackValue) {
        fallbackValue = fallbackValue[key];
      } else {
        fallbackValue = undefined;
      }
    }

    let result = typeof value === 'string' ? value : typeof fallbackValue === 'string' ? fallbackValue : keyPath;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return result;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dict }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
