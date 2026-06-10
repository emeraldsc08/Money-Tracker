export type ColorMode = 'light' | 'dark'

const STORAGE_KEY = 'money-tracker-color-mode'

function applyColorMode(mode: ColorMode) {
  document.documentElement.classList.remove('dark')
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  }
}

function readStoredColorMode(): ColorMode | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return null
}

function readDomColorMode(): ColorMode {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useColorMode() {
  const colorMode = useState<ColorMode>('color-mode', () => 'light')

  function setColorMode(mode: ColorMode) {
    colorMode.value = mode

    if (!import.meta.client) {
      return
    }

    localStorage.setItem(STORAGE_KEY, mode)
    applyColorMode(mode)
  }

  function toggleColorMode() {
    if (!import.meta.client) {
      return
    }

    const nextMode: ColorMode = readDomColorMode() === 'dark' ? 'light' : 'dark'
    setColorMode(nextMode)
  }

  function initColorMode() {
    if (!import.meta.client) {
      return
    }

    const stored = readStoredColorMode()
    if (stored) {
      setColorMode(stored)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setColorMode(prefersDark ? 'dark' : 'light')
  }

  return {
    colorMode,
    setColorMode,
    toggleColorMode,
    initColorMode,
  }
}
