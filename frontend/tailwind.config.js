/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5fbff',
          100: '#e6f3ff',
          500: '#0ea5e9',
          700: '#0b78b1'
        }
      }
    }
  },
  plugins: []
}
