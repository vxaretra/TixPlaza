// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  plugins: ['~/plugins/firebase.js'],

  runtimeConfig: {
    jwtSecret: "",
    smtpHost: "",
    smtpUser: "",
    smtpPass: "",
    public: {
      firebaseKey: "",
      firebaseDomain: "",
      firebaseProjectid: "",
      firebaseStorageBucket: "",
      firebaseMessagingSenderid: "",
      firebaseAppid: "",
    },
  },

  css: [

  ],

  modules: [
    "@nuxtjs/tailwindcss",
    'nuxt-quasar-ui',
    '@nuxtjs/leaflet',
  ],

  quasar: {
    // Configurable Component Defaults
    // components: {
    //   defaults: {
    //     QBtn: {
    //       dense: true,
    //       flat: true,
    //     },
    //     QInput: {
    //       dense: true
    //     }
    //   }
    // }
    plugins:
      ['Notify', 'Loading']
    ,
  },
})