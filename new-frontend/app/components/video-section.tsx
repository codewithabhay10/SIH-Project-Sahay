'use client'

import { useState, useRef } from 'react'

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-center text-white mb-8">
          See How Sahay Works
        </h3>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          {/* Video placeholder - replace with actual video */}
          <div className="aspect-video bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover absolute inset-0"
              poster="/video-poster.jpg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Play button overlay */}
            <button
              onClick={togglePlay}
              className="relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-xl"
            >
              {isPlaying ? (
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-orange-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-6">
          Watch our 2-minute introduction video to learn about the platform features
        </p>
      </div>
    </section>
  )
}
