import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import App from './App.tsx'
import './index.css'

// PostHog — auto-captures page views, clicks, and user sessions
if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: true,
    },
  });
}

// Initialize global NJ state before app renders
window.NJ = { isMember: false, hasVitalTrial: false, trialEndsAt: null, memberEmail: null };
window.NJ_CONFIG = { VITAL_PAYWALL_MODE: "free", TRIAL_LENGTH_DAYS: 14, MEMBER_DISCOUNT_PCT: 12, REGULAR_PRICE: 8.5 };

createRoot(document.getElementById("root")!).render(<App />);
