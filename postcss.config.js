module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    // Minify here rather than with jekyll-minifier, which breaks clamp()
    ...(process.env.JEKYLL_ENV === 'production' ? [require('cssnano')] : []),
  ]
}
