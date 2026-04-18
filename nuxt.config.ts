// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:8000'
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'uz'
      },
      titleTemplate: '%s | TTYSI',
      title: "Toshkent to'qimachilik va yengil sanoati instituti",
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          name: 'description',
          content: "Toshkent to'qimachilik va yengil sanoati instituti rasmiy sayti: ta'lim yo'nalishlari, qabul, yangiliklar va institut hayoti."
        },
        {
          name: 'keywords',
          content: "TTYSI, Toshkent to'qimachilik va yengil sanoati instituti, institut, qabul, fakultetlar, tekstil, yengil sanoat"
        },
        {
          name: 'author',
          content: 'TTYSI'
        },
        {
          name: 'format-detection',
          content: 'telephone=no'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:site_name',
          content: 'TTYSI'
        },
        {
          property: 'og:locale',
          content: 'uz_UZ'
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ]
    }
  }
})
