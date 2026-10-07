import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        luxury: {
          bg: "#09090a",
          deep: "#050505",
          surface: "#121214",
          card: "#121214",
          elevated: "#1a1918",
          border: "#242220",
          accent: "#c5a880",
          "accent-hover": "#d8bf9a",
          "accent-light": "#e8d7be",
          gold: "#c5a880",
          "gold-muted": "#8c7350",
          text: "#ede8df",
          muted: "#a39e93",
          subtle: "#6e695f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
