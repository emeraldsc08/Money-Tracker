<script setup lang="ts">
import type { AddTransactionType } from '~/composables/useAddTransaction'

const { isTypePickerOpen, closeAddFlow, selectType } = useAddTransaction()

function onSelect(type: AddTransactionType) {
  selectType(type)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isTypePickerOpen"
      class="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4"
      @click.self="closeAddFlow"
    >
      <div
        class="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-xl dark:bg-slate-900 sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="type-picker-title"
      >
        <div class="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="type-picker-title"
              class="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              Add Transaction
            </h2>
            <p class="text-muted mt-1">
              Choose transaction type
            </p>
          </div>
          <button
            type="button"
            class="touch-target flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close"
            @click="closeAddFlow"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <TransactionTypeCard
            type="INCOME"
            title="Income"
            description="Salary, freelance, investments"
            @select="onSelect"
          />
          <TransactionTypeCard
            type="OUTCOME"
            title="Outcome"
            description="Food, transport, shopping"
            @select="onSelect"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
