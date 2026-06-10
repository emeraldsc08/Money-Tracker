import { getTodayJakartaDateString } from '~~/shared/utils/jakarta-date'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/transactions') {
    return
  }

  if (typeof to.query.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(to.query.date)) {
    return
  }

  return navigateTo({
    path: '/transactions',
    query: {
      ...to.query,
      date: getTodayJakartaDateString(),
    },
  }, { replace: true })
})
