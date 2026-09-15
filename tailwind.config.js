/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          free: '#10b981',     // emerald-500
          busy: '#ef4444',     // red-500
          warning: '#f59e0b',  // amber-500
          maint: '#64748b',    // slate-500
        }
      }
    },
  },
  plugins: [],
}
