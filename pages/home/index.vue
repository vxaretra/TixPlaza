<template>
  <q-layout>
    <!-- Banner -->
    <div
      class="bg-cyan-600 text-white p-8 text-center h-auto md:h-[35rem] flex items-center justify-center"
    >
      <div class="w-full md:w-2/3 lg:w-1/2 space-y-3 px-4">
        <h1 class="text-2xl md:text-4xl font-bold mb-2">Welcome to TixPlaza</h1>
        <p class="text-base md:text-lg lg:text-xl">
          Discover the best products with amazing deals
        </p>
        <div class="flex justify-center">
          <q-input
            outlined
            v-model="search"
            label="Cari Tiket"
            rounded
            bg-color="white"
            class="w-full sm:w-3/4 md:w-1/2"
          >
            <template v-slot:append>
              <q-icon
                v-if="search !== ''"
                name="close"
                @click="search = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="pt-5 flex flex-wrap justify-center">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <q-btn
              push
              color="white"
              text-color="primary"
              label="Konser"
              class="w-28 sm:w-32"
            >
              <q-badge color="orange" floating>57</q-badge>
            </q-btn>
            <q-btn
              push
              color="white"
              text-color="primary"
              label="Stand Up"
              class="w-28 sm:w-32"
            >
              <q-badge color="orange" floating>11</q-badge>
            </q-btn>
            <q-btn
              push
              color="white"
              text-color="primary"
              label="Seminar"
              class="w-28 sm:w-32"
            >
              <q-badge color="orange" floating>21</q-badge>
            </q-btn>
            <q-btn
              push
              color="white"
              text-color="primary"
              label="Event"
              class="w-28 sm:w-32"
            >
              <q-badge color="orange" floating>32</q-badge>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel -->
    <div class="q-pa-md w-full max-w-7xl mx-auto mt-4">
      <div
        class="text-center lg:text-left text-xl lg:text-2xl font-bold text-gray-900 mb-4"
      >
        <p>Penawaran menarik hanya untuk anda,</p>
        <p>
          jangan sampai kelewatan!
          <q-icon name="discount" color="warning" class="ml-2 text-xl" />
        </p>
      </div>

      <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        navigation
        arrows
        height="415px"
        class="bg-grey-1 rounded-xl shadow-md"
        control-color="primary"
      >
        <q-carousel-slide :name="1" class="q-pa-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <q-img class="rounded-lg w-full" fit="contain" :src="promoImg[0]" />
            <q-img class="rounded-lg w-full" fit="contain" :src="promoImg[1]" />
          </div>
        </q-carousel-slide>

        <q-carousel-slide :name="2" class="q-pa-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <q-img class="rounded-lg w-full" fit="contain" :src="promoImg[2]" />
            <q-img class="rounded-lg w-full" fit="contain" :src="promoImg[3]" />
          </div>
        </q-carousel-slide>

        <q-carousel-slide :name="3" class="q-pa-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <q-img class="rounded-lg w-full" fit="contain" :src="promoImg[4]" />
            <q-img class="rounded-lg w-full" fit="contain" :src="promoImg[5]" />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- Products Section -->
    <div ref="productsSection" class="container py-12">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center">
        Popular Products
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

    <!-- Parallax Section -->
    <div class="mx-auto w-11/12 md:w-4/6 rounded-xl overflow-hidden">
      <div class="q-pa-none">
        <q-parallax
          src="https://cdn.quasar.dev/img/parallax2.jpg"
          height="300"
          class="rounded-xl"
        >
          <div
            class="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <h1
              class="text-white text-3xl sm:text-4xl lg:text-5xl font-bold drop-shadow-md"
            >
              TixPlaza
            </h1>
          </div>
        </q-parallax>
      </div>
    </div>

    <!-- "Why Us" Section -->
    <div
      class="q-gutter-md q-pa-md q-mt-md row items-center justify-center mb-10"
    >
      <div class="col-12 md:col-6 flex justify-center">
        <q-img
          :src="promoReason"
          alt="Image"
          class="w-40 sm:w-60 md:w-80 lg:w-96"
        />
      </div>
      <div class="col-12 md:col-6 px-4">
        <h3 class="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
          Mengapa harus di TixPlaza
        </h3>
        <div class="text-base md:text-lg lg:text-xl space-y-4">
          <div>
            <strong>Kemudahan Membeli Tiket Event Terlengkap</strong>
            <p>
              Nikmati kemudahan membeli tiket berbagai acara seperti konser,
              seminar, stand-up show, dan event lainnya dalam satu platform.
            </p>
          </div>
          <div>
            <strong>Beragam Pilihan Acara Eksklusif</strong>
            <p>
              Platform kami menyediakan pilihan acara yang lengkap dan
              eksklusif, mulai dari konser musik terbesar hingga seminar dan
              stand-up show.
            </p>
          </div>
          <div>
            <strong>Fleksibilitas Pembayaran</strong>
            <p>
              Kami menawarkan berbagai metode pembayaran yang aman dan
              fleksibel, seperti transfer bank, Virtual Account, dan dompet
              digital.
            </p>
          </div>
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
const { $axios } = useNuxtApp();

const q = useQuasar();

definePageMeta({
  layout: "landingpage",
  roles: ["USER"],
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

    const { data } = await $axios.get("/api/tickets");
    console.log(data);
    const newData =
      data != null
        ? data.data.map((obj, index) => ({
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
