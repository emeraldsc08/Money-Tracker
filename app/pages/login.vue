<script setup lang="ts">
import type { ApiResponse } from '~~/shared/types/api'
import type { AuthUser } from '~~/shared/types/auth'

definePageMeta({
  layout: 'auth',
})

useHead({ title: 'Login' })

const { fetch: refreshSession } = useUserSession()

const form = reactive({
  email: '',
  password: '',
})

const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)

async function submitLogin() {
  errorMessage.value = null
  isSubmitting.value = true

  try {
    const response = await $fetch<ApiResponse<AuthUser>>('/api/auth/login', {
      method: 'POST',
      body: form,
      ignoreResponseError: true,
    })

    if (!response.success) {
      errorMessage.value = response.error ?? 'Gagal login.'
      return
    }

    await refreshSession()
    await navigateTo('/transactions')
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal login.'
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Masuk
      </h1>
      <p class="text-muted mt-1 text-sm">
        Kelola keuangan harianmu
      </p>

      <form
        class="mt-6 space-y-4"
        @submit.prevent="submitLogin"
      >
        <label class="block space-y-1.5">
          <span class="text-label">Email</span>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="touch-target w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-slate-700"
            :disabled="isSubmitting"
          >
        </label>

        <label class="block space-y-1.5">
          <span class="text-label">Password</span>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="touch-target w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-slate-700"
            :disabled="isSubmitting"
          >
        </label>

        <p
          v-if="errorMessage"
          class="alert-error px-3 py-2 text-sm"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="touch-target w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Memproses...' : 'Login' }}
        </button>
      </form>

      <p class="text-muted mt-5 text-center text-sm">
        Belum punya akun?
        <NuxtLink
          to="/register"
          class="font-medium text-slate-900 underline-offset-2 hover:underline dark:text-slate-100"
        >
          Daftar
        </NuxtLink>
      </p>
    </div>
  </main>
</template>
