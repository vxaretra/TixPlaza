/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '887px',
      // => @media (min-width: 768px) { ... }

      'lg': '1185px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      'home': '1978px',
    },
    extend: {
      fontSize: {
        xxs: ['0.5rem', '16px'],
      }
    },
  },
  plugins: [],
}

