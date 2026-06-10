<script setup lang="ts">
const { toasts, dismissToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
      >
        <span>{{ toast.message }}</span>
        <button
          type="button"
          class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white"
          aria-label="Tutup notifikasi"
          @click="dismissToast(toast.id)"
        >
          ✕
        </button>
      </div>
    </div>
  </Teleport>
</template>
