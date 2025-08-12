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
          v-model="selectedCategory"
          placeholder="Kategori"
          :items="categories"
          :loading="categoriesLoading"
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
            color="secondary"
            class="w-full md:w-1/6"
            :ui="{
              base: 'rounded-none rounded-r-lg bg-cyan-600 hover:bg-cyan-700 cursor-pointer',
            }"
          >
            Search
          </UButton>
        </div>
      </div>
    </div>

    <div
      v-for="(items, categoryName) in ticketperCategories"
      :key="categoryName"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-2xl font-semibold">{{ categoryName }}</h3>

        <UButton
          size="md"
          color="secondary"
          class="bg-cyan-600 hover:bg-cyan-700 cursor-pointer"
          >View All</UButton
        >
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
        <div
          v-for="(product, index) in ticketperCategories[categoryName]"
          :key="index"
          class="hover:scale-105 transition-transform duration-300 cursor-pointer"
          @click="console.log('Product clicked:', product.name)"
        >
          <ProductCard
            :name="product.name"
            :description="product.copywriting"
            :start="product.start"
            :end="product.end"
            :price="product.price"
            :image="product.image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from "./components/ProductCard.vue";
import Carousel from "./components/Carousel.vue";
import type { ResGetTickets } from "~/dto/tickets";
import { compileScript } from "vue/compiler-sfc";

const { $axios } = useNuxtApp();
const axios = $axios as typeof import("axios").default;
const search = useTemplateRef("search");

definePageMeta({
  layout: "landingpage",
});

defineShortcuts({
  "/": () => {
    search.value?.inputRef?.focus();
  },
});

// Fetch cities from API
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

// Fetch categories from API
type RespCategories = {
  id: number;
  label: string;
  icon: string;
};

const categories = ref<RespCategories[]>([]);

const categoriesLoading = ref(false);

const selectedCategory = ref<RespCategories>(categories.value[1]);

watch(selectedCategory, (newVal) => {
  console.log("Selected category changed:", newVal);
  if (newVal) {
    params.value.categoryIds = String(newVal.id);
    getTicketbyCategories();
  }
});

const getCategories = async () => {
  try {
    categoriesLoading.value = true;
    const { data } = await axios.get("/api/master/categories");
    const newData =
      data != null
        ? (data.data as RespCategories[]).map((obj, index) => ({
            ...obj,
          }))
        : [];

    // paginationConfig.total = data.totalElements;
    categories.value = newData;
    console.log(categories.value);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Categories fetched successfully");
    categoriesLoading.value = false;
  }
};

// Fetch tickets by categories
const loading = ref(false);

type TicketItem = ResGetTickets["data"][number];

interface TicketsResponse {
  data: TicketItem[];
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

const ticket = ref<TicketItem[]>([]);

const params = ref({
  q: "",
  categoryIds: "",
  page: 1,
  limit: 10,
});

const getTicketbyCategories = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get<TicketsResponse>("/api/tickets/", {
      params: params.value,
    });
    console.log(data);
    const newData =
      data != null
        ? data.data.map((obj, index) => ({
            ...obj,
          }))
        : [];

    // paginationConfig.total = data.totalElements;
    ticket.value = newData;
    console.log(ticket.value);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Categories fetched successfully");
    loading.value = false;
  }
};

const ticketperCategories = ref<Record<string, any[]>>({});

const getTicketperCategories = async (category: any) => {
  try {
    loading.value = true;
    console.log("Fetching tickets for category:", category);
    const { data } = await axios.get<TicketsResponse>("/api/tickets/", {
      params: {
        categoryIds: String(category.id),
        limit: 4,
        page: 1,
        sortBy: "id",
        sortOrder: "desc",
      },
    });
    console.log(data);
    ticketperCategories.value[category.label] =
      data != null
        ? data.data.map((obj, index) => ({
            ...obj,
          }))
        : [];
    console.log(category.id, ticketperCategories.value);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Categories fetched successfully");
    loading.value = false;
  }
};

onMounted(async () => {
  await getCategories();
  for (const category of categories.value) {
    if (category.id != 0) {
      console.log(category);
      getTicketperCategories(category);
    }
  }
});
</script>

<style scoped></style>
