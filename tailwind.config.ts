import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import formsPlugin from "@tailwindcss/forms";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/component-library/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        84: "21rem",
      },
      fontFamily: {
        sans: ["SF Pro Rounded", "Inter", ...fontFamily.sans],
        mono: ["Inconsolata", ...fontFamily.mono],
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        md: "15px",
        lg: "18px",
        xl: "20px",
      },
    },
  },
  plugins: [formsPlugin],
} satisfies Config;
