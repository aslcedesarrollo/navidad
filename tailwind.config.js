/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'festive': ['Mountains of Christmas', 'cursive'],
      },
      colors: {
        'christmas-red': '#C62828',
        'christmas-green': '#2E7D32',
        'gold': '#FFC107',
      }
    },
  },
  plugins: [],
}
