import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, languageNames, languageFlags } from '../i18n/translations';

const languages: Language[] = ['pt-BR', 'en', 'es', 'de', 'zh', 'ru', 'fil', 'vi'];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if language was auto-detected
  const isAutoDetected = localStorage.getItem('language-auto-detected') === 'true';

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Current Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md bg-black/40 border border-yellow-500/30 hover:border-yellow-500/50 hover:bg-black/60 transition-all duration-300 group"
      >
        <Globe className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-2xl leading-none">{languageFlags[language]}</span>
        {isAutoDetected && (
          <span 
            className="hidden md:block text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30"
            title="Idioma detectado automaticamente"
          >
            Auto
          </span>
        )}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
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
          <div className="absolute top-full right-0 mt-2 w-56 backdrop-blur-lg bg-black/90 border border-yellow-500/30 rounded-xl shadow-2xl shadow-yellow-500/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Info Header */}
            {isAutoDetected && (
              <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20">
                <p className="text-xs text-blue-400 flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Detectado automaticamente
                </p>
              </div>
            )}
            
            <div className="p-2 space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    language === lang
                      ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                      : 'text-gray-300 hover:bg-white/5 hover:text-yellow-500 border border-transparent'
                  }`}
                >
                  <span className="text-2xl leading-none">{languageFlags[lang]}</span>
                  <span className="flex-1 text-left font-medium">{languageNames[lang]}</span>
                  {language === lang && (
                    <svg
                      className="w-5 h-5 text-yellow-500"
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
            <div className="px-4 py-2 border-t border-yellow-500/20 bg-black/50">
              <p className="text-xs text-gray-500 text-center">
                {languages.length} idiomas disponíveis
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}