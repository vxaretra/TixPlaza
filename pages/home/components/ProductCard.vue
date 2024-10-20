<template>
  <div class="q-pa-md row items-start">
    <q-card
      class="w-full max-w-xs cursor-pointer hover:shadow-xl"
      flat
      bordered
    >
      <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />
      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ name }}</div>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <q-icon name="place" />
            250 ft
          </div>
        </div>

        <q-rating v-model="stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">$・Italian, Cafe</div>
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
    <q-dialog v-model="showDialog" persistent>
      <div
        class="bg-white shadow-lg rounded-lg max-w-4xl w-full p-6 flex flex-col md:flex-row items-center md:items-start"
      >
        <!-- Product Image Section -->
        <div class="md:w-1/2 flex justify-center p-4">
          <q-img
            src="https://cdn.quasar.dev/img/chicken-salad.jpg"
            alt="Product Image"
            class="rounded-lg shadow-md"
            style="max-width: 300px; height: auto"
          />
        </div>

        <!-- Product Details Section -->
        <div class="md:w-1/2 p-4">
          <h2 class="text-2xl font-semibold mb-2">{{ name }}</h2>
          <p class="text-gray-700 mb-4">{{ description }}</p>
          <div class="text-xl font-bold text-blue-600 mb-4">Rp.100.000.00</div>

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
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const showDialog = ref(false);

const addToCart = () => {
  console.log(`Adding ${props.name} to cart`);
};
</script>
