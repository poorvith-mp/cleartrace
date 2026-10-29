/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 60% Pure Neutral Zinc Ground (Zero blue/purple tint)
        canvas: {
          DEFAULT: '#09090b',
          subtle: '#0f0f12',
          inset: '#050507',
        },
        // 30% Structural Surfaces & Hairlines
        surface: {
          DEFAULT: '#141417',
          hover: '#1c1c21',
          plate: '#18181c',
          border: '#27272a',
          borderLight: '#3f3f46',
        },
        // 10% Intentional Pure Accents (Strict Color Psychology)
        accent: {
          blue: '#2563eb',     // Action / Trust
          cyan: '#0284c7',     // Semantic Vector Match
          emerald: '#10b981',  // Confirmed Purged / Safe
          amber: '#f59e0b',    // Caution / Pending Consent
          crimson: '#ef4444',  // Active Risk / Exposed
          slate: '#71717a',    // Neutral labels
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
