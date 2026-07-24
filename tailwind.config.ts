import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1B85E9",
          "blue-dark": "#0B65C2",
          yellow: "#F5B301",
          "yellow-hover": "#E0A200",
        },
      },
    },
  },
  plugins: [],
};
export default config;
