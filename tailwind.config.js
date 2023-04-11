const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/*.md',
    './*.html',
    './*.md',
  ],
  theme: {
    fontSize: {
      sm: "1rem", // 16px
      base: "1.125rem", // 18px
      md: "1.375rem", // 22px
      lg: "1.6875rem", // 27px
      xl: "2rem", // 32px
      "2xl": "3.125rem", // 50px
      "3xl": "3.75rem", // 60px
      "4xl": "5rem", // 80px
    },
    screens: {
      sm: "375px",
      awks: "484px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1600px",
    },
    extend: {
      fontFamily: {
        serif: ["Roboto Slab", ...defaultTheme.fontFamily.serif],
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}