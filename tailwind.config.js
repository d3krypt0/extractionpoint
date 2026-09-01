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
        brand: {
          50: '#fbfaf8',
          100: '#f5f2ed',
          200: '#e8e2d8',
          300: '#d7cdbd',
          400: '#c0b099',
          500: '#a89478',
          600: '#8f795e',
          700: '#73604a',
          800: '#524434',
          900: '#2c2218',
          950: '#140f0a',
        },
        crema: {
          DEFAULT: '#c5a880',
          light: '#dfcca9',
          dark: '#9d7f57',
        },
        matcha: {
          DEFAULT: '#3f6236',
          light: '#5d8552',
          dark: '#284122',
        },
        gcash: {
          DEFAULT: '#007DFE',
          dark: '#005bb7',
          light: '#e6f2ff',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Bodoni Moda"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Bodoni Moda"', '"Cormorant Garamond"', '"Cinzel"', 'serif'],
        brand: ['"Montserrat"', 'sans-serif'],
        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
        'luxury-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
        'glow': '0 0 25px -5px rgba(197, 168, 128, 0.3)',
      }
    },
  },
  plugins: [],
}
