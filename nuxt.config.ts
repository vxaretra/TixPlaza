// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  plugins: ['~/plugins/firebase.js', '~/plugins/axios.js'],

  runtimeConfig: {
    smtpHost: "",
    smtpUser: "",
    smtpPass: "",
    xenditKey: "",
    xenditWebhookToken: "",
    public: {
      baseUrl: "",
      jwtSecret: "",
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
    'dayjs-nuxt',
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