export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'symple-ats-front',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/sass/select.sass'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/calendar',
    '@/plugins/chart',
    '@/plugins/clickOutside',
    '@/plugins/draggable',
    '@/plugins/select',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/date-fns',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/auth', '@nuxtjs/axios'],

  axios: {
    baseURL: 'http://localhost:7700',
  },

  auth: {
    redirect: {
      login: '/signin',
      logout: '/signin',
      callback: false,
      home: '/',
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/sign_in', propertyName: false },
          logout: { url: 'auth/sign_out', method: 'delete' },
          user: { url: '/auth/recruiter', propertyName: '' },
        },
      },
    },
  },

  router: {
    middleware: ['auth'],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
