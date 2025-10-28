import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

export type Language = 'ar' | 'en';

// Define the shape of translations
type Translations = { [key: string]: string | Translations };
type TranslationStore = {
    ar?: Translations;
    en?: Translations;
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  // FIX: Update 't' function signature to accept an optional fallback string.
  t: (key: string, fallback?: string) => string;
  dir: 'rtl' | 'ltr';
  isLoaded: boolean; 
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
     if (typeof window !== 'undefined') {
        return (localStorage.getItem('language') as Language) || 'ar';
     }
     return 'ar';
  });

  const [translations, setTranslations] = useState<TranslationStore>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [arRes, enRes] = await Promise.all([
          fetch('./locales/ar.json'),
          fetch('./locales/en.json')
        ]);
        if (!arRes.ok || !enRes.ok) {
            throw new Error('Failed to fetch translation files');
        }
        const arJson = await arRes.json();
        const enJson = await enRes.json();
        setTranslations({ ar: arJson, en: enJson });
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to prevent app crash
        setIsLoaded(true); 
      }
    };
    fetchTranslations();
  }, []); // Fetch only once on mount

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('language', language);
    }
  }, [language, isLoaded]);

  // FIX: Update 't' function implementation to handle an optional fallback value.
  const t = useCallback((key: string, fallback?: string): string => {
    const defaultValue = fallback !== undefined ? fallback : key;
    if (!isLoaded) {
      return defaultValue;
    }

    const langTranslations = translations[language];
    if (!langTranslations) {
        return defaultValue;
    }

    const keys = key.split('.');
    let result: any = langTranslations;
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
            console.warn(`Translation key not found: ${key}`);
            return defaultValue;
        }
    }
    return typeof result === 'string' ? result : defaultValue;
  }, [language, translations, isLoaded]);

  // Fix: Explicitly type `dir` to prevent it from being widened to `string`.
  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';

  const value = useMemo(() => ({ language, setLanguage, t, dir, isLoaded }), [language, isLoaded, t, dir]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};