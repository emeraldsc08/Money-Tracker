<script setup lang="ts">
useHead({ title: 'Add Outcome' })
</script>

<template>
  <div>
    <TransactionBackHeader
      title="Add Outcome"
      subtitle="Record new expense"
      back-to="/transactions/add"
    />

    <main class="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <TransactionForm type="OUTCOME" />
    </main>
  </div>
</template>
