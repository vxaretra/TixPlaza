// https://nuxt.com/docs/api/configuration/nuxt-config

// import Aura from '@primevue/themes/aura';
// import Nora from '@primevue/themes/nora';
import Lara from '@primevue/themes/lara';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  plugins: [ 
  ],

  css: [
    'primeicons/primeicons.css', // Tambahkan PrimeIcons di sini
    // CSS lain yang mungkin Anda miliki
  ],

  modules: ["@nuxtjs/tailwindcss", "@primevue/nuxt-module"],

  primevue: {
    options: {
        theme: {
            preset: Lara,
        }
    }
  },
})