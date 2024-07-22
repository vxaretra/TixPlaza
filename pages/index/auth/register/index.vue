<template>
  <div class="register-form">
    <div class="h-52 w-1/2 mx-auto mt-5">
      <Splitter>
        <SplitterPanel class="" :size="65">
          <h2 class="text-5xl">Register</h2>
          <div class="w-1/2 mx-auto space-y-10">
            <FloatLabel>
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="value"
                  inputId="ac"
                  :suggestions="items"
                  @complete="search"
                  :style="{ width: '400px' }"
                />
                <label for="ac">Float Label</label>
              </IconField>
            </FloatLabel>
            <FloatLabel>
              <InputText
                v-model="value"
                inputId="ac"
                :suggestions="items"
                @complete="search"
                :style="{ width: '400px' }"
              />
              <label for="ac">Float Label</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                v-model="value"
                inputId="ac"
                :suggestions="items"
                @complete="search"
                :style="{ width: '400px' }"
              />
              <label for="ac">Float Label</label>
            </FloatLabel>
            <FloatLabel>
              <InputText
                v-model="value"
                inputId="ac"
                :suggestions="items"
                @complete="search"
                :style="{ width: '400px' }"
              />
              <label for="ac">Float Label</label>
            </FloatLabel>
            <button @click="register">test</button>
          </div>
        </SplitterPanel>
        <SplitterPanel class="flex items-center justify-center" :size="35">
          <Image src="/img/ticket.jpg" alt="Image" />
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      items: [],
    };
  },
  methods: {
    search(event) {
      this.items = [...Array(10).keys()].map(
        (item) => event.query + "-" + item
      );
    },
    async register() {
      const { email } = await useFetch("/api/auth/register", {
        method: "post",
        body: {
          email: "test@admin.com",
          password: "test",
          name: "dasdas",
          phoneNumber: "0192312321321",
        },
      });
      console.log(email);
    },
  },
};
</script>

<style scoped></style>
