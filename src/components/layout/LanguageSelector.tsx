/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { SupportedLanguage } from '../../types';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, setLanguage } = useI18n();

  const options: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'hi', label: 'हिन्दी' },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-lg bg-[#0B1020] border border-[#263359] ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {options.map((opt) => {
        const isActive = language === opt.code;
        return (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            aria-pressed={isActive}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-[#171F3A] text-[#F2A65A] border border-[#263359] shadow-xs'
                : 'text-[#9AA6BC] hover:text-[#F6F3EC]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
