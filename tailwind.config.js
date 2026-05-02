/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        mig: {
          bg: "#050814",
          card: "rgba(255,255,255,0.06)",
          gold: "#F5C542",
          green: "#22C55E",
          blue: "#38BDF8",
          muted: "#94A3B8",
          white: "#F8FAFC",
        },
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.1rem",
      },
    },
  },
  plugins: [],
};
