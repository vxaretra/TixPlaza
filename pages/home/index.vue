<template>
  <q-layout>
    <!-- Banner -->
    <div
      class="bg-cyan-600 text-white p-8 text-center h-auto md:h-[35rem] flex items-center justify-center"
    >
      <div class="w-full md:w-1/2 space-y-3 px-4">
        <h1 class="text-2xl md:text-4xl font-bold mb-2">Welcome to TixPlaza</h1>
        <p class="text-lg md:text-xl">
          Discover the best products with amazing deals
        </p>
        <div class="flex justify-center">
          <q-input
            outlined
            v-model="search"
            label="Cari Tiket"
            rounded
            bg-color="white"
            class="w-full md:w-1/2"
          >
            <template v-slot:append>
              <q-icon
                v-if="text !== ''"
                name="close"
                @click="search = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="pt-5 flex justify-center">
          <div
            class="grid grid-cols-2 md:grid-cols-4 md:w-1/2 gap-4 justify-items-center"
          >
            <q-btn
              push
              color="white"
              text-color="primary"
              label="Konser"
              class="w-28"
            >
              <q-badge color="orange" floating>57</q-badge>
            </q-btn>
            <q-btn
              push
              color="white"
              text-color="primary"
              label="Stand Up"
              class="w-28"
            >
              <q-badge color="orange" floating>11</q-badge>
            </q-btn>
            <q-btn
              push
              color="white"
              text-color="primary"
              label="Seminar"
              class="w-28"
            >
              <q-badge color="orange" floating>21</q-badge>
            </q-btn>
            <q-btn
              push
              color="white"
              text-color="primary"
              label="Event"
              class="w-28"
            >
              <q-badge color="orange" floating>32</q-badge>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel -->
    <div class="q-pa-md w-full lg:w-10/12 mx-auto mt-2">
      <div class="items-center lg:text-5xl pl-16 pr-5 lg:pb-5">
        <p class="font-bold text-gray-900">
          Penawaran menarik hanya untuk anda,
        </p>
        <p class="font-bold text-gray-900">
          jangan sampai kelewatan!<q-icon
            name="discount"
            color="warning"
            class="ml-2 lg:ml-5 text-lg lg:text-4xl"
          />
        </p>
      </div>
      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="cyan"
        navigation
        padding
        arrows
        class="h-80 lg:h-[45rem]"
      >
        <q-carousel-slide :name="1" class="column no-wrap">
          <div
            class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
          >
            <q-img
              class="rounded-borders col-6 full-height"
              :src="promoImg[1]"
            />
            <q-img
              class="rounded-borders col-6 full-height"
              :src="promoImg[0]"
            />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="2" class="column no-wrap">
          <div
            class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
          >
            <q-img
              class="rounded-borders col-6 full-height"
              :src="promoImg[2]"
            />
            <q-img
              class="rounded-borders col-6 full-height"
              :src="promoImg[3]"
            />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="3" class="column no-wrap">
          <div
            class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
          >
            <q-img
              class="rounded-borders col-6 full-height"
              :src="promoImg[4]"
            />
            <q-img
              class="rounded-borders col-6 full-height"
              :src="promoImg[5]"
            />
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="4" class="column no-wrap">
          <div
            class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
          >
            <q-img
              class="rounded-borders col-6 full-height"
              src="https://cdn.quasar.dev/img/material.png"
            />
            <q-img
              class="rounded-borders col-6 full-height"
              src="https://cdn.quasar.dev/img/donuts.png"
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- Product Section -->
    <div ref="productsSection" class="container py-12">
      <h2 class="text-3xl font-bold mb-6 text-center">Popular Products</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-8">
        <ProductCard
          v-for="(product, index) in products"
          :key="index"
          :name="product.name"
          :description="product.copywriting"
          :price="product.price"
          :image="product.image"
        />
      </div>
    </div>

    <!-- parallax -->
    <div class="mx-auto w-4/6 rounded-xl">
      <div class="q-pa-md q-gutter-md">
        <div class="row justify-between">
          <q-parallax src="https://cdn.quasar.dev/img/parallax2.jpg">
            <h1 class="text-white text-4xl">TixPlaza</h1>
          </q-parallax>
        </div>
      </div>
    </div>

    <!-- -->
    <div
      class="q-gutter-md q-pa-md q-mt-md row items-center justify-center mb-10"
    >
      <div class="col-12 col-md-8 flex justify-start">
        <q-img
          :src="promoReason"
          alt="Image"
          style="width: 250px; height: auto"
        />
      </div>
      <div class="col-12 col-md-8">
        <h3 class="text-h4 md:text-5xl q-mb-lg">Mengapa harus di TixPlaza</h3>
        <div class="q-mb-lg md:text-2xl">
          <strong>Kemudahan Membeli Tiket Event Terlengkap</strong><br />
          Nikmati kemudahan membeli tiket berbagai acara seperti konser,
          seminar, stand-up show, dan event lainnya dalam satu platform. Dengan
          antarmuka yang ramah pengguna, proses pemesanan tiket menjadi cepat
          dan praktis. Hanya dengan beberapa klik, tiket untuk acara favorit
          Anda sudah ada di tangan!
        </div>
        <div class="q-mb-lg md:text-2xl">
          <strong>Beragam Pilihan Acara Eksklusif</strong><br />
          Platform kami menyediakan pilihan acara yang lengkap dan eksklusif,
          mulai dari konser musik terbesar hingga seminar dan stand-up show yang
          sedang trending. Kami bekerja sama dengan penyelenggara acara ternama
          sehingga Anda dapat menemukan acara terbaik dan mendapatkan akses
          lebih awal untuk tiket spesial atau presale.
        </div>
        <div class="q-mb-lg md:text-2xl">
          <strong>Fleksibilitas Pembayaran yang Mudah dan Aman</strong><br />
          Kami menawarkan berbagai metode pembayaran yang aman dan fleksibel,
          seperti transfer bank, Virtual Account (VA), kartu kredit, dan dompet
          digital. Nikmati kemudahan pembayaran dengan sistem cicilan tanpa
          bunga untuk pembelian tiket tertentu, sehingga Anda dapat merencanakan
          hiburan tanpa beban.
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
// import Header from '@/components/Header.vue';
// import Footer from '@/components/Footer.vue';
import ProductCard from "./components/ProductCard.vue";
import { useQuasar } from "quasar";

