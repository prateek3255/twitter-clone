/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/ui/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-chirp)'],
      },
      colors: {
        primary: {
          "blue": 'rgb(29, 155, 240)',
          "red": "rgb(249, 24, 128)",
          "green": "rgb(0, 186, 124)",
          "blue-hover": 'rgb(26, 140, 216)',
        }
      },
      dropShadow: {
        'button-base': 'rgba(0, 0, 0, 0.08) 0px 8px 28px'
      }
    },
  },
  plugins: [],
}
