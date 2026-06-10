const publicPaths = new Set(['/login', '/register'])

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetch } = useUserSession()

  if (!loggedIn.value) {
    await fetch()
  }

  if (!loggedIn.value && !publicPaths.has(to.path)) {
    return navigateTo('/login')
  }

  if (loggedIn.value && publicPaths.has(to.path)) {
    return navigateTo('/transactions')
  }
})
