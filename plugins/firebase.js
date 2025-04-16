// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig();

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: config.public.firebaseKey,
        authDomain: config.public.firebaseDomain,
        projectId: config.public.firebaseProjectid,
        storageBucket: config.public.firebaseStorageBucket,
        messagingSenderId: config.public.firebaseMessagingSenderid,
        appId: config.public.firebaseAppid,
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const storage = getStorage(app);

    nuxtApp.provide('storage', storage);  // Menggunakan $storage di dalam komponen
});
