"use client";

import { useEffect, useRef, useState } from "react";
import Shepherd from "shepherd.js";
import type { Tour } from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

// Tour translations
const tourTranslations = {
  en: {
    welcome: {
      title: "Welcome to Sahay! 🎉",
      text: "Let's take a quick tour to help you get started with our platform.",
      button: "Start Tour",
    },
    magnifyingGlass: {
      title: "Magnifying Glass 🔍",
      text: "Use this tool to zoom in and view any part of the page more clearly. Click to activate and move your mouse around.",
    },
    chatbot: {
      title: "AI Assistant 🤖",
      text: "Need help? Click here to chat with our AI assistant. It can answer your questions and guide you through the platform.",
    },
    getStarted: {
      title: "Get Started 🚀",
      text: "Ready to begin? Click here to sign up or log in to access all features of Sahay.",
      button: "Finish Tour",
    },
  },
  hi: {
    welcome: {
      title: "सहाय में आपका स्वागत है! 🎉",
      text: "आइए हमारे प्लेटफ़ॉर्म के साथ शुरुआत करने में आपकी मदद के लिए एक त्वरित दौरा करें।",
      button: "दौरा शुरू करें",
    },
    magnifyingGlass: {
      title: "आवर्धक लेंस 🔍",
      text: "पृष्ठ के किसी भी हिस्से को अधिक स्पष्ट रूप से देखने के लिए इस उपकरण का उपयोग करें। सक्रिय करने के लिए क्लिक करें और अपने माउस को इधर-उधर घुमाएं।",
    },
    chatbot: {
      title: "एआई सहायक 🤖",
      text: "मदद चाहिए? हमारे एआई सहायक के साथ चैट करने के लिए यहां क्लिक करें। यह आपके सवालों का जवाब दे सकता है और प्लेटफ़ॉर्म में आपका मार्गदर्शन कर सकता है।",
    },
    getStarted: {
      title: "शुरू करें 🚀",
      text: "शुरू करने के लिए तैयार हैं? सहाय की सभी सुविधाओं तक पहुंचने के लिए साइन अप या लॉग इन करने के लिए यहां क्लिक करें।",
      button: "दौरा समाप्त करें",
    },
  },
};

export default function WebTour() {
  const tourRef = useRef<Tour | null>(null);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [shouldStartTour, setShouldStartTour] = useState(false);

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      const newLang = event.detail as "en" | "hi";
      setLanguage(newLang);

      // Mark that user has selected a language
      localStorage.setItem("languageSelected", "true");

      // Check if tour should start
      const tourCompleted = localStorage.getItem("tourCompleted");
      if (!tourCompleted) {
        setShouldStartTour(true);
      }
    };

    window.addEventListener(
      "languageChange",
      handleLanguageChange as EventListener
    );

    // Check initial language from localStorage
    const savedLang = localStorage.getItem("selectedLanguage") as
      | "en"
      | "hi"
      | null;
    if (savedLang) {
      setLanguage(savedLang);

      // Check if language was just selected and tour not completed
      const languageSelected = localStorage.getItem("languageSelected");
      const tourCompleted = localStorage.getItem("tourCompleted");

      if (languageSelected && !tourCompleted) {
        setShouldStartTour(true);
      }
    }

    return () => {
      window.removeEventListener(
        "languageChange",
        handleLanguageChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (!shouldStartTour) return;

    // Wait a bit for components to render and language selector to close
    const timer = setTimeout(() => {
      startTour();
      setShouldStartTour(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [shouldStartTour, language]);

  const startTour = () => {
    // Clean up existing tour
    if (tourRef.current) {
      tourRef.current.complete();
      tourRef.current = null;
    }

    const translations = tourTranslations[language];

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        classes: "shepherd-theme-custom",
        scrollTo: { behavior: "smooth", block: "center" },
      },
    });

    tourRef.current = tour;

    // Step 1: Welcome
    tour.addStep({
      id: "welcome",
      text: `<div style="text-align: center; padding: 10px;">
        <h3 style="margin-bottom: 10px; font-size: 1.25rem; font-weight: bold;">${translations.welcome.title}</h3>
        <p style="margin-bottom: 0;">${translations.welcome.text}</p>
      </div>`,
      buttons: [
        {
          text: translations.welcome.button,
          action: tour.next,
          classes: "shepherd-button-primary",
        },
      ],
    });

    // Step 2: Magnifying Glass
    tour.addStep({
      id: "magnifying-glass",
      text: `<div style="padding: 10px;">
        <h3 style="margin-bottom: 10px; font-size: 1.1rem; font-weight: bold;">${translations.magnifyingGlass.title}</h3>
        <p style="margin-bottom: 0;">${translations.magnifyingGlass.text}</p>
      </div>`,
      attachTo: {
        element: ".magnifying-glass-toggle",
        on: "bottom",
      },
      buttons: [
        {
          text: language === "en" ? "Next" : "अगला",
          action: tour.next,
          classes: "shepherd-button-primary",
        },
      ],
    });

    // Step 3: Chatbot
    tour.addStep({
      id: "chatbot",
      text: `<div style="padding: 10px;">
        <h3 style="margin-bottom: 10px; font-size: 1.1rem; font-weight: bold;">${translations.chatbot.title}</h3>
        <p style="margin-bottom: 0;">${translations.chatbot.text}</p>
      </div>`,
      attachTo: {
        element: ".chatbot-toggle",
        on: "left",
      },
      buttons: [
        {
          text: language === "en" ? "Next" : "अगला",
          action: tour.next,
          classes: "shepherd-button-primary",
        },
      ],
    });

    // Step 4: Get Started
    tour.addStep({
      id: "get-started",
      text: `<div style="padding: 10px;">
        <h3 style="margin-bottom: 10px; font-size: 1.1rem; font-weight: bold;">${translations.getStarted.title}</h3>
        <p style="margin-bottom: 0;">${translations.getStarted.text}</p>
      </div>`,
      attachTo: {
        element: ".get-started-button",
        on: "bottom",
      },
      buttons: [
        {
          text: translations.getStarted.button,
          action: () => {
            localStorage.setItem("tourCompleted", "true");
            tour.complete();
          },
          classes: "shepherd-button-primary",
        },
      ],
    });

    // Handle tour completion/cancellation
    tour.on("complete", () => {
      localStorage.setItem("tourCompleted", "true");
    });

    tour.on("cancel", () => {
      localStorage.setItem("tourCompleted", "true");
    });

    tour.start();
  };

  return null;
}
