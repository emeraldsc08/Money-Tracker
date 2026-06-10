<script setup lang="ts">
import type { ApiResponse } from '~~/shared/types/api'
import type { SerializedTransaction } from '~~/shared/types/transaction'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: transaction, status, error } = await useFetch(
  () => `/api/transactions/${id.value}`,
  {
    key: () => `transaction-edit-${id.value}`,
    transform: (response: ApiResponse<SerializedTransaction>) => {
      if (!response.success || !response.data) {
        throw createError({
          statusCode: 404,
          statusMessage: response.error ?? 'Transaction not found.',
        })
      }
      return response.data
    },
  },
)

useHead({
  title: computed(() => transaction.value ? `Edit ${transaction.value.title}` : 'Edit Transaction'),
})
</script>

<template>
  <div>
    <div
      v-if="status === 'pending'"
      class="text-muted mx-auto max-w-3xl px-4 py-16 text-center sm:px-6"
    >
      Loading transaction...
    </div>

    <div
      v-else-if="error"
      class="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6"
    >
      <p class="text-sm text-outcome">
        {{ error.message }}
      </p>
      <NuxtLink
        to="/transactions"
        class="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
      >
        Back to Transactions
      </NuxtLink>
    </div>

    <template v-else-if="transaction">
      <TransactionBackHeader
        title="Edit Transaction"
        :subtitle="transaction.title"
        back-to="/transactions"
      />

      <main class="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <TransactionForm
          :type="transaction.type"
          :transaction="transaction"
        />
      </main>
    </template>
  </div>
</template>
