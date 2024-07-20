// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  plugins: [ 
  ],

  modules: ["@nuxtjs/tailwindcss", "@primevue/nuxt-module"],
  primevue: {
    options: {
        theme: {
            preset: Aura
        }
    }
  }
})