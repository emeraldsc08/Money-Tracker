export default defineNuxtPlugin((nuxtApp) => {
  const { initColorMode } = useColorMode()

  nuxtApp.hook('app:mounted', () => {
    initColorMode()
  })
})
