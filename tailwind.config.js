// tailwind.config.js
import { defineConfig } from 'tailwindcss'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        'black-deep': '#00040A',
        'dark-gray': '#04070F',
        'light-gray': '#EDEDED',
        'bright-gray': '#F2F2F2',
      }
    }
  }
})

/*

didnt used it in project so dont forget to  remove it
black-deep => main container / background

dark-gray => input & button background

light-gray => text

bright-gray => highlights (hover / focus)

*/
