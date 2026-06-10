<script setup lang="ts">
const route = useRoute()
const { user } = useUserSession()

const navItems = [
  {
    label: 'Transactions',
    shortLabel: 'Txns',
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
    label: 'Monthly Report',
    shortLabel: 'Report',
    to: '/reports/monthly',
    icon: 'calendar',
  },
  {
    label: 'Profile',
    shortLabel: 'Profile',
    to: '/profile',
    icon: 'user',
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
          Hi, {{ user?.name ?? 'User' }}
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
            v-else-if="item.icon === 'calendar'"
            class="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="border-t border-slate-200 p-4 dark:border-slate-800">
        <NuxtLink
          to="/profile"
          class="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 transition hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800"
          :class="isActive('/profile') ? 'ring-2 ring-slate-900 dark:ring-slate-100' : ''"
        >
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
              View profile
            </p>
          </div>
        </NuxtLink>
      </div>
    </aside>

    <div class="md:pl-64">
      <div class="pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <slot />
      </div>
    </div>

    <nav
      class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden"
      style="padding-bottom: env(safe-area-inset-bottom, 0px);"
      aria-label="Main navigation"
    >
      <div class="mx-auto flex w-full max-w-lg items-stretch justify-between px-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 text-center"
          :class="isActive(item.to)
            ? 'text-slate-900 dark:text-slate-100'
            : 'text-slate-500 dark:text-slate-400'"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-lg transition"
            :class="isActive(item.to)
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-transparent'"
          >
            <svg
              v-if="item.icon === 'list'"
              class="h-[18px] w-[18px]"
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
              class="h-[18px] w-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M7 16l4-4 4 4 5-6" />
            </svg>
            <svg
              v-else-if="item.icon === 'calendar'"
              class="h-[18px] w-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <svg
              v-else
              class="h-[18px] w-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <span class="max-w-full truncate text-[9px] font-medium leading-none">
            {{ item.shortLabel }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <LogoutConfirmModal />
  </div>
</template>
