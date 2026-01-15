const { spacing } = require('tailwindcss/defaultTheme');


module.exports = {
  theme: {
    extend: {
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            //...
            'h1,h2,h3,h4': {
              'scroll-margin-top': spacing[32],
            },
          }
        }
      })
    }
  },
  variants: {
    typography: ['dark'],
  },
  plugins: [require('@tailwindcss/typography')],
}