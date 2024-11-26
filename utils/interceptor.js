import CryptoJS from "crypto-js";

// utils/interceptor.js
export function createInterceptor() {
  const secretKey = useRuntimeConfig().public.jwtSecret;
  
  const requestInterceptor = (config) => {
    // Tambahkan logika di sini, seperti menambahkan Authorization header
    const token = localStorage.getItem("4c355");
    if (token) {
      console.log(token);
      const decryptToken = CryptoJS.AES.decrypt(token, secretKey).toString(CryptoJS.enc.Utf8);
      config.headers["Authorization"] = `Bearer ${decryptToken}`;
    }
    return config;
  };

  const responseInterceptor = (response) => {
    return response;
  };

  const errorInterceptor = (error) => {
    // Tangani error di sini
    if (error.response && error.response.status === 401) {
      // Misalnya, redirect ke halaman login jika token kadaluarsa
    }
    return Promise.reject(error);
  };

  return { requestInterceptor, responseInterceptor, errorInterceptor };
}
