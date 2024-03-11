/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundColor: {
        'error': 'rgba(245, 52, 4, 0.541)',
        'paper': '#ddc385'
      },
      boxShadow: {
        'custom': '4px 8px 10px 3px rgba(0,0,0,0.1)'
      }
    },
  },
  plugins: [],
}

