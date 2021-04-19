/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors') 
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: [
    './public/**/*.html',
    './src/**/*.{ts,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'current',
      white: colors.white,
      gray: colors.gray,
      green: colors.emerald,
      red: colors.rose
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
