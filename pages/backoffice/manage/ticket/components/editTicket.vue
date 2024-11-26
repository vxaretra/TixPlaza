<template>
  <div class="p-5 text-slate-950">
    <q-card bordered>
      <q-card-section>
        <div class="text-h6">Edit Tiket {{ idTicket }}</div>
        <div class="text-subtitle2">Lengkapi informasi tentang tiket anda</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <div class="flex justify-center pb-8 py-4">
          <q-form class="space-y-4">
            <div class="w-96">
              <div class="text-subtitle1">Pilih Foto</div>
              <q-file
                dense
                outlined
                @update:model-value="updateFiles"
                :model-value="files"
                label="Image"
                multiple
                append
                counter
                :counter-label="counterLabelFn"
                :max-files="maxFiles"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>

                <template v-slot:file="{ index, file }">
                  <div class="w-full grid grid-cols-6 gap-1">
                    <q-chip class="col-span-5 w-full q-my-xs" square>
                      <q-linear-progress
                        class="absolute-full full-height"
                        :value="uploadProgress[index].percent"
                        :color="uploadProgress[index].color"
                        track-color="grey-2"
                      />

                      <q-avatar>
                        <q-icon :name="uploadProgress[index].icon" />
                      </q-avatar>

                      <div class="ellipsis relative-position w-full">
                        {{ file.name }}
                      </div>

                      <q-tooltip>
                        {{ file.name }}
                      </q-tooltip>
                    </q-chip>
                    <div
                      class="space-x-1 items-center text-center q-my-xs content-center"
                    >
                      <q-btn
                        v-if="played[index]"
                        dense
                        round
                        color="warning"
                        icon="stop"
                        size="xs"
                        :disable="uploadProgress[index].percent == 1"
                        class="items-center text-center"
                        @click.stop.prevent="pauseUpload(index)"
                      />
                      <q-btn
                        v-else
                        dense
                        round
                        color="secondary"
                        icon="play_arrow"
                        size="xs"
                        :disable="uploadProgress[index].percent == 1"
                        class="items-center text-center"
                        @click.stop.prevent="resumeUpload(index)"
                      />
                      <q-btn
                        dense
                        round
                        color="red"
                        icon="delete"
                        size="xs"
                        :disable="uploadProgress[index].percent == 1"
                        class="items-center text-center"
                        @click.stop.prevent="cancelUpload(index)"
                      />
                    </div>
                  </div>
                </template>

                <template v-slot:after>
                  <q-btn
                    color="cyan"
                    dense
                    icon="cloud_upload"
                    round
                    :loading="isUploading"
                    @click="upload"
                  />
                </template>
              </q-file>

              <!-- Responsif Carousel -->
              <div v-if="formEditTicket.image.length > 0" class="mt-4">
                <h3 class="mb-0 pb-0">Photo Preview:</h3>
                <q-carousel
                  v-model="slide"
                  control-type="push"
                  control-color="purple"
                  swipeable
                  animated
                  arrows
                  navigation
                  infinite
                  class="mt-0 pb-0"
                >
                  <q-carousel-slide
                    v-for="(image, index) in formEditTicket.image"
                    :key="index"
                    :name="index"
                    class="relative w-full pb-0"
                  >
                    <q-img
                      :src="image"
                      alt="carousel-image"
                      class="absolute inset-0 w-full h-full object-cover"
                      fit="contain"
                    />
                  </q-carousel-slide>
                </q-carousel>
              </div>
            </div>
            <div class="w-96">
              <div class="text-subtitle1">Nama Tiket</div>
              <q-input
                dense
                outlined
                v-model="formEditTicket.name"
                label="Nama Tiket"
              />
            </div>
            <div class="w-96">
              <div class="text-subtitle1">Deskripsi Tiket</div>
              <q-input
                dense
                v-model="formEditTicket.description"
                outlined
                autogrow
                label="Deskripsi Tiket"
              />
            </div>
            <div class="w-96">
              <div class="flex justify-between">
                <div class="w-2/4">
                  <div class="text-subtitle1">Harga</div>
                  <q-input
                    dense
                    outlined
                    v-model="formEditTicket.price"
                    label="Harga"
                    @update:model-value="formatRupiahInput"
                  >
                    <template v-slot:prepend>
                      <p>Rp.</p>
                    </template>
                  </q-input>
                </div>
                <div class="w-1/3">
                  <div class="text-subtitle1">Stok</div>
                  <q-input
                    dense
                    outlined
                    type="number"
                    v-model="formEditTicket.quota"
                    label="Stok"
                  />
                </div>
              </div>
            </div>
            <div class="w-96">
              <div class="text-subtitle1">Pilih Tanggal</div>
              <div class="flex justify-between">
                <div>
                  <q-btn
                    label="Tanggal Mulai"
                    icon="event"
                    color="cyan"
                    class="mr-5"
                  >
                    <q-popup-proxy
                      @before-show="updateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="startDate"
                        mask="YYYY-MM-DD"
                        color="cyan"
                      />
                      <q-time v-model="startTime" mask="HH:mm" color="cyan">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn
                            label="Cancel"
                            color="primary"
                            flat
                            v-close-popup
                          />
                          <q-btn
                            label="OK"
                            color="primary"
                            flat
                            @click="save()"
                            v-close-popup
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-btn>
                  <p class="mt-1">{{ formEditTicket.startDate }}</p>
                </div>
                <div>
                  <q-btn label="Tanggal Akhir" icon="event" color="cyan">
                    <q-popup-proxy
                      @before-show="updateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="endDate"
                        mask="YYYY-MM-DD"
                        color="cyan"
                        today-btn
                      />
                      <q-time v-model="endTime" mask="HH:mm" color="cyan">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn
                            label="Cancel"
                            color="primary"
                            flat
                            v-close-popup
                          />
                          <q-btn
                            label="OK"
                            color="primary"
                            flat
                            @click="save(false)"
                            v-close-popup
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-btn>
                  <p class="mt-1">{{ formEditTicket.endDate }}</p>
                </div>
              </div>
            </div>
            {{ statusDialog }}
            <div class="w-full pt-3">
              <q-btn
                color="secondary"
                icon="save_alt"
                label="Edit Tiket"
                class="w-full"
                @click="editTicket"
              />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, reactive, defineProps, defineEmits } from "vue";
