import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d8d9dc",
          300: "#b3b5ba",
          400: "#82858d",
          500: "#5e6168",
          600: "#43464d",
          700: "#33353b",
          800: "#22242a",
          900: "#16181d",
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
