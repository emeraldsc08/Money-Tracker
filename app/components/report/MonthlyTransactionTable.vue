<script setup lang="ts">
import type { SerializedTransaction } from '~~/shared/types/transaction'
import { formatSignedRupiah, formatTransactionDate } from '~/utils/format'

defineProps<{
  transactions: SerializedTransaction[]
}>()
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:px-5">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">
        All Transactions
      </h2>
      <slot name="actions" />
    </div>

    <div
      v-if="transactions.length === 0"
      class="text-muted px-4 py-10 text-center sm:px-5"
    >
      No transactions this month.
    </div>

    <div
      v-else
      class="overflow-x-auto"
    >
      <table class="min-w-full text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <tr>
            <th class="px-4 py-3 font-medium sm:px-5">
              Date
            </th>
            <th class="px-4 py-3 font-medium sm:px-5">
              Title
            </th>
            <th class="px-4 py-3 font-medium sm:px-5">
              Category
            </th>
            <th class="px-4 py-3 font-medium sm:px-5">
              Source
            </th>
            <th class="px-4 py-3 font-medium sm:px-5">
              Type
            </th>
            <th class="px-4 py-3 font-medium text-right sm:px-5">
              Amount
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr
            v-for="transaction in transactions"
            :key="transaction.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-800/60"
          >
            <td class="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400 sm:px-5">
              {{ formatTransactionDate(transaction.date) }}
            </td>
            <td class="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 sm:px-5">
              {{ transaction.title }}
            </td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-400 sm:px-5">
              {{ transaction.category }}
            </td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-400 sm:px-5">
              {{ transaction.source }}
            </td>
            <td class="px-4 py-3 sm:px-5">
              <span
                class="rounded-full px-2.5 py-1 text-xs font-medium"
                :class="transaction.type === 'INCOME' ? 'badge-income' : 'badge-outcome'"
              >
                {{ transaction.type }}
              </span>
            </td>
            <td
              class="whitespace-nowrap px-4 py-3 text-right font-semibold sm:px-5"
              :class="transaction.type === 'INCOME' ? 'text-income' : 'text-outcome'"
            >
              {{ formatSignedRupiah(transaction.amount, transaction.type) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
