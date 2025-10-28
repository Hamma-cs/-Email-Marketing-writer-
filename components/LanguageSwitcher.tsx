import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-md text-sm font-medium text-primary-dark dark:text-light hover:bg-accent/50 dark:hover:bg-primary"
    >
      {language === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
};
