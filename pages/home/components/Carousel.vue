<script setup lang="ts">
const items = [
  "https://images.t2u.io/upload/a/0-1176-AWSS3d2cae914-b713-4e28-9782-8469930695ac-mbto_M.jpg",
  "https://images.t2u.io/upload/a/0-1144-AWSS353de11cc-43de-4069-9ecd-c3323e8a29d5-vGwG_M.jpg",
  "https://images.t2u.io/upload/a/0-1196-AWSS36475d37d-4ac2-4e9a-90f3-588e1ef8f2a2-T22H_M.jpg",
  "https://images.t2u.io/upload/a/0-1211-AWSS3038b693a-a87c-49ce-a4b5-832d7da73396-RwGo_M.jpg",
  "https://images.t2u.io/upload/a/0-1180-AWSS37adf114a-cf8f-4b56-ad6a-a874ae8626ef-j8Bb_M.jpg",
  "https://images.t2u.io/upload/a/0-1184-AWSS3931b8df4-34b3-45bb-bf39-47a1fac688ba-3s32_M.png",
];
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    loop
    arrows
    dots
    :autoplay="{ delay: 10000 }"
    :items="items"
    :ui="{
      controls: 'absolute top-38 inset-x-15',
      dots: '-bottom-40 ',
      dot: 'w-6 h-1 data-[state=active]:bg-cyan-600',
      prev: 'opacity-50 hover:opacity-80 transition-opacity cursor-pointer',
      next: 'opacity-50 hover:opacity-80 transition-opacity cursor-pointer',
    }"
  >
    <img :src="item" class="w-full h-64 md:h-72 lg:h-80 object-cover" />
  </UCarousel>
</template>
