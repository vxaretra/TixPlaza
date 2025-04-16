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
        <div v-if="authUser" class="p-5 space-x-5 flex">
          <div class="flex items-center space-x-3">
            <q-btn
              flat
              :color="isScrolled ? 'primary' : 'white'"
              icon="shopping_cart"
            />
            <q-btn
              flat
              :color="isScrolled ? 'primary' : 'white'"
              icon="notifications"
            />
            <q-btn
              flat
              :color="isScrolled ? 'primary' : 'white'"
              icon="mail_outline"
            />
          </div>
          <q-separator :color="isScrolled ? 'black' : 'white'" vertical />
          <div>
            <q-btn
              flat
              :color="isScrolled ? 'primary' : 'white'"
              @click="menu = true"
              ref="menuBtn"
            >
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
              </q-avatar>
              <div class="mx-3">
                {{ authUser.name }}
              </div>
              <q-menu
                transition-show="jump-down"
                transition-hide="jump-up"
                class="h-auto"
              >
                <div class="q-px-md pt-3">
                  <div class="p-2 border-2 shadow-md rounded-md">
                    <q-avatar size="42px">
                      <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                    </q-avatar>
                    {{ authUser.name }}
                  </div>
                </div>
                <div class="row no-wrap q-pa-md">
                  <div class="column" style="width: 220px">
                    <q-btn flat push no-caps>
                      <div
                        class="flex justify-between items-center text-center w-full align-top text-blue-400"
                      >
                        <div class="italic">
                          <q-icon name="games" /> TIXPLUS
                        </div>
                      </div>
                      <div class="text-xs text-left">
                        Coba Member Gratis 30 Hari, Yuk!
                      </div>
                      <div class="text-xs text-justify text-gray-600">
                        Nikmati diskon up to 25% untuk beragam produk
                      </div>
                    </q-btn>

                    <q-separator class="q-my-sm" />

                    <q-btn flat push no-caps>
                      <div
                        class="flex justify-between items-center text-center w-full align-top text-blue-400"
                      >
                        <div class="italic">
                          <q-icon name="savings" />
                          <span class="whitespace-normal">TixSave</span>
                        </div>
                        <div>Rp. 200.000</div>
                      </div>
                    </q-btn>

                    <q-separator class="q-my-sm" />

                    <q-btn flat push no-caps>
                      <div
                        class="flex justify-between items-center text-center w-full align-top text-blue-400"
                      >
                        <div class="italic">
                          <q-icon name="credit_card" />
                          <span class="whitespace-normal">Debit / Credit</span>
                        </div>
                        <!-- <div>Rp. 100.000</div>] -->
                      </div>
                      <div class="text-xs text-justify text-gray-600">
                        Tambahkan kartu debit/credit anda
                      </div>
                    </q-btn>

                    <q-separator class="q-my-sm" />
                  </div>

                  <q-separator vertical inset class="q-mx-sm" />

                  <div class="column items-center font-mono">
                    <q-btn
                      flat
                      align="left"
                      color="grey-13"
                      label="Pembelian"
                      no-caps
                      dense
                      style="width: 120px"
                    />
                    <q-btn
                      flat
                      align="left"
                      color="grey-13"
                      label="Wishlist"
                      no-caps
                      dense
                      style="width: 120px"
                    />
                    <q-btn
                      flat
                      align="left"
                      color="grey-13"
                      label="Toko Favorit"
                      no-caps
                      dense
                      style="width: 120px"
                    />
                    <q-btn
                      flat
                      align="left"
                      color="grey-13"
                      label="Pengaturan"
                      no-caps
                      dense
                      style="width: 120px"
                    />
                    <q-space />
                    <q-btn
                      flat
                      align="left"
                      color="grey-13"
                      no-caps
                      dense
                      style="width: 120px; margin-bottom: 5px"
                      @click="LogOut()"
                    >
                      <div class="row items-center no-wrap">
                        <q-icon left name="logout" class="text-sm" />
                        <div class="text-center">Logout</div>
                      </div>
                    </q-btn>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </div>
        </div>
        <div v-else class="flex">
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
        </div>
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
        <q-icon name="facebook" />
        <q-icon name="facebook" />
        <q-icon name="facebook" />
        <q-icon name="facebook" />
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

const { $axios } = useNuxtApp();
const q = useQuasar();
const authUser = useAuthUser();
const menu = ref(false);

// Ref untuk menyimpan status scroll
const isScrolled = ref(false);

// Fungsi untuk memeriksa posisi scroll dan mengubah status
const handleScroll = () => {
  isScrolled.value = window.scrollY > 300; // Jika scroll lebih dari 50px, ubah status
};

// Tambahkan dan bersihkan event listener saat komponen dimount dan di-unmount
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  console.log(authUser.value);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Kelas dinamis untuk header
const headerClass = computed(() => {
  return isScrolled.value
    ? "bg-white text-[#1976d2] shadow-lg" // Saat di-scroll
    : "bg-cyan-600 text-white"; // Saat sebelum di-scroll
});

const LogOut = async () => {
  q.loading.show();
  try {
    const { data } = await $axios.post("/api/auth/logout");
    // Remove token and user cookies
    const tokenCookie = useCookie("token");
    const userCookie = useCookie("auth_user");

    tokenCookie.value = null;
    userCookie.value = null;

    // Optional: Clear the authUser ref if you're using it reactively
    authUser.value = null;

    console.log(data);

    q.notify({
      type: "positive",
      message: data.message,
      position: "top",
      timeout: 2000,
    });
    q.loading.hide();
    // Optional: redirect to login or home
    await navigateTo("/auth/login"); // or wherever you want
  } catch (e) {
    console.log("err logout FE: ", e);
    q.notify({
      type: "negative",
      message: "Terjadi kesalahan saat logout, mohon coba lagi",
      position: "top",
      timeout: 2000,
    });
    q.loading.hide();
  }
};
</script>

<style scoped>
.q-header {
  transition: background-color 0.3s, color 0.3s; /* Transisi halus */
}
</style>
