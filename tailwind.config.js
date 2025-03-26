// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",  // Make sure this is included
    "./src/**/*.{js,ts,jsx,tsx}", // All files in src and subdirectories
    "./components/**/*.{js,ts,jsx,tsx}", //If you have a components directory
    "./pages/**/*.{js,ts,jsx,tsx}" // If you use pages directory for routing

  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}