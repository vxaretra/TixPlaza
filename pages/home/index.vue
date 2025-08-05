<template>
  <div>
    <ProductCard />

    asdsad
    <UCard variant="subtle">
    <template #header>
      <Placeholder class="h-8" />
    </template>

    <Placeholder class="h-32" />

    <template #footer>
      <Placeholder class="h-8" />
    </template>
  </UCard>
  </div>
</template>

<script setup>
import ProductCard from './components/ProductCard.vue';

definePageMeta({
  layout: "landingpage",
});

</script>

<style scoped></style>
