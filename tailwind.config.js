/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.slate.800"),
            h1: { color: theme("colors.slate.800") },
            h2: { color: theme("colors.slate.800") },
            h3: { color: theme("colors.slate.800") },
            strong: { color: theme("colors.slate.800") },
            em: { color: theme("colors.slate.800") },
            blockquote: { color: theme("colors.slate.800") },
            a: { color: theme("colors.blue.400") },
            span: { color: "inherit" }, // added span styling
          },
        },
        dark: {
          css: {
            color: theme("colors.white"),
            h1: { color: theme("colors.white") },
            h2: { color: theme("colors.white") },
            h3: { color: theme("colors.white") },
            strong: { color: theme("colors.white") },
            em: { color: theme("colors.white") },
            blockquote: { color: theme("colors.white") },
            a: { color: theme("colors.blue.400") },
            span: { color: "inherit" }, // added span styling for dark mode
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
