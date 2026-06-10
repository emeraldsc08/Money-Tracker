export interface ToastItem {
  id: number
  message: string
}

export function useToast() {
  const toasts = useState<ToastItem[]>('app-toasts', () => [])

  function showToast(message: string) {
    const id = Date.now()
    toasts.value = [...toasts.value, { id, message }]

    window.setTimeout(() => {
      toasts.value = toasts.value.filter(toast => toast.id !== id)
    }, 3500)
  }

  function dismissToast(id: number) {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  return {
    toasts,
    showToast,
    dismissToast,
  }
}
