// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  plugins: ['~/plugins/firebase.js', '~/plugins/axios.js'],

  runtimeConfig: {
    smtpHost: "",
    smtpPort: "",
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
    '~/assets/css/main.css'
  ],

  modules: [
    '@nuxtjs/leaflet',
    'dayjs-nuxt',
    "nuxt-auth-utils",
    '@nuxt/ui'
  ],

  nitro: {
    storage: {
      redis: {
        driver: "redis",
        port: 6379,
        host: "127.0.0.1",
        username: "",
        password: "",
      },
    },
  },
})