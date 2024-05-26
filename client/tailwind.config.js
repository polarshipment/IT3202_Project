/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'custom-grey1': '#EFEFEF', // main background
        'custom-grey2': '#BABABA', // used in navbar and input box
        'custom-skyblue': '#0DCAF0',
        'custom-green': '#3CBC8D',
        'custom-red': '#DC3545',
      },
    },
  },
  plugins: [],
}

