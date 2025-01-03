/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        twitter: {
          blue: '#1D9BF0',
          hover: '#1A8CD8',
          dark: '#000000',
          darker: '#16181C',
          darkest: '#272C30',
          gray: '#71767B',
          lightGray: '#EFF3F4',
          border: '#2F3336',
          text: '#E7E9EA',
          dimText: '#71767B',
          darkHover: '#181818',
          darkBorder: '#2F3336',
          accent: '#1D9BF0',
          accentHover: '#1A8CD8'
        }
      }
    },
  },
  plugins: [],
};