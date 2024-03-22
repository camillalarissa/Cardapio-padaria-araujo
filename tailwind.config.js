/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans': ['Overlock', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home":"url('/assets/pao-frances.jpg')"
      }
    },
  },
  plugins: [],
}

