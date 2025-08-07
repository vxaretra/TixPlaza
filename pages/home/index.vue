<template>
  <div>
    <Carousel />

    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 my-5">
      <!-- Filters: City & Category -->
      <div
        class="md:col-span-4 flex flex-col md:flex-row items-start md:items-center gap-4"
      >
        <!-- City Dropdown -->
        <UInputMenu
          :items="cities"
          :loading="citiesStatus === 'pending'"
          :search-input="{ icon: 'i-lucide-search' }"
          placeholder="Pilih Kota"
          variant="none"
          class="w-full md:w-48"
          @update:open="onOpen"
        >
          <template #leading="{ ui }">
            <UIcon name="i-lucide-earth" :class="ui.leadingIcon()" />
          </template>
          <template #item="{ item }">
            <div class="flex items-center gap-2">
              <span>{{ item }}</span>
            </div>
          </template>
        </UInputMenu>

        <!-- Category Dropdown -->
        <UInputMenu
          :items="users"
          :loading="userStatus === 'pending'"
          placeholder="Kategori"
          variant="none"
          class="w-full md:w-48"
        >
          <template #leading="{ modelValue, ui }">
            <UIcon
              :name="modelValue?.icon || 'i-lucide-folder-search'"
              :class="ui.leadingIcon()"
            />
          </template>
        </UInputMenu>
      </div>

      <!-- Search Bar -->
      <div
        class="md:col-span-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0"
      >
        <USeparator
          orientation="vertical"
          class="hidden md:block h-8 pr-10"
          size="sm"
        />

        <div class="flex w-full">
          <UInput
            ref="search"
            highlight
            size="xl"
            icon="i-lucide-search"
            placeholder="Search..."
            class="w-full md:w-5/6"
            :ui="{
              base: 'rounded-none rounded-l-lg ring-cyan-600 focus-visible:ring-cyan-600',
            }"
          >
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>

          <UButton
            size="xl"
            class="w-full md:w-1/6"
            :ui="{ base: 'rounded-none rounded-r-lg bg-cyan-600' }"
          >
            Search
          </UButton>
        </div>
      </div>
    </div>

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

<script setup lang="ts">
import ProductCard from "./components/ProductCard.vue";
import Carousel from "./components/Carousel.vue";
import type { AvatarProps } from "@nuxt/ui";

definePageMeta({
  layout: "landingpage",
});

const search = useTemplateRef("search");

defineShortcuts({
  "/": () => {
    search.value?.inputRef?.focus();
  },
});

const {
  data: citiesResponse,
  status: citiesStatus,
  execute,
} = await useLazyFetch<{
  data: string[];
}>(() => "https://countriesnow.space/api/v0.1/countries/cities", {
  method: "POST",
  immediate: false,
  body: {
    country: "indonesia",
  },
  headers: {
    "Content-Type": "application/json",
  },
});

const cities = computed(() => citiesResponse.value?.data ?? []);

function onOpen() {
  if (!cities.value?.length) {
    execute();
  }
}

const { data: usersData, status: userStatus } = await useFetch(
  "https://jsonplaceholder.typicode.com/users",
  {
    key: "typicode-users",
    transform: (data: { id: number; name: string }[]) => {
      return data?.map((user) => ({
        label: user.name,
        value: String(user.id),
        icon: String("i-lucide-volleyball"),
      }));
    },
    lazy: true,
  }
);

const users = computed(() => usersData.value ?? []);
</script>

<style scoped></style>
