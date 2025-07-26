<script setup>
const { loggedIn, user } = useUserSession();
if (loggedIn.value === false) {
    await navigateTo("/auth/login", { replace: true });
}

if (user.value.isVerified === true) {
    await navigateTo("/home", { replace: true });
}

const q = useQuasar();
const code = ref("");

const onSubmit = async () => {
    q.loading.show();
    try {
        await $fetch("/api/auth/verify", { method: "POST", body: { code: code.value } });
    } catch (error) {
        q.notify({
            type: "negative",
            message: error.data.message,
            position: "top",
            timeout: 2000,
        });
    } finally {
        q.loading.hide();
    }
}
</script>

<template>
    <div class="q-pa-md">
        <p>Enter your verification code</p>
        <q-form class="q-gutter-md" @submit="onSubmit">
            <q-input filled v-model="code" label="Code" :rules="[(val) => val.length > 0 || 'Code is required']">
            </q-input>
            <q-btn label="Submit" type="submit"></q-btn>
        </q-form>
    </div>
</template>