import { useNuxtApp } from "#app";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
const { $axios, $dayjs } = useNuxtApp();

const q = useQuasar();
const nuxtApp = useNuxtApp();
const slide = ref(0);

const props = defineProps({
  statusDialog: {
    type: Boolean,
    required: true,
  },
  idTicket: {
    type: String,
    required: true,
  },
});

const played = ref([true, true, true, true]);
const emit = defineEmits(["updateStatusDialog"]);
const maxFiles = ref(4);

const counterLabelFn = ({ totalSize, filesNumber, maxFiles }) => {
  return `${filesNumber} files of ${maxFiles} | ${totalSize}`;
};

const uploadProgress = ref([]);
const files = ref(null);
const isUploading = ref(false);

// Upload properties
const uploadTasks = ref([]);

function updateFiles(newFiles) {
  played.value = [true, true, true, true];
  console.log(newFiles);
  files.value = newFiles;
  console.log(files.value);

  uploadProgress.value = (newFiles || []).map((file) => ({
    error: false,
    color: "green-2",
    percent: 0,
    icon:
      file.type.indexOf("video/") === 0
        ? "movie"
        : file.type.indexOf("image/") === 0
        ? "photo"
        : file.type.indexOf("audio/") === 0
        ? "audiotrack"
        : "insert_drive_file",
  }));
}

function upload() {
  const allPromises = []; // Array to store all upload promises
  isUploading.value = true;

  for (let i = 0; i < files.value.length; i++) {
    const file = files.value[i];
    const storageref = storageRef(nuxtApp.$storage, `uploads/${file.name}`);

    // Mulai upload file
    const uploadTask = uploadBytesResumable(storageref, file);
    uploadTasks.value[i] = uploadTask;

    // Listen for state changes, errors, and completion of the upload.
    const uploadPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          // Update uploadProgress for the current file
          uploadProgress.value[i].percent = progress / 100; // Update percent di uploadProgress
          console.log(uploadProgress.value[i].percent);
          console.log(typeof uploadProgress.value[i].percent);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle errors and reject promise
          uploadProgress.value[i].error = true; // Set error to true
          console.error("Upload error:", error); // Debugging error log

          switch (error.code) {
            case "storage/unauthorized":
              console.log("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              console.log("User canceled the upload");
              reject("Upload canceled");
              break;
            case "storage/unknown":
              console.log("Unknown error occurred");
              reject("Unknown error");
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log("File available at", downloadURL);
              formEditTicket.image.push(downloadURL);

              // Update upload progress to complete for this file
              uploadProgress.value[i].percent = 1; // Set to 100%
              resolve(downloadURL); // Resolve when upload is successful
            })
            .catch((error) => {
              // Handle error in getting download URL
              console.error("Error getting download URL", error);
              reject(error); // Reject the promise if there's an error
            });
        }
      );
    });
    allPromises.push(uploadPromise); // Add each upload promise to array
  }

  console.log("Upload promises:", allPromises);

  // Run this function after all uploads are complete or canceled
  Promise.allSettled(allPromises)
    .then((results) => {
      isUploading.value = false;
      files.value = null;
      maxFiles.value = 4 - formEditTicket.image.length;
      console.log("All promises settled:", results); // Debug: Log all results

      const allSuccess = results.every(
        (result) => result.status === "fulfilled"
      );
      const allFailed = results.every((result) => result.status === "rejected");

      console.log("allSuccess:", allSuccess); // Debug: Check if allSuccess is true
      console.log("allFailed:", allFailed); // Debug: Check if allFailed is true

      if (allSuccess) {
        console.log("All files uploaded successfully");
        // onAllUploadsComplete(); // Run this when all uploads are successful
      } else if (allFailed) {
        console.log("All uploads canceled or failed");
        // onAllUploadsCanceled(); // Run this when all uploads are canceled
      } else {
        console.log("Some uploads were successful, some failed");
        // onPartialUploadsComplete(); // Handle partial success/failure
      }
    })
    .catch((error) => {
      isUploading.value = false;
      console.error("Error in Promise.allSettled:", error); // Catch any error
    });
}

