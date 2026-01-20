import { useState, useEffect, useCallback } from 'react';

interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

interface TranslationResponse {
  original_text: string;
  final_translation: string;
  groq_translation: string;
  similarity_score: number;
  iterations_used: number;
  threshold_met: boolean;
  source_lang: string;
  target_lang: string;
}

const cache: TranslationCache = {};

const API_BASE_URL = 'http://localhost:8000';

export function useTranslationApi() {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(savedLanguage);

    // Listen for language change events
    const handleLanguageChange = (event: CustomEvent<{ language: string }>) => {
      const newLang = event.detail.language;
      console.log('Language changed to:', newLang);
      setLanguage(newLang);
      // Clear translations to force re-fetch
      setTranslations({});
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const translateText = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'en') {
      return text;
    }

    // Check cache first
    if (cache[text] && cache[text][targetLang]) {
      return cache[text][targetLang];
    }

    // NOTE: Translation endpoint not available in current backend
    // Returning original text. For production, integrate with translation service
    // or use the chatbot's multi-language capability
    
    // Uncomment below when /translate endpoint is available:
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          source_lang: 'en',
          target_lang: targetLang
        }),
      });

      if (response.ok) {
        const data: TranslationResponse = await response.json();
        const translated = data.final_translation || text;
        
        // Cache the translation
        if (!cache[text]) {
          cache[text] = {};
        }
        cache[text][targetLang] = translated;
        
        return translated;
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
    */

    return text;
  }, []);

  const t = useCallback((text: string): string => {
    if (language === 'en') {
      return text;
    }
    return translations[text] || text;
  }, [language, translations]);

  const translateMultiple = useCallback(async (texts: { [key: string]: string }): Promise<{ [key: string]: string }> => {
    console.log('translateMultiple called for language:', language);
    
    if (language === 'en') {
      setTranslations(texts);
      return texts;
    }

    const translatedTexts: { [key: string]: string } = {};
    
    const entries = Object.entries(texts);
    console.log(`Translating ${entries.length} texts...`);
    
    await Promise.all(
      entries.map(async ([key, text]) => {
        const translated = await translateText(text, language);
        // Store by TEXT value, not by key, so t() can look it up
        translatedTexts[text] = translated;
        console.log(`Translated "${text}" to "${translated}"`);
      })
    );

    console.log('All translations complete, updating state');
    setTranslations(translatedTexts);
    return translatedTexts;
  }, [language, translateText]);

  return { t, language, translateMultiple, translateText };
}
