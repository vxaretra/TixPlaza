<script setup lang="ts">
import { ref } from "vue";
import { useMediaQuery } from "@vueuse/core";
import type { NavigationMenuItem } from "@nuxt/ui";

const isMobile = useMediaQuery("(max-width: 768px)");

const items = computed(
  () =>
    [
      {
        icon: "i-lucide-shopping-basket",
        slot: "carts" as const,
        ...(isMobile.value
          ? {} // No dropdown
          : {
              children: [
                {
                  label: "Not-Found",
                  description:
                    "Keranjang belanja Anda kosong. Silakan tambahkan produk ke keranjang.",
                  to: "/asdasd",
                },
                {
                  label: "Not-Found",
                  description:
                    "Keranjang belanja Anda kosong. Silakan tambahkan produk ke keranjang.",
                },
                {
                  label: "Not-Found",
                  description:
                    "Keranjang belanja Anda kosong. Silakan tambahkan produk ke keranjang.",
                },
              ],
            }),
      },
      {
        label: "Daftar",
        icon: "i-lucide-user-plus",
        to: "/auth/register",
      },
      {
        label: "Masuk",
        icon: "i-lucide-user-lock",
        to: "/auth/login",
      },
    ] satisfies NavigationMenuItem[]
);

const isOpen = ref(false);

const isDark = ref(true);

const toggleDarkMode = () => {
  const colorMode = useColorMode();
  colorMode.preference = isDark.value ? "dark" : "light";
};
</script>

<template>
  <div
    class="flex items-center justify-center px-4 py-3 border-b border-gray-200 dark:border-[#0ea5e9]"
  >
    <div class="flex justify-between items-center w-full max-w-6xl">
      <!-- Logo -->
      <NuxtLink to="/home" class="font-bold text-2xl"
        ><span class="text-cyan-600">
          <UIcon name="i-lucide-tickets" class="size-5 mr-1" />Tix</span
        >Plaza</NuxtLink
      >
      <div class="flex items-center space-x-2">
        <USwitch
          v-model="isDark"
          color="neutral"
          unchecked-icon="i-lucide-sun"
          checked-icon="i-lucide-moon"
          @update:model-value="toggleDarkMode"
        />

        <USeparator
          orientation="vertical"
          :color="isDark ? 'info' : 'neutral'"
          class="h-5"
        />

        <!-- Desktop Menu -->
        <div class="hidden md:block">
          <UNavigationMenu color="info" :items="items" class="w-full">
            <template #carts-content="{ item }">
              <div
                v-if="item.children?.[0]?.label == 'Not-Found'"
                class="flex flex-col items-center p-10 space-y-2"
              >
                <UIcon name="i-lucide-clipboard-plus" class="size-25" />
                <p class="font-semibold text-center text-sm">
                  Yahh, keranjang belanja Anda masih kosong nih.
                </p>
                <UButton
                  icon="i-lucide-rocket"
                  size="md"
                  color="info"
                  variant="solid"
                  >Belanja Yukk</UButton
                >
              </div>

              <ul v-else>
                <li v-for="child in item.children" :key="child.label">
                  <ULink
                    class="text-sm text-left rounded-md p-3 transition-colors hover:bg-elevated/50"
                  >
                    <p class="font-medium text-highlighted">
                      {{ child.label }}
                    </p>
                    <p class="text-muted line-clamp-2">
                      {{ child.description }}
                    </p>
                  </ULink>
                </li>
              </ul>
            </template>
          </UNavigationMenu>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 rounded-md border"
          @click="isOpen = !isOpen"
        >
          <UIcon
            :name="isOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
            class="w-6 h-6"
          />
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu Dropdown -->
  <div v-if="isOpen" class="md:hidden border-t border-gray-200 px-4 py-2">
    <UNavigationMenu color="info" :items="items" orientation="vertical">
      <!-- Mobile override for `carts` slot -->
      <template #carts="{ item }">
        <ULink
          to="/cart"
          class="flex items-center gap-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <UIcon
            name="i-lucide-shopping-basket"
            class="w-4.5 h-4.5 -ml-0.5 text-[#90a1b9] dark:text-[#62748e]"
          />
          Keranjang
        </ULink>
      </template>
    </UNavigationMenu>
  </div>

  <!-- Page Content -->
  <UContainer class="pt-4">
    <router-view />
  </UContainer>

  <!-- Footer -->
</template>
