<template>
  <div class="h-screen bg-slate-100">
    <div class="flex items-center justify-center h-screen">
      <Splitter
        gutterSize="0"
        class="shadow-2xl shadow-blue-500/50 w-1/2 min-h-[600px]"
      >
        <SplitterPanel class="bg-white rounded-l-md" :size="65">
          <form @submit.prevent="register">
            <div class="flex flex-col justify-center items-center mt-8 mb-10">
              <h3 class="text-3xl text-amber-400">Create Account</h3>
              <p class="text-xs text-amber-200">
                Please complete to create your account
              </p>
            </div>
            <div class="w-1/2 mx-auto space-y-8">
              <div>
                <FloatLabel class="!text-md">
                  <InputText
                    v-model="registerForm.name"
                    inputId="name"
                    class="w-full !bg-white !text-black"
                    :invalid="errors.name != ''"
                  />
                  <label for="name">Nama Lengkap</label>
                </FloatLabel>
                <p v-if="errors.name" class="text-xs text-red-600">
                  {{ errors.name }}
                </p>
              </div>
              <div>
                <FloatLabel>
                  <InputText
                    v-model="registerForm.telp"
                    inputId="telp"
                    class="w-full !bg-white !text-black"
                    :invalid="errors.telp != ''"
                  />
                  <label for="telp">No. telpon</label>
                </FloatLabel>
                <p
                  v-if="errors.telp"
                  severity="error"
                  class="text-xs text-red-600"
                >
                  {{ errors.telp }}
                </p>
              </div>
              <div>
                <FloatLabel>
                  <InputText
                    v-model="registerForm.email"
                    inputId="email"
                    class="w-full !bg-white !text-black"
                    :invalid="errors.email != ''"
                  />
                  <label for="email">Email</label>
                </FloatLabel>
                <p
                  v-if="errors.email"
                  severity="error"
                  class="text-xs text-red-600"
                >
                  {{ errors.email }}
                </p>
              </div>
              <div>
                <FloatLabel>
                  <Password
                    v-model="registerForm.password"
                    inputId="password"
                    inputClass="w-full !bg-white !text-black"
                    toggleMask
                    fluid
                    :invalid="errors.password != ''"
                  />
                  <label for="password">Password</label>
                </FloatLabel>
                <p
                  v-if="errors.password"
                  severity="error"
                  class="text-xs text-red-600"
                >
                  {{ errors.password }}
                </p>
              </div>
            </div>
            <div class="w-1/2 mx-auto my-8">
              <Button
                type="submit"
                label="Register"
                severity="info"
                raised
                class="w-full"
              />
            </div>
          </form>
        </SplitterPanel>
        <SplitterPanel
          class="flex items-center justify-center rounded-r-md"
          :size="35"
        >
          <img
            src="/img/ticket.jpg"
            alt="Image"
            style="width: 100%; height: 100%; object-fit: cover"
          />
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const registerForm = ref({
  name: "",
  telp: "",
  email: "",
  password: "",
});

const errors = ref({
  name: "",
  telp: "",
  email: "",
  password: "",
});

function validateForm() {
  let isValid = true;
  errors.value = {
    name: "",
    telp: "",
    email: "",
    password: "",
  };

  if (!registerForm.value.name.trim()) {
    errors.value.name = "Nama wajib diisi.";
    isValid = false;
  }

  if (!registerForm.value.telp.trim()) {
    errors.value.telp = "No. telpon wajib diisi.";
    isValid = false;
  } else if (!/^08\d{8,}$/.test(registerForm.value.telp)) {
    errors.value.telp = "No. telpon harus diawali 08 dan minimal 10 digit.";
    isValid = false;
  }

  if (!registerForm.value.email.trim()) {
    errors.value.email = "Email wajib diisi.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(registerForm.value.email)) {
    errors.value.email = "Alamat email harus merupakan email asli.";
    isValid = false;
  }

  if (!registerForm.value.password.trim()) {
    errors.value.password = "Password wajib diisi.";
    isValid = false;
  } else if (registerForm.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters.";
    isValid = false;
  }

  return isValid;
}

async function register() {
  if (!validateForm()) {
    return;
  }
  try {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        email: registerForm.value.email,
        password: registerForm.value.password,
        name: registerForm.value.name,
        phoneNumber: registerForm.value.telp,
      },
    });
    console.log("Registered:", response);
  } catch (error) {
    console.error("Error registering:", error);
  }
}
</script>

<style scoped>
.imgSide {
  width: 100% !important;
  height: 100% !important;
}

.p-splitter {
  border-width: 0px;
}

.p-floatlabel label {
  color: rgb(0, 0, 0) !important;
  font-weight: 700;
}

.p-password-input {
  background-color: rgb(255 255 255 / var(--tw-bg-opacity)) !important;
}
</style>
