"use client"

import { useEffect, useState } from "react"
import { getTranslation } from "@/lib/translations"

export default function Header() {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en'
    setLanguage(savedLang)

    const handleLanguageChange = (event: Event) => {
      try {
        const ce = event as CustomEvent<{ language: string }>;
        const newLang = ce?.detail?.language || localStorage.getItem('selectedLanguage') || 'en';
        // eslint-disable-next-line no-console
        console.debug('[Header] languageChange received:', newLang);
        setLanguage(newLang);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[Header] failed to handle languageChange', err);
      }
    }

    window.addEventListener('languageChange', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener)
    }
  }, [])

  const t = (path: string) => getTranslation(language, path)
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-5xl px-6 py-6">
        <div
          className="flex items-center justify-between px-8 py-4"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "99px",
            border: "3px solid rgb(255, 255, 255)",
          }}
        >
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <a href="./" className="block" style={{ borderRadius: "10px" }}>
              <div style={{ borderRadius: "10px" }}>
                <img
                  decoding="auto"
                  width="488"
                  height="172"
                  src="https://framerusercontent.com/images/vTOb6B02y0BqN1vVhaRu2HxvB0.png?width=488&height=172"
                  alt="Sahay logo"
                  className="h-10 w-auto object-cover"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            </a>
          </div>

          {/* Navigation */}
          <nav
            className="hidden md:flex items-center gap-2"
            style={{ borderRadius: "99px" }}
          >
            <a
              href="./#stats"
              className="px-6 py-2 rounded-full transition-all group"
              style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            >
              <p className="text-sm font-medium transition-colors group-hover:text-white" style={{ color: "rgb(94, 64, 0)" }}>
                {t('header.stats')}
              </p>
            </a>
            <a
              href="./#features"
              className="px-6 py-2 rounded-full transition-all group"
              style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            >
              <p className="text-sm font-medium transition-colors group-hover:text-white" style={{ color: "rgb(94, 64, 0)" }}>
                {t('header.features')}
              </p>
            </a>
            <a
              href="./#faq"
              className="px-6 py-2 rounded-full transition-all group"
              style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            >
              <p className="text-sm font-medium transition-colors group-hover:text-white" style={{ color: "rgb(94, 64, 0)" }}>
                {t('header.faq')}
              </p>
            </a>
          </nav>

          {/* CTA Button */}
          <a
            href="/signup"
            className="px-6 py-2 rounded-full font-medium transition-all hover:shadow-lg"
            style={{
              backgroundColor: "rgb(255, 174, 0)",
              border: "3px solid rgb(255, 255, 255)",
              borderRadius: "99px",
              color: "rgb(94, 64, 0)",
            }}
          >
            {t('header.cta')}
          </a>
        </div>
      </nav>
    </header>
  );
}
