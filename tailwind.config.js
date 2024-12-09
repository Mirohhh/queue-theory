/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mytext: '#F2F2F2',
        action: 'orangered',
        btn: 'rgba(255, 255, 255, 0.1)',
        primary: '#212121',
        secondary: '#282828',
      },
    },
  },
  plugins: [],
}