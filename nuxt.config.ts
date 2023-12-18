import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

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
    public: {
      cwd: dirname(fileURLToPath(import.meta.url)),
    },
    bpyLocation: '/Users/Shared/git/ppy-sb/bancho.py',
  },
})
