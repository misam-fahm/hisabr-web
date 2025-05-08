import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        defaultwhite: "#FFFFFFCC",
        defaultblack: "#334155",
        white: "#FFFFFF",
      },
      screens: {
        "below-md": { max: "768px" },
        "tablet": { min: "769px", max: "1024px" },
        "ipad-air": { min: "1100px", max: "1200px" },
        "ipad-pro": { min: "1100px", max: "1400px" },
        "tablet-home": { min: "769px", max: "1350px" },
        "below-lg": { min: "1025px" },
        "small-laptop": { min: "1280px", max: "1440px" },
        
       },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;
