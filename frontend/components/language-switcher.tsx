"use client";

import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLang);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('selectedLanguage', langCode);
    // Dispatch custom event for other components to listen
    // Use composed/bubbles to improve cross-context delivery and add a debug log
    // eslint-disable-next-line no-console
    console.debug('[LanguageSwitcher] dispatching languageChange:', langCode);
    const event = new CustomEvent('languageChange', {
      detail: { language: langCode },
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(event);
    // If Hindi is selected, prompt the user to reload the page to ensure all static
    // content and server-rendered text update. Use a simple confirm dialog for now.
    if (langCode === 'hi') {
      // eslint-disable-next-line no-restricted-globals
      const msg = 'Language set to Hindi. Reload the page to apply translations? / भाषा हिंदी सेट की गई है। पृष्ठ को पुनः लोड करें?';
      // eslint-disable-next-line no-restricted-globals
      if (confirm(msg)) {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
    }
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline">
          {languages.find(lang => lang.code === currentLanguage)?.nativeName || 'English'}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-500">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center justify-between ${
              currentLanguage === language.code ? 'bg-orange-50 text-[#EA9000]' : 'text-gray-700'
            }`}
          >
            <span>{language.nativeName}</span>
            {currentLanguage === language.code && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
