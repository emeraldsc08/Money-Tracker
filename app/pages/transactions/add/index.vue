<script setup lang="ts">
useHead({ title: 'Add Transaction' })
</script>

<template>
  <div>
    <TransactionBackHeader
      title="Add Transaction"
      subtitle="Pilih jenis transaksi"
      back-to="/transactions"
    />

    <main class="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <TransactionTypeCard
          type="INCOME"
          title="Income"
          description="Catat pemasukan seperti gaji, freelance, atau investasi"
          to="/transactions/add/income"
        />
        <TransactionTypeCard
          type="OUTCOME"
          title="Outcome"
          description="Catat pengeluaran seperti makan, transport, atau belanja"
          to="/transactions/add/outcome"
        />
      </div>
    </main>
  </div>
</template>
