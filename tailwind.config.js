/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          volt: '#97D700',
          olive: '#9FC63B',
          DEFAULT: '#97D700',
        },
        surface: {
          pitch: '#000000',
          charcoal: '#333333',
          dark: '#212529',
          stone: '#F1F1EC',
          light: '#F8F9FA',
          white: '#FFFFFF',
          neutral950: '#111111',
          neutral850: '#222222',
        },
        status: {
          success: '#198754',
          danger: '#DC3545',
          warning: '#FFC107',
          info: '#0D6EFD',
        },
        gym: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          free: '#97D700',     // Village Gym Volt Lime
          busy: '#DC3545',     // Village Gym Danger
          warning: '#FFC107',  // Village Gym Warning
          maint: '#555555',
        }
      },
      letterSpacing: {
        'tight-title': '2px',
        'wide-title': '4px',
        'mega-title': '6px',
        'ultra-title': '8px',
      },
      boxShadow: {
        vignette: 'inset 0 0 100px 0 rgba(0, 0, 0, 0.5)',
        'vignette-sm': 'inset 0 0 50px 0 rgba(0, 0, 0, 0.5)',
        card: '2px 2px 10px 2px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
