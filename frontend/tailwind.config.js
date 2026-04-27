/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode via a 'dark' class on the body/html
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kidPrimary: '#FF6B6B',
        kidSecondary: '#4ECDC4',
        kidAccent: '#FFE66D',
        kidBg: '#F7FFF7',
      },
      fontFamily: {
        kid: ['"Quicksand"', '"Comic Sans MS"', 'cursive', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}

