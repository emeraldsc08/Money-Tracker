<script setup lang="ts">
const { isLogoutConfirmOpen, isLoggingOut, cancelLogout, confirmLogout } = useLogout()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isLogoutConfirmOpen"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="cancelLogout"
    >
      <div
        class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        aria-describedby="logout-confirm-description"
      >
        <h2
          id="logout-confirm-title"
          class="text-lg font-semibold text-slate-900 dark:text-slate-100"
        >
          Log out?
        </h2>
        <p
          id="logout-confirm-description"
          class="text-muted mt-2"
        >
          You will need to sign in again to access your transactions.
        </p>

        <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="touch-target rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            :disabled="isLoggingOut"
            @click="cancelLogout"
          >
            Cancel
          </button>
          <button
            type="button"
            class="touch-target rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
            :disabled="isLoggingOut"
            @click="confirmLogout"
          >
            {{ isLoggingOut ? 'Logging out...' : 'Log out' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
