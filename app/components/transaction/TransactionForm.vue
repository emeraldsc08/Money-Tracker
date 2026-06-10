<script setup lang="ts">
import type { ApiResponse } from '~~/shared/types/api'
import type { SerializedTransaction } from '~~/shared/types/transaction'
import { formatAmountInput, parseAmountInput } from '~/utils/format'
import {
  createEmptyFormStateForType,
  formStateFromTransaction,
  formStateToPayload,
  validateTransactionFormClient,
  type TransactionFormState,
} from '~/utils/transaction-form'

const props = defineProps<{
  type: 'INCOME' | 'OUTCOME'
  transaction?: SerializedTransaction
}>()

function createInitialFormState(): TransactionFormState {
  if (props.transaction) {
    return formStateFromTransaction(props.transaction)
  }

  return {
    type: props.type,
    date: '',
    source: 'Uang Tunai',
    title: '',
    category: '',
    amount: '',
    description: '',
  }
}

const form = ref<TransactionFormState>(createInitialFormState())
const isFormReady = ref(!!props.transaction)
const errorMessage = ref<string | null>(null)
const deleteError = ref<string | null>(null)
const isSubmitting = ref(false)
const isDeleteOpen = ref(false)

const isEditMode = computed(() => !!props.transaction)
const isIncome = computed(() => props.type === 'INCOME')
const {
  categories,
  addCategory,
  removeCategory,
  isCustomCategory,
  initCategories,
} = useTransactionCategories(props.type)
const {
  sources,
  addSource,
  removeSource,
  isCustomSource,
  initSources,
} = useTransactionSources()
const accentFocusClass = computed(() =>
  isIncome.value
    ? 'focus:border-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-900/40'
    : 'focus:border-rose-500 focus:ring-rose-100 dark:focus:ring-rose-900/40',
)
const submitButtonClass = computed(() =>
  isIncome.value
    ? 'bg-emerald-600 hover:bg-emerald-700'
    : 'bg-rose-600 hover:bg-rose-700',
)
const amountDisplay = computed(() => formatAmountInput(form.value.amount))

onMounted(() => {
  initCategories()
  initSources()
  if (!props.transaction) {
    form.value = createEmptyFormStateForType(props.type)
  }
  isFormReady.value = true
})

function onCategoryAdded(category: string) {
  addCategory(category)
}

function onCategoryDeleted(category: string) {
  removeCategory(category)
  if (form.value.category === category) {
    updateField('category', '')
  }
}

function onSourceAdded(source: string) {
  addSource(source)
}

function onSourceDeleted(source: string) {
  removeSource(source)
  if (form.value.source === source) {
    updateField('source', '')
  }
}

function updateField<K extends keyof TransactionFormState>(key: K, value: TransactionFormState[K]) {
  form.value = { ...form.value, [key]: value }
}

function onAmountInput(event: Event) {
  const rawValue = parseAmountInput((event.target as HTMLInputElement).value)
  updateField('amount', rawValue)
}

async function submitForm() {
  errorMessage.value = validateTransactionFormClient(form.value)
  if (errorMessage.value) {
    return
  }

  isSubmitting.value = true

  try {
    const endpoint = isEditMode.value
      ? `/api/transactions/${props.transaction!.id}`
      : '/api/transactions'

    const response = await $fetch<ApiResponse<SerializedTransaction>>(endpoint, {
      method: isEditMode.value ? 'PUT' : 'POST',
      body: formStateToPayload(form.value),
      ignoreResponseError: true,
    })

    if (!response.success) {
      errorMessage.value = response.error ?? 'Gagal menyimpan transaksi.'
      return
    }

    await navigateTo({
      path: '/transactions',
      query: { toast: isEditMode.value ? 'updated' : 'created' },
    })
  }
  catch (submitError) {
    errorMessage.value = submitError instanceof Error
      ? submitError.message
      : 'Gagal menyimpan transaksi.'
  }
  finally {
    isSubmitting.value = false
  }
}

function cancelForm() {
  navigateTo('/transactions')
}

function openDeleteConfirm() {
  deleteError.value = null
  isDeleteOpen.value = true
}

function closeDeleteConfirm() {
  isDeleteOpen.value = false
  deleteError.value = null
}

