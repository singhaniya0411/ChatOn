/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#c9c9c9',
        'color-gray': '#808080',
        'chat-bg': '#001040',
        'custom-placeholder': '#ffffff',
        'chatbox-bg': '#f1f5ff',
      },
    },
  },
  plugins: [],
}