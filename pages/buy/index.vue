<template>
  <div
    class="q-gutter-md q-pa-lg bg-gray-50 min-h-screen flex justify-center items-center"
  >
    <div
      class="bg-white shadow-lg rounded-lg max-w-4xl w-full p-6 flex flex-col md:flex-row items-center md:items-start"
    >
      <!-- Product Image Section -->
      <div class="md:w-1/2 flex justify-center p-4">
        <q-img
          :src="productImage"
          alt="Product Image"
          class="rounded-lg shadow-md"
          style="max-width: 300px; height: auto"
        />
      </div>

      <!-- Product Details Section -->
      <div class="md:w-1/2 p-4">
        <h2 class="text-2xl font-semibold mb-2">{{ productName }}</h2>
        <p class="text-gray-700 mb-4">{{ productDescription }}</p>
        <div class="text-xl font-bold text-blue-600 mb-4">
          {{ productPrice }}
        </div>

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
  </div>
</template>

<script setup>
import { ref } from "vue";

const productName = "Concert Ticket";
const productDescription =
  "Experience the thrill of live music with our exclusive concert tickets.";
const productPrice = "$99.99";
const productImage = "https://via.placeholder.com/300"; // Replace with your product image URL
const quantity = ref(1);

function handlePurchase() {
  alert(`You have purchased ${quantity.value} ticket(s)!`);
}
</script>

<style scoped>
/* Add any additional custom styles here if necessary */
</style>