async function confirmDelete() {
  if (!props.transaction) {
    return
  }

  deleteError.value = null
  isSubmitting.value = true

  try {
    const response = await $fetch<ApiResponse<SerializedTransaction>>(
      `/api/transactions/${props.transaction.id}`,
      { method: 'DELETE', ignoreResponseError: true },
    )

    if (!response.success) {
      deleteError.value = response.error ?? 'Gagal menghapus transaksi.'
      return
    }

    await navigateTo({
      path: '/transactions',
      query: { toast: 'deleted' },
    })
  }
  catch (deleteSubmitError) {
    deleteError.value = deleteSubmitError instanceof Error
      ? deleteSubmitError.message
      : 'Gagal menghapus transaksi.'
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    v-if="!isFormReady"
    class="animate-pulse space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    aria-hidden="true"
  >
    <div
      v-for="index in 6"
      :key="index"
      class="h-11 rounded-xl skeleton-bar"
    />
  </div>

  <form
    v-else
    class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    @submit.prevent="submitForm"
  >
    <label class="block space-y-1.5">
      <span class="text-label">Tanggal & Jam</span>
      <input
        :value="form.date"
        type="datetime-local"
        required
        class="touch-target w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        :class="accentFocusClass"
        :disabled="isSubmitting"
        @input="updateField('date', ($event.target as HTMLInputElement).value)"
      >
    </label>

    <label class="block space-y-1.5">
      <span class="text-label">Jenis Sumber</span>
      <SearchableCombobox
        :model-value="form.source"
        :options="sources"
        placeholder="Cari atau ketik sumber..."
        :accent-focus-class="accentFocusClass"
        :can-delete="isCustomSource"
        :disabled="isSubmitting"
        @update:model-value="updateField('source', $event)"
        @add-option="onSourceAdded"
        @delete-option="onSourceDeleted"
      />
    </label>

    <label class="block space-y-1.5">
      <span class="text-label">Amount</span>
      <div class="relative">
        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400">
          Rp
        </span>
        <input
          :value="amountDisplay"
          type="text"
          inputmode="numeric"
          required
          placeholder="0"
          class="touch-target w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          :class="accentFocusClass"
          :disabled="isSubmitting"
          @input="onAmountInput"
        >
      </div>
    </label>

    <label class="block space-y-1.5">
      <span class="text-label">Title</span>
      <input
        :value="form.title"
        type="text"
        required
        class="touch-target w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        :class="accentFocusClass"
        :disabled="isSubmitting"
        @input="updateField('title', ($event.target as HTMLInputElement).value)"
      >
    </label>

    <label class="block space-y-1.5">
      <span class="text-label">Category</span>
      <SearchableCombobox
        :model-value="form.category"
        :options="categories"
        placeholder="Cari atau ketik kategori..."
        :accent-focus-class="accentFocusClass"
        :can-delete="isCustomCategory"
        :disabled="isSubmitting"
        @update:model-value="updateField('category', $event)"
        @add-option="onCategoryAdded"
        @delete-option="onCategoryDeleted"
      />
    </label>

    <label class="block space-y-1.5">
      <span class="text-label">Description (optional)</span>
      <textarea
        :value="form.description"
        rows="3"
        class="touch-target w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        :class="accentFocusClass"
        :disabled="isSubmitting"
        @input="updateField('description', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>

    <p
      v-if="errorMessage"
      class="alert-error px-3 py-2 text-sm"
    >
      {{ errorMessage }}
    </p>

    <div class="flex flex-col gap-2 pt-2">
      <div class="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          class="touch-target rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          :disabled="isSubmitting"
          @click="cancelForm"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="touch-target flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
          :class="submitButtonClass"
          :disabled="isSubmitting"
        >
          <span
            v-if="isSubmitting"
            class="inline-flex items-center justify-center gap-2"
          >
            <svg
              class="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Menyimpan...
          </span>
          <span v-else>{{ isEditMode ? 'Simpan Perubahan' : 'Simpan Transaksi' }}</span>
        </button>
      </div>

      <button
        v-if="isEditMode"
        type="button"
        class="touch-target rounded-xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
        :disabled="isSubmitting"
        @click="openDeleteConfirm"
      >
        Hapus Transaksi
      </button>
    </div>
  </form>

  <TransactionDeleteModal
    :open="isDeleteOpen"
    :transaction="transaction ?? null"
    :submitting="isSubmitting"
    :error-message="deleteError"
    @close="closeDeleteConfirm"
    @confirm="confirmDelete"
  />
</template>
