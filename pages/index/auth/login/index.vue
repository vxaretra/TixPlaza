<template>
  <div class="register-form">
    <h2 class="text-5xl">Register</h2>
    <div class="h-52 w-1/2 mx-auto">
      <Splitter>
        <SplitterPanel
          class="flex items-center justify-center"
          :size="30"
          :minSize="30"
        >
          <Image src="/img/ticket.jpg" alt="Image" />
        </SplitterPanel>
        <SplitterPanel class="flex items-center justify-center" :size="70">
          <FloatLabel>
            <AutoComplete
              v-model="value"
              inputId="ac"
              :suggestions="items"
              @complete="search"
            />
            <label for="ac">Float Label</label>
          </FloatLabel>
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
  },
};
</script>

<style scoped></style>
