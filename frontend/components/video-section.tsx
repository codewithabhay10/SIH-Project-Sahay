"use client";

import { useState, useEffect } from "react";
import { getTranslation } from "@/lib/translations";

// Replace YOUR_VIDEO_ID with your actual YouTube video ID after uploading
// Example: If your YouTube URL is https://youtube.com/watch?v=abc123xyz, the ID is "abc123xyz"
const YOUTUBE_VIDEO_ID = "6M6ulqkzpnk";

export default function VideoSection() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(savedLang);

    const handleLanguageChange = (event: Event) => {
      try {
        const ce = event as CustomEvent<{ language: string }>;
        const newLang = ce?.detail?.language || localStorage.getItem('selectedLanguage') || 'en';
        setLanguage(newLang);
      } catch (err) {
        console.error('[VideoSection] failed to handle languageChange', err);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  return (
    <section className="w-full py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3"
            style={{ color: "rgb(94, 64, 0)" }}
          >
            {getTranslation(language, 'video.title')}
          </h2>
          <p 
            className="text-sm md:text-base max-w-2xl mx-auto"
            style={{ color: "rgb(94, 64, 0)", opacity: 0.8 }}
          >
            {getTranslation(language, 'video.description')}
          </p>
          <p 
            className="text-xs md:text-sm mt-2 max-w-2xl mx-auto"
            style={{ color: "rgb(94, 64, 0)", opacity: 0.6 }}
          >
            Click on the video to see different intervals
          </p>
        </div>

        {/* YouTube Video Container */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-900">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1&start=11`}
            title="Sahay Platform Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Description */}
        <div className="mt-6 text-center">
          <p 
            className="text-sm"
            style={{ color: "rgb(94, 64, 0)", opacity: 0.8 }}
          >
            {getTranslation(language, 'video.caption')}
          </p>
        </div>
      </div>
    </section>
  );
}
