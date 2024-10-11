<template>
  <div
    class="min-h-screen flex items-center justify-center p-6 lg:p-20 bg-gradient-to-br from-cyan-500 via-cyan-700 to-cyan-800 dark:from-blue-400 dark:via-blue-600 dark:to-blue-800"
  >
    <div
      class="flex flex-col lg:flex-row w-full max-w-4xl shadow-lg rounded-lg overflow-hidden backdrop-blur-md bg-white/10"
    >
      <!-- Left Panel: Form Section -->
      <div
        class="flex flex-col justify-center p-8 sm:p-10 w-full lg:w-2/3 bg-white/10 dark:bg-gray-800 text-white"
      >
        <h2
          class="text-3xl sm:text-4xl font-semibold mb-6 text-center lg:text-left"
        >
          Welcome
        </h2>
        <form @submit.prevent="login" class="space-y-2 sm:space-y-3">
          <Toast />
          <q-input
            v-model="loginForm.email"
            type="text"
            label="Email"
            outlined
            dense
            color="black"
            class="rounded-lg"
            input-class="text-white"
            :rules="[
              (val) => !!val || 'Email is required',
              (val) =>
                /\S+@\S+\.\S+/.test(val) ||
                'Please enter a valid email address',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>
          <q-input
            v-model="loginForm.password"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            outlined
            dense
            color="black"
            class="rounded-lg"
            input-class="text-white"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) =>
                val.length > 6 || 'Password must be longer than 6 characters',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                @click="isPwd = !isPwd"
                class="cursor-pointer"
              />
            </template>
          </q-input>
          <button
            type="submit"
            class="w-full p-3 sm:p-4 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors duration-150"
          >
            Sign In
          </button>
          <a
            href="#"
            class="block text-center text-cyan-300 hover:text-cyan-400"
            >Forgot Password?</a
          >
        </form>
      </div>

      <!-- Right Panel: Image Section -->
      <div
        class="lg:w-1/3 w-full h-56 lg:h-auto flex items-center justify-center bg-gray-800 lg:bg-transparent"
      >
        <img
          :src="currentImage"
          alt="Decorative Image"
          class="object-cover w-full h-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";

const q = useQuasar();

// Reactive property to hold the current image URL
const currentImage = ref("/img/ticket.jpg"); // Default image
const isPwd = ref(true);

const loginForm = ref({
  email: "",
  password: "",
});

async function login() {
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: loginForm.value.email,
        password: loginForm.value.password,
      },
    });
    console.log("Login:", response);
    if (response.data.isVerified == true) {
      const token = CryptoJS.AES.encrypt(
        response.data.isVerified,
        secretKey
      ).toString();
      localStorage.setItem("4c355", token);
      router.replace({ name: "dashboard" });
    } else {
      q.notify({
        type: "negative",
        message: response.data.message,
        position: "top",
        timeout: 2000,
      });
    }
  } catch (error) {
    console.log(error.response);
    q.notify({
      type: "negative",
      message: error.response._data.message,
      position: "top",
      timeout: 2000,
    });
  }
}
</script>

<style scoped></style>
