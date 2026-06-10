export function useLogout() {
  const isLogoutConfirmOpen = useState('logout-confirm-open', () => false)
  const isLoggingOut = useState('logout-logging-out', () => false)
  const { clear: clearSession } = useUserSession()

  function requestLogout() {
    isLogoutConfirmOpen.value = true
  }

  function cancelLogout() {
    if (isLoggingOut.value) {
      return
    }
    isLogoutConfirmOpen.value = false
  }

  async function confirmLogout() {
    if (isLoggingOut.value) {
      return
    }

    isLoggingOut.value = true

    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      await clearSession()
      isLogoutConfirmOpen.value = false
      await navigateTo('/login')
    }
    finally {
      isLoggingOut.value = false
    }
  }

  return {
    isLogoutConfirmOpen,
    isLoggingOut,
    requestLogout,
    cancelLogout,
    confirmLogout,
  }
}
