/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff41',
          blue: '#00ccff',
          pink: '#ff00aa',
        }
      },
    },
  },
  plugins: [],
}
