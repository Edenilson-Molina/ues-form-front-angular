/** @type {import('tailwindcss').Config} */

import PrimeUI from 'tailwindcss-primeui';
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  darkMode: ['selector', '[class~="dark-mode"]'],
  plugins: [PrimeUI],
}