// Fungsi untuk pause upload
function pauseUpload(index) {
  if (uploadTasks.value[index]) {
    uploadTasks.value[index].pause();
    uploadProgress.value[index].color = "orange";
    played.value[index] = false;
    console.log(`Upload ${index} paused`);
  }
}

// Fungsi untuk resume upload
function resumeUpload(index) {
  if (uploadTasks.value[index]) {
    uploadTasks.value[index].resume();
    uploadProgress.value[index].color = "green-2";
    played.value[index] = true;
    console.log(`Upload ${index} resumed`);
  }
}

// Fungsi untuk cancel upload
function cancelUpload(index) {
  if (uploadTasks.value[index]) {
    uploadTasks.value[index].cancel();
    uploadProgress.value[index].color = "red";
    // files.value.splice(index, 1);
    console.log(files.value);
    console.log(`Upload ${index} canceled`);
  }
}

function formatRupiahInput(input) {
  console.log(input);
  let value = input;
  let number_string = value.replace(/[^,\d]/g, "").toString();
  let split = number_string.split(",");
  let sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  formEditTicket.price = rupiah; // Update the value without adding "Rp." to avoid duplication
}

const startDate = ref("");
const startTime = ref("");
const endDate = ref("");
const endTime = ref("");

const save = (start = true) => {
  console.log(start);
  if (start == true) {
    console.log(startDate.value);
    console.log(startTime.value);
    formEditTicket.startDate = `${startDate.value} ${startTime.value}`;
  } else {
    console.log(endDate.value);
    console.log(endTime.value);
    formEditTicket.endDate = `${endDate.value} ${endTime.value}`;
  }
};

const formEditTicket = reactive({
  image: [],
  name: "",
  price: "",
  description: "",
  startDate: "",
  endDate: "",
  quota: "",
});

const getData = async () => {
  try {
    q.loading.show();

    const { data } = await $axios.get(`/api/tickets/${props.idTicket}`);
    console.log(data);
    formEditTicket.name = data.data.name;
    formEditTicket.description = data.data.copywriting;
    formEditTicket.price = data.data.price;
    formEditTicket.quota = data.data.quota;
    formEditTicket.startDate = $dayjs(data.data.start).format(
      "YYYY-MM-DD HH:mm"
    );
    formEditTicket.endDate = $dayjs(data.data.end).format("YYYY-MM-DD HH:mm");
    for (let i = 0; i < data.data.medias.length; i++) {
      formEditTicket.image.push(data.data.medias[i].url);
    }
  } catch (error) {
    console.log(error);
  } finally {
    q.loading.hide();
  }
};

const editTicket = async () => {
  console.log(formEditTicket);
  q.loading.show();
  try {
    const response = await $axios.put(`/api/tickets/${props.idTicket}`, {
      name: formEditTicket.name,
      copywriting: formEditTicket.description,
      start: formEditTicket.startDate,
      end: formEditTicket.endDate,
      price: parseInt(
        typeof formEditTicket.price === "string" &&
          formEditTicket.price.includes(".")
          ? formEditTicket.price.replace(/\./g, "")
          : formEditTicket.price
      ),
      quota: parseInt(formEditTicket.quota),
      medias: formEditTicket.image,
    });
    console.log("Put Tiket:", response);
    q.notify({
      type: "positive",
      message: "Tiket berhasil diedit",
      position: "top",
      timeout: 2000,
    });
    emit("updateStatusDialog", false);
    q.loading.hide();
  } catch (error) {
    console.log(error);
    q.notify({
      type: "negative",
      message: error.response?.data?.message || "Unknown Error",
      position: "top",
      timeout: 2000,
    });
    q.loading.hide();
  }
};

onMounted(() => {
  getData();
});
</script>

<style setup></style>
