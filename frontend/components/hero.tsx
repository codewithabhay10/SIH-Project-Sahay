"use client"

import { useEffect, useState } from "react"
import { translations, getTranslation } from "@/lib/translations"

export default function Hero() {
  const [animateElements, setAnimateElements] = useState(false)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    setAnimateElements(true)
    
    // Get saved language
    const savedLang = localStorage.getItem('selectedLanguage') || 'en'
    setLanguage(savedLang)
    
    // Listen for language changes (robust runtime handler)
    const handleLanguageChange = (event: Event) => {
      try {
        const ce = event as CustomEvent<{ language: string }>;
        const newLang = ce?.detail?.language || localStorage.getItem('selectedLanguage') || 'en';
        // eslint-disable-next-line no-console
        console.debug('[Hero] languageChange received:', newLang);
        setLanguage(newLang);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[Hero] failed to handle languageChange', err);
      }
    }

    window.addEventListener('languageChange', handleLanguageChange as EventListener)
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener)
    }
  }, [])
  
  const t = (path: string) => getTranslation(language, path)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* Decorative fan element */}
      <div className="absolute left-0 top-1/4 w-96 h-96 opacity-40 animate-float">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M100 20 L120 180 L100 160 L80 180 Z" fill="#FFA500" opacity="0.3" />
          <path d="M100 20 L130 140 L100 120 L70 140 Z" fill="#FFB84D" opacity="0.25" />
          <path d="M100 20 L140 100 L100 90 L60 100 Z" fill="#FFC866" opacity="0.2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8">
        {/* Badge */}
        <div
          className={`inline-flex transition-all duration-700 ${animateElements ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className="flex items-center gap-3 px-6 py-3"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "99px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "radial-gradient(50% 50%, rgb(255, 162, 0) 0%, rgba(255, 162, 0, 0.69) 100%)",
                borderRadius: "1000px",
              }}
            />
            <p className="text-sm font-medium" style={{ color: "rgb(94, 64, 0)" }}>
              {t('hero.badge')}
            </p>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "radial-gradient(50% 50%, rgb(255, 162, 0) 0%, rgba(255, 162, 0, 0.69) 100%)",
                borderRadius: "1000px",
              }}
            />
          </div>
        </div>

        {/* Main Heading */}
        <h1
          className={`font-medium text-center transition-all duration-700 ${animateElements ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{
            fontSize: "52px",
            fontWeight: 500,
            lineHeight: "120%",
            color: "rgb(94, 64, 0)",
          }}
        >
          {t('hero.title.part1')} <span style={{ color: "rgb(255, 174, 0)" }}>{t('hero.title.highlight')}</span> {t('hero.title.part2')}
        </h1>

        {/* Description */}
        <p
          className={`text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${animateElements ? "opacity-100" : "opacity-0"}`}
          style={{ color: "#4A4A4A" }}
        >
          {t('hero.description')}
        </p>

        {/* Scrolling Features List */}
        <div
          className={`w-full transition-all duration-700 delay-300 ${animateElements ? "opacity-100" : "opacity-0"}`}
          style={{
            maskImage:
              "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 87.5%, rgba(0, 0, 0, 0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 87.5%, rgba(0, 0, 0, 0) 100%)",
            overflow: "hidden",
          }}
        >
          <div
            className="flex gap-3 py-2 animate-infinite-scroll"
            style={{
              width: "max-content",
            }}
          >
            {/* Duplicate badges for seamless loop */}
            {[
              t('hero.features.unifiedDocs'),
              t('hero.features.secureVerif'),
              t('hero.features.fastApps'),
              t('hero.features.transparentTrack'),
              t('hero.features.unifiedDocs'),
              t('hero.features.secureVerif'),
              t('hero.features.fastApps'),
              t('hero.features.transparentTrack'),
            ].map((feature, i) => (
              <div
                key={i}
                className="shrink-0"
                style={{
                  border: "3px solid rgb(252, 252, 252)",
                  backgroundColor: "rgba(250, 239, 212, 0.7)",
                  borderRadius: "99px",
                  padding: "0.5rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <img
                  src="https://framerusercontent.com/images/y87bxwvdfZajlEkVtkWXRdMs.svg?width=1024&height=1024"
                  alt=""
                  className="w-5 h-5"
                />
                <p className="text-sm font-medium whitespace-nowrap" style={{ color: "rgb(94, 64, 0)" }}>
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="/signup"
          className={`inline-block px-8 py-3 font-medium get-started-button" transition-all hover:shadow-lg hover:scale-105 duration-700 ${animateElements ? "opacity-100 delay-500" : "opacity-0"}`}
          style={{
            border: "3px solid rgb(255, 255, 255)",
            backgroundColor: "rgb(255, 174, 0)",
            borderRadius: "99px",
            color: "rgb(94, 64, 0)",
          }}
        >
          {t('hero.cta')}
        </a>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 20s linear infinite;
        }
      `}</style>
    </section>
  )
}
