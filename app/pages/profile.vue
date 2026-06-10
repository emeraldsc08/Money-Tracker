<script setup lang="ts">
useHead({ title: 'Profile' })

const { user } = useUserSession()
const { colorMode, setColorMode } = useColorMode()
const { requestLogout } = useLogout()

const userInitial = computed(() => {
  const name = user.value?.name?.trim()
  if (!name) {
    return '?'
  }
  return name.charAt(0).toUpperCase()
})

const themeOptions = [
  { id: 'light' as const, label: 'Light' },
  { id: 'dark' as const, label: 'Dark' },
]
</script>

<template>
  <div>
    <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div class="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Profile
        </h1>
        <p class="text-muted mt-1">
          Account and app preferences
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
      <section class="surface-card p-5">
        <div class="flex items-center gap-4">
          <span
            class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-900 text-2xl font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            aria-hidden="true"
          >
            {{ userInitial }}
          </span>
          <div class="min-w-0">
            <p class="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
              {{ user?.name ?? 'User' }}
            </p>
            <p class="text-muted mt-0.5 truncate">
              {{ user?.email }}
            </p>
          </div>
        </div>
      </section>

      <section class="surface-card p-5">
        <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Appearance
        </h2>
        <p class="text-muted-xs mt-1">
          Choose light or dark mode for the app
        </p>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <button
            v-for="option in themeOptions"
            :key="option.id"
            type="button"
            class="touch-target rounded-xl px-3 py-3 text-sm font-medium transition"
            :class="colorMode === option.id
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
            @click="setColorMode(option.id)"
          >
            {{ option.label }} mode
          </button>
        </div>
      </section>

      <section class="surface-card p-5">
        <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Session
        </h2>
        <p class="text-muted-xs mt-1">
          Sign out from this device
        </p>

        <button
          type="button"
          class="touch-target mt-4 w-full rounded-xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          @click="requestLogout"
        >
          Log out
        </button>
      </section>
    </main>
  </div>
</template>
