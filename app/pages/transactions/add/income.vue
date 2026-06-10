<script setup lang="ts">
useHead({ title: 'Add Income' })
</script>

<template>
  <div>
    <TransactionBackHeader
      title="Add Income"
      subtitle="Catat pemasukan baru"
      back-to="/transactions/add"
    />

    <main class="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <TransactionForm type="INCOME" />
    </main>
  </div>
</template>
