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
      /* @link https://utopia.fyi/type/calculator?c=320,15,1.333,1240,26,1.333,6,1,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12 */

      "zero": "0px",
 
      /* Step -2: 8.4417px → 14.6323px */
      xs: "clamp(0.5276rem, 0.393rem + 0.6729vi, 0.9145rem)",

      /* Step -1: 11.2528px → 19.5049px */
      sm: "clamp(0.7033rem, 0.5239rem + 0.897vi, 1.2191rem)",

      /* Step 0: 15px → 26px */
      base: "clamp(0.9375rem, 0.6984rem + 1.1957vi, 1.625rem)",

      /* Step 1: 19.995px → 34.658px */
      md: "clamp(1.2497rem, 0.9309rem + 1.5938vi, 2.1661rem)",

      /* Step 2: 26.6533px → 46.1991px */
      lg: "clamp(1.6658rem, 1.2409rem + 2.1245vi, 2.8874rem)",

      /* Step 3: 35.5289px → 61.5834px */
      xl: "clamp(2.2206rem, 1.6542rem + 2.832vi, 3.849rem)",

      /* Step 4: 47.36px → 82.0907px */
      "2xl": "clamp(2.96rem, 2.205rem + 3.7751vi, 5.1307rem)",

      /* Step 5: 63.1309px → 109.4269px */
      "3xl": "clamp(3.9457rem, 2.9392rem + 5.0322vi, 6.8392rem)",

      /* Step 6: 84.1535px → 145.8661px */
      "4xl": "clamp(5.2596rem, 3.918rem + 6.7079vi, 9.1166rem)",

    },
    extend: {
      fontFamily: {
        serif: ["marlide-display-variable", ...defaultTheme.fontFamily.serif],
        sans: ["elido", ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        "container": "102.5rem",
        "2/3": "66.6666666%"
      },
      width: {
        "hero": "calc((100% - 80px)*0.33333)",
        "hero-xl": "calc((100% - 80px)*0.5)",
        "screen-scroll": "calc(100vw - 14px)",
        18: "4.5rem",
      },
      height: {
        18: "4.5rem",
      },
      dropShadow: {
        "base": "0 3px 5px rgba(0, 0, 0, 0.15)",
      },
      letterSpacing: {
        "extra": "0.85rem",
      },
    },
  },
}
