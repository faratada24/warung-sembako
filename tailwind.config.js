/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06B6D4',
        secondary: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B'
      }
    },
  },
  plugins: [],
}
