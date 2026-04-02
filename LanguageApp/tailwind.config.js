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
        'main-bg': '#110E1A',
        'card-bg': '#1C1830',
        'elevated': '#252040',
        coral: '#FF8A66',
        'purple-accent': '#9B8AF4',
        amber: '#FFB800',
        cyan: '#00E5FF',
        muted: '#8E88B0',
        peach: '#F4A261',
      },
    },
  },
  plugins: [],
};
