"use client"

import { useEffect, useState } from "react"
import { getTranslation } from "@/lib/translations"

export default function Footer() {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en'
    setLanguage(savedLang)

    const handleLanguageChange = (event: Event) => {
      try {
        const ce = event as CustomEvent<{ language: string }>;
        const newLang = ce?.detail?.language || localStorage.getItem('selectedLanguage') || 'en';
        // eslint-disable-next-line no-console
        console.debug('[Footer] languageChange received:', newLang);
        setLanguage(newLang);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[Footer] failed to handle languageChange', err);
      }
    }

    window.addEventListener('languageChange', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener)
    }
  }, [])
  return (
    <footer className="py-12 px-6" style={{ width: "100%", opacity: 1 }}>
      <div className="max-w-7xl mx-auto" style={{ opacity: 1 }}>
        <div
          className="rounded-[40px] p-12"
          style={{
            border: "1px solid rgba(237, 239, 243, 0.5)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(10px)",
            opacity: 1,
          }}
        >
          <div className="flex flex-col lg:flex-row gap-12" style={{ opacity: 1 }}>
            {/* Logo and Description */}
            <div className="flex-1 space-y-4" style={{ opacity: 1 }}>
              <a href="./" className="inline-block" style={{ borderRadius: "10px", opacity: 1 }}>
                <div style={{ borderRadius: "10px", opacity: 1 }}>
                  <img
                    src="https://framerusercontent.com/images/vTOb6B02y0BqN1vVhaRu2HxvB0.png?width=488&height=172"
                    alt="logo"
                    className="h-12 w-auto object-cover"
                  />
                </div>
              </a>
              <p className="text-sm" style={{ color: "rgb(38, 60, 72)", opacity: 1 }}>
                {getTranslation(language, 'footer.description')}
              </p>
            </div>

            {/* Menu Sections */}
            <div className="flex flex-col sm:flex-row gap-12" style={{ opacity: 1 }}>
              {/* Pages */}
              <div className="space-y-4" style={{ opacity: 1 }}>
                <h4
                  className="font-semibold"
                  style={{ color: "rgb(38, 60, 72)", opacity: 1 }}
                >
                  {getTranslation(language, 'footer.pages')}
                </h4>
                <div className="space-y-2" style={{ opacity: 1 }}>
                  <a
                    href="./#features"
                    className="block text-sm hover:text-orange-500 transition-colors"
                    style={{
                      color: "rgb(38, 60, 72)",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      borderRadius: "99px",
                      opacity: 1,
                    }}
                  >
                    {getTranslation(language, 'footer.features')}
                  </a>
                  <a
                    href="./"
                    className="block text-sm hover:text-orange-500 transition-colors"
                    style={{
                      color: "rgb(38, 60, 72)",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      borderRadius: "99px",
                      opacity: 1,
                    }}
                  >
                    {getTranslation(language, 'footer.pricing')}
                  </a>
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-4" style={{ opacity: 1 }}>
                <h4
                  className="font-semibold"
                  style={{ color: "rgb(38, 60, 72)", opacity: 1 }}
                >
                  {getTranslation(language, 'footer.resources')}
                </h4>
                <div className="space-y-2" style={{ opacity: 1 }}>
                  <a
                    href="./"
                    className="block text-sm hover:text-orange-500 transition-colors"
                    style={{
                      color: "rgb(38, 60, 72)",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      borderRadius: "99px",
                      opacity: 1,
                    }}
                  >
                    {getTranslation(language, 'footer.blog')}
                  </a>
                  <a
                    href="./contact"
                    className="block text-sm hover:text-orange-500 transition-colors"
                    style={{
                      color: "rgb(38, 60, 72)",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      borderRadius: "99px",
                      opacity: 1,
                    }}
                  >
                    {getTranslation(language, 'footer.contact')}
                  </a>
                </div>
              </div>

              {/* Utility Pages */}
              <div className="space-y-4" style={{ opacity: 1 }}>
                <h4
                  className="font-semibold"
                  style={{ color: "rgb(38, 60, 72)", opacity: 1 }}
                >
                  {getTranslation(language, 'footer.utility')}
                </h4>
                <div className="space-y-2" style={{ opacity: 1 }}>
                  <a
                    href="./privacy-policy"
                    className="block text-sm hover:text-orange-500 transition-colors"
                    style={{
                      color: "rgb(38, 60, 72)",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      borderRadius: "99px",
                      opacity: 1,
                    }}
                  >
                    {getTranslation(language, 'footer.privacy')}
                  </a>
                  <a
                    href="./404"
                    className="block text-sm hover:text-orange-500 transition-colors"
                    style={{
                      color: "rgb(38, 60, 72)",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      borderRadius: "99px",
                      opacity: 1,
                    }}
                  >
                    {getTranslation(language, 'footer.notFound')}
                  </a>
                </div>
              </div>

              {/* Helpdesk */}
              <div className="space-y-4" style={{ opacity: 1 }}>
                <h4
                  className="font-semibold"
                  style={{ color: "rgb(38, 60, 72)", opacity: 1 }}
                >
                  {getTranslation(language, 'footer.helpdesk')}
                </h4>
                <div className="space-y-3" style={{ opacity: 1 }}>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: "#FF9900" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a
                      href="tel:1800-XXX-XXXX"
                      className="text-sm hover:text-[#FF9900] transition-colors"
                      style={{ color: "rgb(38, 60, 72)" }}
                    >
                      {getTranslation(language, 'footer.tollFree')}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: "#FF9900" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a
                      href="mailto:support@sahay.gov.in"
                      className="text-sm hover:text-[#FF9900] transition-colors"
                      style={{ color: "rgb(38, 60, 72)" }}
                    >
                      {getTranslation(language, 'footer.email')}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: "#FF9900" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span
                      className="text-sm"
                      style={{ color: "rgb(38, 60, 72)" }}
                    >
                      {getTranslation(language, 'footer.workingHours')}
                    </span>
                  </div>
                  <a
                    href="./raise-issue"
                    className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-colors mt-2"
                    style={{ color: "#FF9900" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getTranslation(language, 'footer.raiseIssue')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
