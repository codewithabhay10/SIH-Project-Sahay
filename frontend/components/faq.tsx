"use client"

import { useState, useEffect } from "react"
import { getTranslation } from "@/lib/translations"

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [animateElements, setAnimateElements] = useState(false)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en'
    setLanguage(savedLang)

    const handleLanguageChange = (event: Event) => {
      try {
        const ce = event as CustomEvent<{ language: string }>;
        const newLang = ce?.detail?.language || localStorage.getItem('selectedLanguage') || 'en';
        // eslint-disable-next-line no-console
        console.debug('[FAQ] languageChange received:', newLang);
        setLanguage(newLang);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[FAQ] failed to handle languageChange', err);
      }
    }

    window.addEventListener('languageChange', handleLanguageChange as EventListener)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateElements(true)
        }
      },
      { threshold: 0.2 }
    )

    const section = document.getElementById("faq")
    if (section) observer.observe(section)

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener)
      observer.disconnect()
    }
  }, [])

  return (
    <section id="faq" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Background Container */}
        <div
          className="relative rounded-3xl overflow-hidden p-12"
          style={{
            backgroundImage:
              "url(https://framerusercontent.com/images/gDTSJhM46wbHL90G2IUodOW4uuY.png?width=1988&height=1446)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section Header */}
            <div
              className={`text-center space-y-6 transition-all duration-1000 ${
                animateElements ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Badge */}
              <div className="flex justify-center">
                <div
                  className="flex items-center gap-3 px-6 py-3"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "99px",
                    border: "3px solid rgba(255, 255, 255, 0.8)",
                    display: "inline-flex",
                  }}
                >
                  {/* Left Gradient Dot */}
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "radial-gradient(50% 50%, rgb(255, 162, 0) 0%, rgba(255, 162, 0, 0.69) 100%)",
                    }}
                  />
                  <p className="text-sm font-medium" style={{ color: "rgb(94, 64, 0)" }}>
                    {getTranslation(language, 'faq.badge')}
                  </p>
                  {/* Right Gradient Dot */}
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "radial-gradient(50% 50%, rgb(255, 162, 0) 0%, rgba(255, 162, 0, 0.69) 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Heading */}
              <h3
                className="text-4xl md:text-5xl font-medium"
                style={{ textAlign: "center", color: "rgb(15, 15, 15)" }}
              >
                {getTranslation(language, 'faq.title')}
              </h3>

              {/* Description */}
              <p className="text-base" style={{ textAlign: "center", color: "rgb(15, 15, 15)" }}>
                {getTranslation(language, 'faq.description')}
              </p>
            </div>

            {/* FAQ Items */}
            <div
              className={`space-y-4 transition-all duration-1000 ${
                animateElements ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              {getTranslation(language, 'faq.items').map((faq: any, i: number) => (
                <div
                  key={i}
                  className="transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "20px",
                  }}
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-white/10"
                    style={{
                      border: "1px solid rgb(252, 252, 252)",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      borderRadius: "14px",
                    }}
                  >
                    <p
                      className="text-base font-normal text-left"
                      style={{
                        color: "rgb(38, 60, 72)",
                      }}
                    >
                      {faq.question}
                    </p>
                    <div className="shrink-0 ml-4">
                      <img
                        src="https://framerusercontent.com/images/IfsCgRy56bOVnOlgBKmmWtjavGA.png"
                        alt=""
                        className="w-8 h-8 object-cover transition-transform duration-300"
                        style={{
                          transform: expandedIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </div>
                  </button>
                  {expandedIndex === i && (
                    <div
                      className="px-6 pb-5 pt-3 text-sm"
                      style={{
                        color: "rgb(38, 60, 72)",
                        borderTop: "1px solid rgba(252, 252, 252, 0.5)",
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div
              className={`text-center transition-all duration-1000 ${
                animateElements ? "opacity-100" : "opacity-0"
              }`}
            >
              <a
                href="mailto:support@sahay.gov.in"
                className="inline-block px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:scale-105"
                style={{
                  backgroundColor: "rgb(255, 174, 0)",
                  border: "3px solid rgb(255, 255, 255)",
                  color: "rgb(94, 64, 0)",
                }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
