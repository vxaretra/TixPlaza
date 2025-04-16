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
          class="text-cyan-950 text-3xl sm:text-4xl font-semibold mb-6 text-center lg:text-left"
        >
          Welcome
        </h2>
        <form @submit.prevent="login" class="space-y-2 sm:space-y-3">
          <q-input
            type="text"
            v-model="loginForm.email"
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
          <div>
            <NuxtLink
              :to="{ name: 'auth-register' }"
              class="flex justify-end text-sm text-cyan-950 focus:text-cyan-800 hover:text-cyan-800 hover:underline"
              >Lupa Password?</NuxtLink
            >
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
          </div>
          <button
            type="submit"
            class="w-full p-3 sm:p-4 rounded-full text-cyan-950 bg-cyan-600 hover:bg-cyan-700 font-medium transition-colors duration-150"
          >
            Sign In
          </button>
          <div class="flex justify-center">
            doesn't have an account?
            <NuxtLink
              :to="{ name: 'auth-register' }"
              class="ml-1 text-cyan-950 hover:text-cyan-800"
              >Register Here</NuxtLink
            >
          </div>
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
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";
const { $axios } = useNuxtApp();

const q = useQuasar();
const router = useRouter();
const config = useRuntimeConfig();
const authUser = useAuthUser();

// Reactive property to hold the current image URL
const currentImage = ref("/img/ticket.jpg"); // Default image
const isPwd = ref(true);

const loginForm = reactive({
  email: "",
  password: "",
});

const login = async () => {
  q.loading.show();
  try {
    const { data } = await $axios.post("/api/auth/login", loginForm);
    console.log("Login:", data.data);
    if (data.data?.isVerified) {
      const token = CryptoJS.AES.encrypt(
        data.data.token,
        config.public.jwtSecret
      ).toString();
      authUser.value = {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      };
      console.log(authUser);
      // Simpan token di cookie
      const tokenCookie = useCookie("token"); // key: 'token'
      tokenCookie.value = token;

      // Simpan user di cookie
      const userCookie = useCookie("auth_user");
      userCookie.value = authUser.value;

      q.notify({
        type: "positive",
        message: "Login Sukses",
        position: "top",
        timeout: 2000,
      });
      q.loading.hide();
      await navigateTo("/home");
    } else {
      q.notify({
        type: "negative",
        message: "Akun belum diverifikasi, silahkan verifikasi melalui email",
        position: "top",
        timeout: 2000,
      });
      q.loading.hide();
    }
  } catch (error) {
    console.log(error.response);
    q.notify({
      type: "negative",
      message: error.response?.data?.message || "Unknown Error",
      position: "top",
      timeout: 2000,
    });
    q.loading.hide();
  }
};
</script>

<style scoped></style>
