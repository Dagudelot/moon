/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moon: {
          navy: '#1B1F3B',
          'navy-2': '#2D2F50',
          white: '#F2F2F2',
          ash: '#D1D5DB',
          lavender: '#D6C4F0',
          gold: '#E4D7B7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      transitionTimingFunction: {
        'moon': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'moon': '200ms',
      },
    },
  },
  plugins: [],
}


