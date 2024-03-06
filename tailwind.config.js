/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundColor: {
        'error': 'rgba(245, 52, 4, 0.541)',
        'paper': '#ddc385'
      }
    },
  },
  plugins: [],
}

