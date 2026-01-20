"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { getTranslation } from "@/lib/translations";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [language, setLanguage] = useState('en');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Get saved language
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(savedLang);

    // Listen for language changes
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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

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
        </div>

        {/* Video Container */}
        <div 
          className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-900"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onClick={togglePlay}
          >
            <source src="/WhatsApp Video 2025-12-09 at 17.59.45_c3e09a07.mp4#t=11" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play Button Overlay (shown when paused) */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-all duration-300"
              onClick={togglePlay}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#FF9900] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" fill="white" />
              </div>
            </div>
          )}

          {/* Video Controls */}
          <div 
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>

                {/* Mute/Unmute Button */}
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={handleFullscreen}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <Maximize className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
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
