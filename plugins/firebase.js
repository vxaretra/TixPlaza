// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin(nuxtApp => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBScRxSziM-A4V0qvVPv_C4mmtaJRGl4Ds",
    authDomain: "tixplaza-c26ae.firebaseapp.com",
    projectId: "tixplaza-c26ae",
    storageBucket: "tixplaza-c26ae.appspot.com",
    messagingSenderId: "773097445172",
    appId: "1:773097445172:web:1f35b97fdf73167412f761"
  };

// Initialize Firebase
  const app = initializeApp(firebaseConfig);

  
  const storage = getStorage(app);

  nuxtApp.provide('storage', storage);  // Menggunakan $storage di dalam komponen
});
