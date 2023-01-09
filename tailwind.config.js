/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/scripts/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'darkblue': 'hsl(209, 23%, 22%)',
        'very-darkblue': 'hsl(207, 26%, 17%)',
        'very-darkblue2': 'hsl(200, 15%, 8%)',
        'dark-gray': 'hsl(0, 0%, 52%)',
        'very-lightgray': 'hsl(0, 0%, 98%)',
        white: 'hsl(0, 0%, 100%)',
      },
      fontFamily: {
        nunito: "'Nunito Sans', sans-serif",
      },
      boxShadow: {
        input: '0px 7px 29px 0px rgba(100, 100, 111, 0.2)',
      }
    },
  },
  plugins: [],
}
