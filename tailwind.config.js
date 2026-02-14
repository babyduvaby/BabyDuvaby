/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        blush: "#ffd9e8",
        sky: "#dff2ff",
        cream: "#fffafc",
        ink: "#56637f",
        mint: "#27b48f"
      },
      boxShadow: {
        candy: "0 12px 30px rgba(91, 134, 173, 0.18)"
      },
      borderRadius: {
        "3xl": "1.5rem"
      }
    }
  },
  plugins: []
};

