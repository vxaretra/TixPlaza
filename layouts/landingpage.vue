<template>
  <q-layout view="hHh LpR fFf">
    <q-header :class="headerClass" elevated height-hint="98">
      <!-- Toolbar with Brand and Auth Buttons -->
      <q-toolbar class="h-20">
        <q-toolbar-title>
          <!-- Show logo only on larger screens -->
          <q-btn flat no-caps no-wrap class="ml-5" v-if="$q.screen.gt.xs">
            <q-icon name="local_activity" size="28px" />
            <p shrink class="font-semibold text-2xl md:text-4xl pl-1">
              TixPlaza
            </p>
          </q-btn>
          <!-- Show smaller logo for small screens -->
          <q-btn flat no-caps no-wrap class="ml-2" v-else>
            <q-icon name="local_activity" size="24px" />
            <p shrink class="font-semibold text-xl pl-1">TixPlaza</p>
          </q-btn>
        </q-toolbar-title>

        <!-- Auth Buttons, align on the right side -->
        <q-btn
          flat
          dense
          icon="assignment_ind"
          label="Masuk"
          class="mr-2 hidden sm:block"
          @click="$router.push('auth/login')"
        />
        <q-btn
          push
          dense
          color="primary"
          label="Daftar"
          icon="person_add"
          class="p-2 mr-5 hidden sm:block"
          @click="$router.push('auth/register')"
        />
      </q-toolbar>

      <!-- Search and Menu Options - Only shown after scrolling -->
      <div
        v-if="isScrolled"
        class="flex flex-col md:flex-row justify-between px-4 md:px-8 pb-5 items-center"
      >
        <!-- Search Input with different sizes for responsiveness -->
        <q-input
          outlined
          v-model="text"
          label="Cari Tiket"
          rounded
          bg-color="white"
          class="w-full md:w-2/6 mb-3 md:mb-0"
        >
          <template v-slot:append>
            <q-icon
              v-if="text !== ''"
              name="close"
              @click="text = ''"
              class="cursor-pointer"
            />
            <q-icon name="search" class="cursor-pointer" />
          </template>
        </q-input>

        <!-- Navigation Links for Categories -->
        <div class="text-center items-center flex justify-center">
          <q-btn flat no-caps dense label="Konser" class="text-lg font-mono" />
          <q-btn
            flat
            no-caps
            dense
            label="Stand Up"
            class="ml-2 text-lg font-mono"
          />
          <q-btn
            flat
            no-caps
            dense
            label="Event"
            class="ml-2 text-lg font-mono"
          />
          <q-btn
            flat
            no-caps
            dense
            label="Seminar"
            class="ml-2 text-lg font-mono"
          />
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <div bordered class="bg-slate-100 text-black py-4">
      <q-toolbar>
        <q-toolbar-title align="center">
          <q-btn flat no-caps no-wrap class="p-5" v-if="$q.screen.gt.xs">
            <q-icon name="local_activity" size="28px" />
            <p shrink class="font-semibold text-2xl md:text-4xl pl-1">
              TixPlaza
            </p>
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
      <div align="center" class="text-black space-x-1" style="font-size: 2.5em">
        <q-icon name="instagram" />
        <q-icon name="instagram" />
        <q-icon name="facebook" />
        <q-icon name="instagram" />
      </div>
      <div class="flex justify-center space-x-5 pt-3">
        <NuxtLink
          :to="{ name: 'auth-register' }"
          class="text-lg text-black focus:text-cyan-800 hover:text-cyan-800 hover:underline"
          >Apa itu TixPlaza?</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'auth-register' }"
          class="text-lg text-black focus:text-cyan-800 hover:text-cyan-800 hover:underline"
          >| Syarat dan Ketentuan</NuxtLink
        >
        <NuxtLink
          :to="{ name: 'auth-register' }"
          class="text-lg text-black focus:text-cyan-800 hover:text-cyan-800 hover:underline"
          >| Kebijakan Privasi</NuxtLink
        >
      </div>
      <div align="center" class="pt-5">
        <p class="text-sm">©2023. TixPlaza. All Rights Reserved.</p>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// Ref untuk menyimpan status scroll
const isScrolled = ref(false);

// Fungsi untuk memeriksa posisi scroll dan mengubah status
const handleScroll = () => {
  isScrolled.value = window.scrollY > 300; // Jika scroll lebih dari 50px, ubah status
};

// Tambahkan dan bersihkan event listener saat komponen dimount dan di-unmount
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Kelas dinamis untuk header
const headerClass = computed(() => {
  return isScrolled.value
    ? "bg-white text-black shadow-lg" // Saat di-scroll
    : "bg-cyan-600 text-white"; // Saat sebelum di-scroll
});
</script>

<style scoped>
.q-header {
  transition: background-color 0.3s, color 0.3s; /* Transisi halus */
}
</style>
