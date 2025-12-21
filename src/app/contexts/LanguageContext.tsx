import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, languageNames } from '../i18n/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languageNames: Record<Language, string>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Helper function to get nested properties by dot notation
 * Example: getNestedValue(obj, 'nav.home') -> obj.nav.home
 */
const getNestedValue = (obj: any, path: string): string => {
  try {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result === undefined || result === null) {
        return path; // Return the path if we hit undefined
      }
      result = result[key];
    }

    return typeof result === 'string' ? result : path;
  } catch (error) {
    console.error(`Error getting nested value for path: "${path}"`, error);
    return path; // Return the path as fallback
  }
};

/**
 * Detect browser language and map to our supported languages
 */
const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'pt-BR'; // SSR fallback

  // Try to get saved language from localStorage
  const savedLanguage = localStorage.getItem('language') as Language;
  if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
    return savedLanguage;
  }

  // Try to match browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'pt-BR';

  // Map browser language to supported languages
  if (browserLang.startsWith('pt')) return 'pt-BR';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('fil') || browserLang.startsWith('tl')) return 'fil';
  if (browserLang.startsWith('vi')) return 'vi';
  if (browserLang.startsWith('en')) return 'en';

  // Default to Portuguese BR
  return 'pt-BR';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with Portuguese BR to prevent hydration issues
  const [language, setLanguageState] = useState<Language>('pt-BR');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language on mount (client-side only)
  useEffect(() => {
    const detectedLanguage = getBrowserLanguage();
    setLanguageState(detectedLanguage);
    setIsInitialized(true);
  }, []);

  // When language changes, save to localStorage
  const setLanguage = (newLanguage: Language) => {
    console.log(`🔄 Mudando idioma para: ${newLanguage}`);
    setLanguageState(newLanguage);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
      // Mark that user manually changed language
      localStorage.setItem('language-auto-detected', 'false');
    }
  };

  /**
   * Translation function using dot notation
   * Example: t('nav.home') -> translations[language].nav.home
   */
  const t = (key: string): string => {
    try {
      // Ensure we have a valid language before attempting translation
      if (!language || !translations[language]) {
        return key;
      }
      
      const translation = getNestedValue(translations[language], key);
      
      // Debug mode: log missing translations in development (only after initialization)
      if (isInitialized && translation === key && process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Missing translation for key: "${key}" in language: "${language}"`);
      }
      
      return translation || key; // Always return at least the key if translation fails
    } catch (error) {
      console.error(`Error translating key: "${key}"`, error);
      return key; // Fallback to key
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to use language context
 * Must be used within a LanguageProvider
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    // During hot-reload or SSR, context might not be available
    // Return default values to prevent crashes
    // This is expected during initial load, so we don't warn
    return {
      language: 'pt-BR',
      setLanguage: () => {},
      t: (key: string) => key,
      languageNames,
    };
  }

  return context;
};