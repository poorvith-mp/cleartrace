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
        // 60% Dominant Canvas
        canvas: {
          DEFAULT: '#070a10',
          inset: '#04060a',
        },
        // 30% Structural Surfaces
        surface: {
          DEFAULT: '#0d131f',
          hover: '#141d2f',
          plate: '#101726',
          border: '#1a2436',
          borderLight: '#26344d',
        },
        // 10% Intentional Accents (Color Psychology - ZERO PURPLE)
        brand: {
          blue: '#1d4ed8',     // Primary Action / Trust
          cyan: '#0284c7',     // Vector / Embedding data
          emerald: '#059669',  // Verified Safe / Delisted
          amber: '#d97706',    // Pending Consent / Warning
          crimson: '#dc2626',  // Exposed PII / Re-appearance
          slate: '#64748b',    // Neutral structure
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
