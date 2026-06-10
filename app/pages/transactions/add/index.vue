<script setup lang="ts">
useHead({ title: 'Add Transaction' })
</script>

<template>
  <div>
    <TransactionBackHeader
      title="Add Transaction"
      subtitle="Choose transaction type"
      back-to="/transactions"
    />

    <main class="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <TransactionTypeCard
          type="INCOME"
          title="Income"
          description="Record income such as salary, freelance, or investments"
          to="/transactions/add/income"
        />
        <TransactionTypeCard
          type="OUTCOME"
          title="Outcome"
          description="Record expenses such as food, transport, or shopping"
          to="/transactions/add/outcome"
        />
      </div>
    </main>
  </div>
</template>
