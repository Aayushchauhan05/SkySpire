/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'main-bg': '#121212',
        'card-bg': '#1A1A1A',
        'elevated': '#1A1A1A',
        coral: '#FF8660',
        'purple-accent': '#9A98FF',
        amber: '#ECFF4D',
        cyan: '#4FDBF0',
        muted: '#A0A0A0',
        peach: '#9A98FF',
        light: '#F5F5F5',
      },
    },
  },
  plugins: [],
};
