export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint'
  ],

  
  css: [
    '~/assets/css/main.css',
    '~/assets/css/conference.css',
    '~/assets/css/page-management.css'
  ],

  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:8000/api'
    }
  },

  app: {
    head: {
      title: 'Konferencia CMS',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'description', content: 'Frontend pre správu konferencií' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  compatibilityDate: '2024-11-27',
  future: {
    compatibilityVersion: 4
  }
});
