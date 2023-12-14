// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  plugins: ['~/plugins/register-components'],
  vue: {
    defineModel: true,
  },
  runtimeConfig: {
    bpyLocation: '/Users/Shared/git/ppy-sb/bancho.py',
  },
})
