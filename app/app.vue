<template>
  <div class="overflow-x-clip">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <AppToast />
    </ClientOnly>
  </div>
</template>
