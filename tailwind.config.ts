const { spacing, fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-freesentation)", ...fontFamily.sans],
        heading: ["var(--font-paperlogy)", "var(--font-freesentation)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            //...
            "h1,h2,h3,h4": {
              "scroll-margin-top": spacing[32],
            },
          },
        },
      }),
    },
  },
  variants: {
    typography: ["dark"],
  },
  plugins: [require("@tailwindcss/typography")],
};
