/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            'dancing-script': ['Dancing Script', 'cursive'],
            'great-vibes': ['Great Vibes', 'cursive'],
            'alex-brush': ['Alex Brush', 'cursive'],
            'sacramento': ['Sacramento', 'cursive'],
            'allura': ['Allura', 'cursive'],
            'petit-formal': ['Petit Formal Script', 'cursive'],
          },
    },
  },
  plugins: [],
}