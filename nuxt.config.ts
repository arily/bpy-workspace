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
      // NUXT_PUBLIC_CWD
      cwd: dirname(fileURLToPath(import.meta.url)),
      // NUXT_PUBLIC_BPY_LOCATION
      bpyLocation: '/ppy-sb/bancho.py',
    },
  },
})
