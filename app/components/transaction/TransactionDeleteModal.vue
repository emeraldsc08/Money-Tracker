<script setup lang="ts">
import type { SerializedTransaction } from '~~/shared/types/transaction'
import { formatSignedRupiah, formatTransactionDate } from '~/utils/format'

defineProps<{
  open: boolean
  transaction: SerializedTransaction | null
  submitting: boolean
  errorMessage: string | null
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && transaction"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="emit('close')"
    >
      <div
        class="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirm delete transaction"
      >
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Hapus transaksi?
        </h2>
        <p class="text-muted mt-2">
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div class="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800 dark:text-slate-200">
          <p class="font-medium text-slate-900 dark:text-slate-100">
            {{ transaction.title }}
          </p>
          <p class="text-muted mt-1">
            {{ formatTransactionDate(transaction.date) }}
          </p>
          <p
            class="mt-2 font-semibold"
            :class="transaction.type === 'INCOME' ? 'text-income' : 'text-outcome'"
          >
            {{ formatSignedRupiah(transaction.amount, transaction.type) }}
          </p>
        </div>

        <p
          v-if="errorMessage"
          class="alert-error mt-4 px-3 py-2 text-sm"
        >
          {{ errorMessage }}
        </p>

        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="touch-target rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            :disabled="submitting"
            @click="emit('close')"
          >
            Batal
          </button>
          <button
            type="button"
            class="touch-target rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
            :disabled="submitting"
            @click="emit('confirm')"
          >
            {{ submitting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
