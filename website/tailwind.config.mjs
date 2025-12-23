/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'algo-primary': '#00D2B8',
        'algo-secondary': '#0081C9',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
