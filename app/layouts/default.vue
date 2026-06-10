<script setup lang="ts">
const route = useRoute()
const { user, clear: clearSession } = useUserSession()

const navItems = [
  {
    label: 'Transaksi',
    shortLabel: 'Transaksi',
    to: '/transactions',
    icon: 'list',
  },
  {
    label: 'Realtime',
    shortLabel: 'Live',
    to: '/reports/realtime',
    icon: 'chart',
  },
  {
    label: 'Laporan Bulanan',
    shortLabel: 'Laporan',
    to: '/reports/monthly',
    icon: 'calendar',
  },
]

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const userInitial = computed(() => {
  const name = user.value?.name?.trim()
  if (!name) {
    return '?'
  }
  return name.charAt(0).toUpperCase()
})

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clearSession()
  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <aside class="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
      <div class="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
        <NuxtLink
          to="/transactions"
          class="text-base font-semibold text-slate-900 dark:text-slate-100"
        >
          Money Tracker
        </NuxtLink>
        <p class="text-muted-xs mt-1">
          Halo, {{ user?.name ?? 'Pengguna' }}
        </p>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="touch-target flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition"
          :class="isActive(item.to)
            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'"
        >
          <svg
            v-if="item.icon === 'list'"
            class="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else-if="item.icon === 'chart'"
            class="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M7 16l4-4 4 4 5-6" />
          </svg>
          <svg
            v-else
            class="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800">
        <div class="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            aria-hidden="true"
          >
            {{ userInitial }}
          </span>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {{ user?.name }}
            </p>
            <p class="truncate text-xs text-slate-500 dark:text-slate-400">
              {{ user?.email }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="touch-target w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="logout"
        >
          Logout
        </button>

        <ColorModeToggle variant="sidebar" />
      </div>
    </aside>

    <div class="md:pl-64">
      <div class="pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <slot />
      </div>
    </div>

    <nav
      class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden"
      style="padding-bottom: env(safe-area-inset-bottom, 0px);"
      aria-label="Navigasi utama"
    >
      <div class="mx-auto flex max-w-lg items-stretch justify-around px-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="touch-target flex flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-center"
          :class="isActive(item.to)
            ? 'text-slate-900 dark:text-slate-100'
            : 'text-slate-500 dark:text-slate-400'"
        >
          <span
            class="flex h-9 w-9 items-center justify-center rounded-xl transition"
            :class="isActive(item.to)
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-transparent'"
          >
            <svg
              v-if="item.icon === 'list'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else-if="item.icon === 'chart'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M7 16l4-4 4 4 5-6" />
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <span class="text-[10px] font-medium leading-none">
            {{ item.shortLabel }}
          </span>
        </NuxtLink>

        <div class="flex flex-1 flex-col items-center justify-center gap-1 px-1 py-2">
          <ColorModeToggle variant="icon" />
          <span class="text-[10px] font-medium leading-none text-slate-500 dark:text-slate-400">
            Tema
          </span>
        </div>

        <button
          type="button"
          class="touch-target flex flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-slate-500 dark:text-slate-400"
          aria-label="Logout"
          @click="logout"
        >
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-transparent">
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
          <span class="text-[10px] font-medium leading-none">
            Logout
          </span>
        </button>
      </div>
    </nav>
  </div>
</template>
