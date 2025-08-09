import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, setLanguage, getCurrentLanguage } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setCurrentLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    setLanguage(language);
    localStorage.setItem('preferred-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage, 
      setCurrentLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};