"use client";

import { useEffect, useState } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

export default function HomepageTour() {
  const [tourStarted, setTourStarted] = useState(false);

  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem("homepage-tour-completed");
    
    // Create the tour instance
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: "shadow-lg bg-white",
        scrollTo: { behavior: "smooth", block: "center" },
        cancelIcon: {
          enabled: true,
          label: "Close Tour"
        }
      }
    });

    // Add tour steps
    tour.addStep({
      id: "welcome",
      title: "👋 Welcome to सहाय (Sahay)!",
      text: "Let me guide you through the platform. This tour will show you the key features and how to navigate.",
      buttons: [
        {
          text: "Skip Tour",
          action: tour.cancel,
          secondary: true
        },
        {
          text: "Start Tour",
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: "header",
      title: "📋 Navigation Header",
      text: "Use the navigation menu to access different sections like Login, Signup, and other important pages.",
      attachTo: {
        element: "header",
        on: "bottom"
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          secondary: true
        },
        {
          text: "Next",
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: "hero",
      title: "🎯 Hero Section",
      text: "This is the main landing area with key information about the platform and quick action buttons.",
      attachTo: {
        element: '[class*="hero"]',
        on: "bottom"
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          secondary: true
        },
        {
          text: "Next",
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: "stats",
      title: "📊 Key Statistics",
      text: "View important metrics and statistics about fund utilization, beneficiaries, and projects at a glance.",
      attachTo: {
        element: '[class*="stats"]',
        on: "bottom"
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          secondary: true
        },
        {
          text: "Next",
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: "features",
      title: "✨ Platform Features",
      text: "Explore the main features of the platform including fund management, beneficiary tracking, and reporting.",
      attachTo: {
        element: '[class*="features"]',
        on: "top"
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          secondary: true
        },
        {
          text: "Next",
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: "faq",
      title: "❓ Frequently Asked Questions",
      text: "Find answers to common questions about the platform, processes, and features.",
      attachTo: {
        element: '[class*="faq"]',
        on: "top"
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          secondary: true
        },
        {
          text: "Next",
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: "chatbot",
      title: "💬 Need Help?",
      text: "Click the chat button in the bottom-right corner anytime to get contextual help and navigate through any page!",
      attachTo: {
        element: ".fixed.bottom-6.right-6",
        on: "left"
      },
      buttons: [
        {
          text: "Back",
          action: tour.back,
          secondary: true
        },
        {
          text: "Finish Tour",
          action: tour.complete
        }
      ]
    });

    // Handle tour completion
    tour.on("complete", () => {
      localStorage.setItem("homepage-tour-completed", "true");
      setTourStarted(false);
    });

    tour.on("cancel", () => {
      localStorage.setItem("homepage-tour-completed", "true");
      setTourStarted(false);
    });

    // Auto-start tour if not seen before (after a short delay)
    if (!hasSeenTour && !tourStarted) {
      const timer = setTimeout(() => {
        setTourStarted(true);
        tour.start();
      }, 1000);

      return () => {
        clearTimeout(timer);
        if (tour.isActive()) {
          tour.cancel();
        }
      };
    }

    // Cleanup
    return () => {
      if (tour.isActive()) {
        tour.cancel();
      }
    };
  }, [tourStarted]);

  // Button to restart tour
  const restartTour = () => {
    localStorage.removeItem("homepage-tour-completed");
    window.location.reload();
  };

  return (
    <></>
  );
}
