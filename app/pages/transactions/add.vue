<script setup lang="ts">
import type { AddTransactionType } from '~/composables/useAddTransaction'

const route = useRoute()
const { openTypePicker, selectType } = useAddTransaction()

const typeParam = computed(() => route.query.type)
const directType = computed<AddTransactionType | null>(() => {
  if (typeParam.value === 'INCOME' || typeParam.value === 'income') {
    return 'INCOME'
  }
  if (typeParam.value === 'OUTCOME' || typeParam.value === 'outcome') {
    return 'OUTCOME'
  }
  return null
})

onMounted(() => {
  if (directType.value) {
    selectType(directType.value)
  }
  else {
    openTypePicker()
  }

  navigateTo('/transactions', { replace: true })
})
</script>

<template>
  <div />
</template>
