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
        "below-md": { max: "800px" },
        "below-lg": { min: "801px" },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;
