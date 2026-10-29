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
        background: '#080c14',
        surface: {
          DEFAULT: '#0f172a',
          hover: '#1e293b',
          muted: '#151f32'
        },
        border: {
          subtle: '#1e293b',
          bright: '#334155'
        },
        accent: {
          blue: '#3b82f6',
          amber: '#f59e0b',
          emerald: '#10b981',
          crimson: '#ef4444',
          slate: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
