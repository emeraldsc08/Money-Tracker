// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils'],
  components: [
    {
      path: '~/components/ui',
      pathPrefix: false,
    },
    {
      path: '~/components/report',
      pathPrefix: false,
    },
    '~/components',
  ],
  css: ['~/assets/css/main.css'],
  devServer: {
    host: '0.0.0.0',
  },
  vite: {
    server: {
      // Allow Cloudflare quick tunnels (*.trycloudflare.com) during local demos.
      allowedHosts: ['.trycloudflare.com'],
    },
  },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
      meta: [
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      script: [
        {
          key: 'color-mode',
          tagPosition: 'head',
          innerHTML: `(function(){try{var m=localStorage.getItem('money-tracker-color-mode');var d=m==='dark'||(m!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})();`,
          type: 'text/javascript',
        },
      ],
    },
  },
})
