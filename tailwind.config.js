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
        rudin: {
          navy: "#1B2B4B",
          gold: "#B8922A",
          cream: "#F7F4EF",
          slate: "#4A5568",
          light: "#E8E4DD",
        },
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
