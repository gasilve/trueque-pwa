/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3AC9A8',
        secondary: '#FFD700',
        accent: '#FF6B9D',
        background: '#F5F7FA',
        card: '#FFFFFF',
        border: '#E5E7EB',
      }
    },
  },
  plugins: [],
}