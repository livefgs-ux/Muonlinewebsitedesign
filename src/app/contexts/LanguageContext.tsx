import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Function to detect browser language and map to our supported languages
function detectBrowserLanguage(): Language {
  // Get browser languages (ordered by preference)
  const browserLanguages = navigator.languages || [navigator.language];
  
  // Mapping of browser language codes to our Language types
  const languageMap: Record<string, Language> = {
    'pt': 'pt-BR',
    'pt-BR': 'pt-BR',
    'pt-PT': 'pt-BR',
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
    'es': 'es',
    'es-ES': 'es',
    'es-MX': 'es',
    'de': 'de',
    'de-DE': 'de',
    'zh': 'zh',
    'zh-CN': 'zh',
    'zh-TW': 'zh',
    'ru': 'ru',
    'ru-RU': 'ru',
    'fil': 'fil',
    'tl': 'fil', // Tagalog -> Filipino
    'vi': 'vi',
    'vi-VN': 'vi',
  };

  // Try to find a matching language
  for (const browserLang of browserLanguages) {
    // Try exact match first
    if (languageMap[browserLang]) {
      console.log(`🌐 Idioma detectado: ${browserLang} -> ${languageMap[browserLang]}`);
      return languageMap[browserLang];
    }
    
    // Try matching just the language code (e.g., "en" from "en-US")
    const langCode = browserLang.split('-')[0];
    if (languageMap[langCode]) {
      console.log(`🌐 Idioma detectado (código): ${langCode} -> ${languageMap[langCode]}`);
      return languageMap[langCode];
    }
  }

  // Default to Portuguese BR if no match
  console.log('🌐 Idioma padrão: pt-BR');
  return 'pt-BR';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check if user has manually selected a language before
    const savedLanguage = localStorage.getItem('language');
    
    if (savedLanguage) {
      console.log(`💾 Idioma salvo encontrado: ${savedLanguage}`);
      return savedLanguage as Language;
    }
    
    // If no saved preference, auto-detect from browser
    const detectedLanguage = detectBrowserLanguage();
    console.log(`✨ Auto-detectando idioma do navegador: ${detectedLanguage}`);
    
    // Save the detected language
    localStorage.setItem('language', detectedLanguage);
    localStorage.setItem('language-auto-detected', 'true');
    
    return detectedLanguage;
  });

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem('language', language);
    // Mark that user has manually changed language (not auto-detected anymore)
    localStorage.setItem('language-auto-detected', 'false');
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}