"use client";

import { useEffect, useState } from "react";
import { getTranslation } from "@/lib/translations";

interface StatItem {
  value: string;
  labelKey: string;
  unit: string;
  targetValue: number;
}

const statsData: StatItem[] = [
  { value: "3", labelKey: "stats.faster", unit: "x", targetValue: 3 },
  { value: "99", labelKey: "stats.availability", unit: "%", targetValue: 99 },
  { value: "24", labelKey: "stats.access", unit: "h", targetValue: 24 },
];

export default function Stats() {
  const [animateElements, setAnimateElements] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0]);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Get saved language
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(savedLang);
    
    // Listen for language changes (use Event then cast to CustomEvent at runtime)
    const handleLanguageChange = (event: Event) => {
      try {
        const ce = event as CustomEvent<{ language: string }>;
        const newLang = ce?.detail?.language || localStorage.getItem('selectedLanguage') || 'en';
        // small debug log to help trace updates in dev console
        // eslint-disable-next-line no-console
        console.debug('[Stats] languageChange received:', newLang);
        setLanguage(newLang);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[Stats] failed to handle languageChange event', err);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateElements(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById("stats");
    if (section) observer.observe(section);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!animateElements) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    statsData.forEach((stat, index) => {
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const newValue = Math.floor(easedProgress * stat.targetValue);

        setAnimatedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = newValue;
          return newValues;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedValues((prev) => {
            const newValues = [...prev];
            newValues[index] = stat.targetValue;
            return newValues;
          });
        }
      }, interval);
    });
  }, [animateElements]);
  
  const t = (path: string) => getTranslation(language, path);

  return (
    <section id="stats" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Title */}
        <div className="text-center">
          <h3
            className="text-4xl md:text-5xl font-medium leading-tight"
            style={{ textAlign: "center" }}
          >
            <span style={{ color: "rgb(94, 64, 0)" }} className="inline-block">
              {(() => {
                const parts: any = getTranslation(language, 'stats.titleParts') || [];
                return parts.map((part: any, idx: number) => {
                  const isHighlight = !!part.highlight;
                  const color = isHighlight ? 'rgb(255, 174, 0)' : 'rgb(94, 64, 0)';
                  const delay = idx * 100;
                  return (
                    <span
                      key={idx}
                      className={`inline-block transition-all duration-700 ${
                        animateElements
                          ? 'opacity-100 blur-0 translate-y-0'
                          : 'opacity-0 blur-sm translate-y-2'
                      }`}
                      style={{
                        color,
                        transitionDelay: `${delay}ms`,
                        willChange: 'transform',
                        marginRight: '0.25rem'
                      }}
                    >
                      {part.text}
                    </span>
                  );
                });
              })()}
            </span>
          </h3>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {statsData.map((stat, i) => (
            <div
              key={i}
              className={`transition-all duration-700 hover:scale-105 transform ${
                animateElements
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div
                style={{
                  border: "3px solid rgb(255, 255, 255)",
                  backgroundColor: "rgba(255, 255, 255, 0.35)",
                  borderRadius: "30px",
                  padding: "2rem",
                }}
              >
                {/* Number and Suffix */}
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span
                    style={{
                      fontFamily: 'Inter, "Inter Placeholder", sans-serif',
                      fontSize: "74px",
                      fontWeight: 400,
                      letterSpacing: "-0.09em",
                      lineHeight: "1em",
                      color: "rgb(15, 15, 15)",
                    }}
                  >
                    {animatedValues[i]}
                  </span>
                  <p
                    style={{
                      fontFamily:
                        '"Clash Display", "Clash Display Placeholder", sans-serif',
                      fontSize: "56px",
                      fontWeight: 500,
                      letterSpacing: "-0.04em",
                      lineHeight: "1em",
                      color: "rgb(255, 174, 0)",
                    }}
                  >
                    {stat.unit}
                  </p>
                </div>

                {/* Label */}
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: "1.4em",
                    color: "rgb(15, 15, 15)",
                    textAlign: "center",
                  }}
                >
                  {t(stat.labelKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
