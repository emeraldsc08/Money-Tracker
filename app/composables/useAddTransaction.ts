export type AddTransactionType = 'INCOME' | 'OUTCOME'

export function useAddTransaction() {
  const isTypePickerOpen = useState('add-tx-type-open', () => false)
  const isFormOpen = useState('add-tx-form-open', () => false)
  const selectedType = useState<AddTransactionType | null>('add-tx-type', () => null)

  function openTypePicker() {
    selectedType.value = null
    isFormOpen.value = false
    isTypePickerOpen.value = true
  }

  function closeAddFlow() {
    isTypePickerOpen.value = false
    isFormOpen.value = false
    selectedType.value = null
  }

  function selectType(type: AddTransactionType) {
    selectedType.value = type
    isTypePickerOpen.value = false
    isFormOpen.value = true
  }

  function backToTypePicker() {
    isFormOpen.value = false
    isTypePickerOpen.value = true
    selectedType.value = null
  }

  return {
    isTypePickerOpen,
    isFormOpen,
    selectedType,
    openTypePicker,
    closeAddFlow,
    selectType,
    backToTypePicker,
  }
}
