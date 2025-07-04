/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // theme: {
  //   extend: {},
  // },
  theme: {
    extend: {
      keyframes: {
        'scroll-left': {
          // '0%': { transform: 'translateX(100%)' },
          '0%': { transform: 'translateX(5%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'scroll-left': 'scroll-left 50s linear infinite',
      },
    },
  },
  plugins: [],
}
