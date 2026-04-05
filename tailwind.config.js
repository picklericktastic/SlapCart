/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#002D6D",
          "blue-light": "#1A4B9E",
          "blue-dark": "#001A42",
          gold: "#D4A017",
          "gold-light": "#F0C040",
          "gold-dark": "#A07800",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #001A42 0%, #002D6D 50%, #1A4B9E 100%)",
      },
    },
  },
  plugins: [],
};
