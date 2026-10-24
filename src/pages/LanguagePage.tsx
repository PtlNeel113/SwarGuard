/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Languages, Globe, Info, Check, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FixtureTag } from '../components/ui/StatusBadge';
import { useI18n } from '../i18n/i18nContext';
import { SupportedLanguage } from '../types';

export const LanguagePage: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  const languageOptions: {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    description: string;
  }[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English (Indian English)',
      description: 'Standard institutional lexicon, terminology used by courts, banks, and telecom authorities.',
    },
    {
      code: 'gu',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      description: 'Localized threat detection terminology, conversational idioms, and regional family safety copy.',
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी (Devanagari)',
      description: 'Widely understood national dialect terms, formal government impersonation markers, and police phrasing.',
    },
  ];

  // Coercive phrases comparison showing original language vs translations
  const comparativePhrases = [
    {
      context: 'Digital Arrest Isolation Threat',
      original: 'Do not disconnect this line. You are under immediate digital custody.',
      originalLang: 'English',
      staticTranslations: {
        gu: 'કોલ કાપશો નહીં. તમે ડિજિટલ કસ્ટડી હેઠળ છો.',
        hi: 'कॉल मत काटना। आप तुरंत डिजिटल हिरासत में हैं।',
      },
      category: 'Isolation',
    },
    {
      context: 'Fake KYC Countdown',
      original: 'Your bank account will be permanently blocked in 15 minutes without OTP.',
      originalLang: 'English',
      staticTranslations: {
        gu: 'ઓટીપી વિના ૧૫ મિનિટમાં તમારું બેંક એકાઉન્ટ કાયમ માટે બંધ થઈ જશે.',
        hi: 'ओटीपी के बिना 15 मिनट में आपका बैंक खाता स्थायी रूप से बंद कर दिया जाएगा।',
      },
      category: 'Artificial Urgency',
    },
    {
      context: 'Customs Contraband Extortion',
      original: 'Narcotics found in your parcel. Pay clearance fee to dismiss arrest warrant.',
      originalLang: 'English',
      staticTranslations: {
        gu: 'તમારા પાર્સલમાં ડ્રગ્સ મળ્યા છે. વોરંટ રદ કરવા ક્લીયરન્સ ફી ભરો.',
        hi: 'आपके पार्सल में नशीले पदार्थ मिले हैं। वारंट निरस्त करने हेतु शुल्क जमा करें।',
      },
      category: 'Legal Threat',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <PageHeader
        title={t('languagePage.title')}
        subtitle={t('languagePage.subtitle')}
        kicker="Inclusive Indian Call Safety"
        actions={<FixtureTag label="Multilingual Core" />}
      />

      {/* Language Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {languageOptions.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <Card
              key={opt.code}
              variant={isSelected ? 'elevated' : 'base'}
              interactive={true}
              onClick={() => setLanguage(opt.code)}
              className={`space-y-3 ${
                isSelected ? 'ring-2 ring-[#F2A65A] border-[#F2A65A]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9AA6BC]">
                  {opt.name}
                </span>
                {isSelected && (
                  <span className="p-1 rounded-full bg-[#F2A65A] text-[#0B1020]">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-[#F6F3EC]">
                {opt.nativeName}
              </h3>

              <p className="text-xs text-[#9AA6BC] leading-relaxed">
                {opt.description}
              </p>

              <div className="pt-2">
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage(opt.code);
                  }}
                  className="w-full justify-center"
                >
                  {isSelected ? 'Active Language' : `Switch to ${opt.name}`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Honest Translation Review Disclosure */}
      <div className="p-4 rounded-xl border border-[#263359] bg-[#12192F] text-xs text-[#9AA6BC] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#F2A65A] shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t('languagePage.translationDisclosure')}</p>
      </div>

      {/* Comparative Phrase Analysis: Original vs Static vs Analysis Translations */}
      <Card variant="base" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#263359]">
          <div>
            <h3 className="text-sm font-bold text-[#F6F3EC]">
              {t('languagePage.testPhrases')}
            </h3>
            <p className="text-xs text-[#9AA6BC]">
              Examine how high-pressure coercion phrasing maps across regional languages.
            </p>
          </div>
          <span className="text-xs text-[#9AA6BC] font-mono">
            Active: {language.toUpperCase()}
          </span>
        </div>

        <div className="space-y-4">
          {comparativePhrases.map((phrase, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#0B1020] border border-[#263359] space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#F2A65A]">{phrase.context}</span>
                <span className="text-[10px] text-[#9AA6BC] uppercase font-mono border border-[#263359] px-2 py-0.5 rounded">
                  {phrase.category}
                </span>
              </div>

              {/* Original Language Segment */}
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2 text-[#9AA6BC] text-[11px]">
                  <span>Original audio transcript ({phrase.originalLang}):</span>
                  <span className="text-[10px] text-[#9AA6BC]/70 uppercase">
                    Sample Audio Source
                  </span>
                </div>
                <p className="font-mono text-[#F6F3EC] p-2.5 rounded bg-[#12192F] border border-[#263359]">
                  "{phrase.original}"
                </p>
              </div>

              {/* Translated Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-lg bg-[#12192F] border border-[#263359]">
                  <div className="flex items-center justify-between text-[11px] text-[#9AA6BC] mb-1">
                    <span>Gujarati (ગુજરાતી)</span>
                    <span className="text-[10px] text-[#56D6C2]">Static translation</span>
                  </div>
                  <p className="text-[#F6F3EC] font-medium leading-relaxed" lang="gu">
                    "{phrase.staticTranslations.gu}"
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#12192F] border border-[#263359]">
                  <div className="flex items-center justify-between text-[11px] text-[#9AA6BC] mb-1">
                    <span>Hindi (हिन्दी)</span>
                    <span className="text-[10px] text-[#56D6C2]">Static translation</span>
                  </div>
                  <p className="text-[#F6F3EC] font-medium leading-relaxed" lang="hi">
                    "{phrase.staticTranslations.hi}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
