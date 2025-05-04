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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "lilas-clair": "var(--lilas-clair)",
        "lilas-fonce": "var(--lilas-fonce)",
        "creme-nude": "var(--creme-nude)",
        "dore": "var(--dore)",
        "menthe": "var(--menthe)",
      },
      fontFamily: {
        'playfair': ['var(--font-playfair-display)', 'serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
