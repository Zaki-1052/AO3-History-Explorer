// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ao3: {
          red: '#990000',
          darkred: '#5A0000',
          beige: '#F3F3E9',
          lightgray: '#EEEEEE',
          mediumgray: '#CCCCCC',
          gray: '#999999',
          darkgray: '#333333',
          charcoal: '#2A2A2A',
        }
      },
      fontFamily: {
        sans: ['Lucida Grande', 'Lucida Sans Unicode', 'Verdana', 'Helvetica', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}