const q = useQuasar();

definePageMeta({
  layout: "landingpage",
});
const slide = ref(1);
const promoImg = ref([
  "/img/promo1.jpg",
  "/img/promo2.avif",
  "/img/promo3.png",
  "/img/promo4.avif",
  "/img/promo5.jpg",
  "/img/promo6.jpg",
]);
const promoReason = ref("/img/order-confirmed-1-29.png");
const concertImg = ref("/img/concert.jpg");
const ticketImg = ref("/img/ticket.png");
// Sample product data
const products = ref([]);
const search = ref("");

const productsSection = ref(null);

const scrollToProducts = () => {
  if (productsSection.value) {
    productsSection.value.scrollIntoView({ behavior: "smooth" });
  }
};
onMounted(() => {
  getData();
});
const getData = async () => {
  try {
    q.loading.show();

    const { data } = await $fetch("/api/tickets", {
      method: "GET",
    });
    console.log(data);
    const newData =
      data != null
        ? data.map((obj, index) => ({
            ...obj,
            no: index + 1,
            price: obj.price.toString(),
          }))
        : [];

    // paginationConfig.total = data.totalElements;
    // dataTable.value = newData;
    console.log(newData);
    products.value = newData;
  } catch (error) {
    console.log(error);
  } finally {
    q.loading.hide();
  }
};
</script>

<style scoped>
.container {
  @apply max-w-screen-2xl mx-auto;
}
</style>
