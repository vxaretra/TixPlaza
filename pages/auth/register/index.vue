<template>
  <div
    class="min-h-screen flex items-center justify-center p-6 lg:p-20 bg-gradient-to-br from-cyan-500 via-cyan-700 to-cyan-800 dark:from-blue-400 dark:via-blue-600 dark:to-blue-800"
  >
    <div
      class="flex flex-col lg:flex-row w-full max-w-4xl min-h-[594px] shadow-lg rounded-lg overflow-hidden backdrop-blur-md bg-white/10"
    >
      <!-- Left Panel: Form Section -->
      <div
        class="lg:w-1/3 w-full h-56 lg:h-auto flex items-center justify-center bg-gray-800 lg:bg-transparent"
      >
        <img
          :src="currentImage"
          alt="Decorative Image"
          class="object-cover w-full h-full"
        />
      </div>

      <!-- Right Panel: Image Section -->
      <div
        class="flex flex-col justify-center p-8 sm:p-10 w-full lg:w-2/3 bg-white/10 dark:bg-gray-800 text-white"
      >
        <h2
          class="text-3xl sm:text-4xl font-semibold mb-6 text-center lg:text-left"
        >
          Create Account
        </h2>
        <form @submit.prevent="register">
          <div class="space-y-2">
            <q-input
              type="text"
              v-model="registerForm.name"
              label="Name"
              outlined
              dense
              color="black"
              class="rounded-lg"
              input-class="text-white"
              :rules="[(val) => !!val || 'Name is required']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input
              type="text"
              v-model="registerForm.phoneNumber"
              label="No. Telp"
              outlined
              dense
              color="black"
              class="rounded-lg"
              input-class="text-white"
              :rules="[
                (val) => !!val || 'Phone number is required',
                (val) =>
                  !!/^08\d{8,}$/.test(val) ||
                  'Please enter a valid phone number (start with 08 and min 10 length)',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="local_phone" />
              </template>
            </q-input>
            <q-input
              type="text"
              v-model="registerForm.email"
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
              v-model="registerForm.password"
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
            <q-input
              v-model="registerForm.repeatPassword"
              :type="isPwd2 ? 'password' : 'text'"
              label="Confirm Password"
              outlined
              dense
              color="black"
              class="rounded-lg"
              input-class="text-white"
              :rules="[
                (val) => !!val || 'Password is required',
                (val) =>
                  val.length > 6 || 'Password must be longer than 6 characters',
                (val) => val == registerForm.password || 'Password is not same',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  @click="isPwd2 = !isPwd2"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
          <button
            type="submit"
            class="w-full my-3 p-2 sm:p-3 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors duration-150"
          >
            Sign In
          </button>
          <div class="flex justify-center">
            already have an account?
            <NuxtLink
              :to="{ name: 'auth-login' }"
              class="ml-1 text-cyan-950 hover:text-cyan-800"
              >Login Here</NuxtLink
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import CryptoJS from "crypto-js";
const { $axios } = useNuxtApp();

const router = useRouter();
const q = useQuasar();

const config = useRuntimeConfig();

const currentImage = ref("/img/ticket.jpg");
const isPwd = ref(true);
const isPwd2 = ref(true);

const registerForm = reactive({
  name: "",
  phoneNumber: "",
  email: "",
  password: "",
  repeatPassword: "",
});

console.log(router.options.routes);

async function register() {
  try {
    q.loading.show();
    const response = await $axios.post("/api/auth/register", registerForm);
    console.log("Registered:", response);
    if (response.data.token) {
      console.log("registered");
      const token = CryptoJS.AES.encrypt(
        response.data.token,
        config.jwtSecret
      ).toString();
      console.log("asdasdas");
      localStorage.setItem("4c355", token);
      q.notify({
        type: "positive",
        message: "Login Sukses",
        position: "top",
        timeout: 2000,
      });

      let timer = setTimeout(async () => {
        q.loading.hide();
        timer = void 0;
        await navigateTo("/home");
      }, 2000);
    } else {
      q.notify({
        type: "negative",
        message: response.data.message,
        position: "top",
        timeout: 2000,
      });
      q.loading.hide();
    }
  } catch (error) {
    console.error("Error registering:", error);
    console.log(error.response);
    q.notify({
      type: "negative",
      message: error.response.data.message,
      position: "top",
      timeout: 2000,
    });
    q.loading.hide();
  }
}
</script>

<style scoped>
.p-password {
  width: 100%;
}
</style>
