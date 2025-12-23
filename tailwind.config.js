const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/*.md',
    './*.html',
    './*.md',
  ],
  safelist: [
    {pattern: /ml-./},
    {pattern: /mt-./},
  ],
  theme: {
    fontSize: {
      /* @link https://utopia.fyi/type/calculator?c=320,18,1.333,1240,26,1.333,6,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12 */

      "zero": "0px",
 

      /* Step -2: 10.1301px → 14.6323px */
      xs: "clamp(0.6331rem, 0.5353rem + 0.4894vw, 0.9145rem)",
      /* Step -1: 13.5034px → 19.5049px */
      sm: "clamp(0.844rem, 0.7135rem + 0.6523vw, 1.2191rem)",
      /* Step 0: 18px → 26px */
      base: "clamp(1.125rem, 0.9511rem + 0.8696vw, 1.625rem)",
      /* Step 1: 23.994px → 34.658px */
      md: "clamp(1.4996rem, 1.2678rem + 1.1591vw, 2.1661rem)",
      /* Step 2: 31.984px → 46.1991px */
      lg: "clamp(1.999rem, 1.69rem + 1.5451vw, 2.8874rem)",
      /* Step 3: 42.6347px → 61.5834px */
      xl: "clamp(2.6647rem, 2.2527rem + 2.0596vw, 3.849rem)",
      /* Step 4: 56.832px → 82.0907px */
      "2xl": "clamp(3.552rem, 3.0029rem + 2.7455vw, 5.1307rem)",
      /* Step 5: 75.7571px → 109.4269px */
      "3xl": "clamp(4.7348rem, 4.0029rem + 3.6598vw, 6.8392rem)",
      /* Step 6: 100.9842px → 145.8661px */
      "4xl": "clamp(6.3115rem, 5.3358rem + 4.8785vw, 9.1166rem)",


    },
    extend: {
      fontFamily: {
        serif: ["marlide-display-variable", ...defaultTheme.fontFamily.serif],
        sans: ["elido", ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        "container": "102.5rem",
        "2/3": "66.6666666%",
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
