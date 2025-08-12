<template>
  <UCard
    variant="outline"
    :ui="{ header: 'p-0 sm:p-0', footer: 'p-2 sm:p-2', body: 'p-3 sm:p-3' }"
  >
    <template #header>
      <img
        src="https://d3hzxw6fwm263k.cloudfront.net/uploads/events/photos/1753948273-iMA6KWXenx03zNm7sTsRorXxIT8hAKJG.png"
        alt="Italian Trulli"
      />
      <div class="absolute top-2 right-2 z-50 opacity-100">
        <UButton
          icon="i-lucide-shopping-bag"
          size="md"
          color="secondary"
          variant="solid"
          :ui="{
            base: 'bg-cyan-600 hover:bg-cyan-700 cursor-pointer',
          }"
          @click.stop="console.log('Add to cart clicked')"
        />
      </div>
    </template>

    <div class="">
      <h5 class="text-sm font-bold uppercase truncate">
        {{ name }}
      </h5>
      <p class="text-xs text-gray-500 truncate">
        {{ description }}
      </p>
      <div class="text-sm font-semibold mt-3 space-y-0.5">
        <div class="flex items-center space-x-1">
          <UIcon name="i-lucide-calendar-days" />
          <p class="truncate">{{ start }}</p>
        </div>
        <div class="flex items-center space-x-1">
          <UIcon name="i-lucide-map-pinned" />
          <p class="truncate">
            pontianak | Pontianak, Kalimantan Barat, Indonesia
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div
        class="flex justify-between items-center text-sm font-bold text-slate-600"
      >
        <p class="truncate">Mulai Dari</p>
        <p class="truncate">Rp.{{ formattedPrice }}</p>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const formattedPrice = computed(() => {
  let value = String(props.price ?? ""); // force to string, default empty

  let number_string = value.replace(/[^,\d]/g, "");
  let split = number_string.split(",");
  let sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
});
</script>
