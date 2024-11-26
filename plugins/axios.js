// plugins/axios.js
import axios from "axios";
import { createInterceptor } from "../utils/interceptor"; // Pastikan path sudah benar

export default defineNuxtPlugin((nuxtApp) => {
  const { requestInterceptor, responseInterceptor, errorInterceptor } = createInterceptor();

  const config = useRuntimeConfig()

  console.log(config.public.baseUrl);
  
  // Instance utama untuk JSON request
  const instance = axios.create({
    baseURL: config.public.baseUrl,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // Tambahkan interceptor ke setiap instance
  instance.interceptors.request.use(requestInterceptor, errorInterceptor);
  instance.interceptors.response.use(responseInterceptor, errorInterceptor);

  // Menggunakan nuxtApp.provide untuk menyediakan instance
  nuxtApp.provide("axios", instance);
});
