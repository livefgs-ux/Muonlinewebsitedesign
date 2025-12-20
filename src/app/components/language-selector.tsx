import { useState, memo, useCallback, useMemo } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, languageNames, languageFlags } from '../i18n/translations';

const languages: Language[] = ['pt-BR', 'en', 'es', 'de', 'zh', 'ru', 'fil', 'vi'];

// Language codes/abbreviations
const languageCodes: Record<Language, string> = {
  'pt-BR': 'PT',
  'en': 'EN',
  'es': 'ES',
  'de': 'DE',
  'zh': 'ZH',
  'ru': 'RU',
  'fil': 'FIL',
  'vi': 'VI',
};

export const LanguageSelector = memo(function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if language was auto-detected
  const isAutoDetected = useMemo(() => 
    localStorage.getItem('language-auto-detected') === 'true',
    []
  );

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  }, [setLanguage]);

  return (
    <div className="relative">
      {/* Current Language Button - Only Flag */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg backdrop-blur-md bg-black/60 border border-yellow-500/40 hover:border-yellow-500/70 hover:bg-black/80 transition-all duration-300 group shadow-lg shadow-black/50 hover:shadow-yellow-500/20"
      >
        <span className="text-xl leading-none">{languageFlags[language]}</span>
        <svg
          className={`w-3 h-3 text-gray-300 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Language Options */}
          <div className="absolute top-full right-0 mt-2 w-44 backdrop-blur-lg bg-black/90 border border-yellow-500/30 rounded-xl shadow-2xl shadow-yellow-500/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Info Header */}
            {isAutoDetected && (
              <div className="px-3 py-1.5 bg-blue-500/10 border-b border-blue-500/20">
                <p className="text-xs text-blue-400 flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  Auto-detectado
                </p>
              </div>
            )}
            
            <div className="p-1.5 space-y-0.5">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                    language === lang
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                      : 'text-gray-300 hover:bg-white/5 hover:text-yellow-400 border border-transparent'
                  }`}
                >
                  <span className="text-lg leading-none">{languageFlags[lang]}</span>
                  <span className="flex-1 text-left text-sm font-bold">{languageCodes[lang]}</span>
                  {language === lang && (
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Footer Info */}
            <div className="px-3 py-1.5 border-t border-yellow-500/20 bg-black/50">
              <p className="text-xs text-gray-500 text-center">
                {languages.length} idiomas
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
});