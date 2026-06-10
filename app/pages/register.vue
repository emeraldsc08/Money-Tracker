<script setup lang="ts">
import type { ApiResponse } from '~~/shared/types/api'
import type { AuthUser } from '~~/shared/types/auth'

definePageMeta({
  layout: 'auth',
})

useHead({ title: 'Sign Up' })

const { fetch: refreshSession } = useUserSession()

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)

async function submitRegister() {
  errorMessage.value = null
  isSubmitting.value = true

  try {
    const response = await $fetch<ApiResponse<AuthUser>>('/api/auth/register', {
      method: 'POST',
      body: form,
      ignoreResponseError: true,
    })

    if (!response.success) {
      errorMessage.value = response.error ?? 'Failed to sign up.'
      return
    }

    await refreshSession()
    await navigateTo('/transactions')
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to sign up.'
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
        Sign Up
      </h1>
      <p class="text-muted mt-1 text-sm">
        Create your Money Tracker account
      </p>

      <form
        class="mt-6 space-y-4"
        @submit.prevent="submitRegister"
      >
        <label class="block space-y-1.5">
          <span class="text-label">Name</span>
          <input
            v-model="form.name"
            type="text"
            required
            autocomplete="name"
            placeholder="Your full name"
            class="touch-target w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-slate-700"
            :disabled="isSubmitting"
          >
        </label>

        <label class="block space-y-1.5">
          <span class="text-label">Email</span>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
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
            minlength="6"
            autocomplete="new-password"
            placeholder="At least 6 characters"
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
          class="touch-target w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="text-muted mt-5 text-center text-sm">
        Already have an account?
        <NuxtLink
          to="/login"
          class="font-medium text-slate-900 underline-offset-2 hover:underline dark:text-slate-100"
        >
          Log in
        </NuxtLink>
      </p>
    </div>
  </main>
</template>
