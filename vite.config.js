import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      animation: {
        "pulse-custom": "pulseCustom 2s ease-in-out infinite",
      },
      keyframes: {
        pulseCustom: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.5)" },
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
