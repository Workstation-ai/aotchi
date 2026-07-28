import { defineConfig } from "tailwindcss";

export default defineConfig({
  theme: {
    extend: {
      colors: {
        "on-surface": {
          0: "#ffffff",
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb5c7",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
        },
        "primary-container": {
          DEFAULT: "#00ffd1",
          dim: "#15ffd1",
          glow: "#00ffd140",
        },
        "secondary": {
          DEFAULT: "#00c9ff",
          dim: "#00a0c0",
        },
        "background": {
          DEFAULT: "#0A0C10",
          surface: "#0D0F14",
          elevated: "#12151A",
        },
        "surface-variant": {
          DEFAULT: "#1A1E28",
          subtle: "#1E2230",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "body-md": ["1rem", { lineHeight: "1.75" }],
        "label-md": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "headline-lg": ["2.5rem", { lineHeight: "1.1", fontWeight: "700" }],
        "headline-md": ["1.75rem", { lineHeight: "1.2", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7", letterSpacing: "0.01em" }],
        "label-sm": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        "code-snippet": ["0.8125rem", { lineHeight: "1.6", fontFamily: "'JetBrains Mono', monospace" }],
      },
    },
  },
});