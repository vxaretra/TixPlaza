<template>
  <div class="q-pa-md row items-start">
    <q-card
      class="w-full max-w-xs cursor-pointer hover:shadow-xl"
      flat
      bordered
    >
      <q-img :src="singerImg" />
      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)"
          @click="showMapDialog = true"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ name }}</div>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <q-icon name="place" class="cursor-pointer text-blue-600" />
            250 ft
          </div>
        </div>

        <q-rating v-model="stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">Rp.・{{ price }}</div>
        <div class="text-caption text-grey">
          {{ description }}
        </div>
      </q-card-section>
      <q-separator />

      <q-card-actions align="right">
        <q-btn flat round icon="favorite_border" />
        <q-btn flat color="primary" label="buy" @click="showDialog = true">
        </q-btn>
      </q-card-actions>
    </q-card>

    <!-- Product Purchase Dialog -->
    <q-dialog v-model="showDialog">
      <div
        class="bg-white shadow-lg rounded-lg max-w-4xl w-full p-6 flex flex-col md:flex-row items-center md:items-start"
      >
        <!-- Product Image Section -->
        <div class="md:w-1/2 flex justify-center p-4">
          <q-img
            :src="singerImg"
            alt="Product Image"
            class="rounded-lg shadow-md"
            style="max-width: 300px; height: auto"
          />
        </div>

        <!-- Product Details Section -->
        <div class="md:w-1/2 p-4">
          <h2 class="text-2xl font-semibold mb-2">{{ name }}</h2>
          <p class="text-gray-700 mb-4">{{ description }}</p>
          <div class="text-xl font-bold text-blue-600 mb-4">{{ price }}</div>

          <!-- Quantity Selector -->
          <div class="flex items-center mb-4">
            <label for="quantity" class="mr-2 font-medium">Quantity:</label>
            <q-input
              v-model="quantity"
              type="number"
              min="1"
              class="w-20"
              outlined
              dense
            />
          </div>

          <!-- Purchase Button -->
          <q-btn
            label="Buy Now"
            color="primary"
            class="w-full md:w-auto"
            @click="handlePurchase"
          />
        </div>
      </div>
    </q-dialog>

    <!-- Map Dialog -->
    <q-dialog v-model="showMapDialog" persistent>
      <q-card style="max-width: 800px; width: 90vw; height: 600px">
        <q-card-section class="bg-blue-600 text-white text-center py-2">
          <div class="text-h6 font-bold">Map Location</div>
        </q-card-section>

        <q-card-section class="q-pa-none" style="height: 500px">
          <LMap
            ref="map"
            :zoom="zoom"
            :center="[-6.905977, 107.613144]"
            style="width: 100%; height: 100%"
          >
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              layer-type="base"
              name="OpenStreetMap"
            />
            <LMarker :lat-lng="[-6.905977, 107.613144]"> </LMarker>
          </LMap>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
// import L from "leaflet";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
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

const showDialog = ref(false);
const singerImg = ref("/img/singer.avif");

onMounted(() => {
  formatRupiahInput();
});

// const

function formatRupiahInput() {
  let value = props.price;
  console.log(value);
  let number_string = value.replace(/[^,\d]/g, "").toString();
  let split = number_string.split(",");
  let sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  props.price = rupiah; // Update the value without adding "Rp." to avoid duplication
  console.log(rupiah);
  console.log(props.price);
}

const addToCart = () => {
  console.log(`Adding ${props.name} to cart`);
};

const showMapDialog = ref(false);
const zoom = ref(6);
</script>
