<template>
  <div class="p-5 text-slate-950">
    <q-card bordered>
      <q-card-section>
        <div class="text-h6">Tambah Tiket</div>
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
                :clearable="!isUploading"
                :counter-label="counterLabelFn"
                max-files="4"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
                <!-- <template v-slot:append>
              <q-icon
                name="close"
                @click.stop.prevent="formAddTicket.image = null"
                class="cursor-pointer"
              />
            </template> -->

                <template v-slot:file="{ index, file }">
                  <q-chip
                    class="full-width q-my-xs"
                    :removable="
                      isUploading && uploadProgress[index].percent < 1
                    "
                    square
                    @remove="cancelFile(index)"
                  >
                    <q-linear-progress
                      class="absolute-full full-height"
                      :value="uploadProgress[index].percent"
                      :color="uploadProgress[index].color"
                      track-color="grey-2"
                    />

                    <q-avatar>
                      <q-icon :name="uploadProgress[index].icon" />
                    </q-avatar>

                    <div class="ellipsis relative-position">
                      {{ file.name }}
                    </div>

                    <q-tooltip>
                      {{ file.name }}
                    </q-tooltip>
                  </q-chip>
                </template>

                <template v-slot:after v-if="canUpload">
                  <q-btn
                    color="cyan"
                    dense
                    icon="cloud_upload"
                    round
                    @click="upload"
                    :disable="!canUpload"
                    :loading="isUploading"
                  />
                </template>
              </q-file>
              <div v-if="formAddTicket.image.length > 0">
                <h3>Uploaded Files:</h3>
                <ul>
                  <li v-for="(file, index) in formAddTicket.image" :key="index">
                    {{ index }}
                    {{ file }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="w-96">
              <div class="text-subtitle1">Nama Tiket</div>
              <q-input
                dense
                outlined
                v-model="formAddTicket.name"
                label="Nama Tiket"
              />
            </div>
            <div class="w-96">
              <div class="text-subtitle1">Deskripsi Tiket</div>
              <q-input
                dense
                v-model="formAddTicket.description"
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
                    v-model="formAddTicket.price"
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
                    v-model="formAddTicket.quota"
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
                  <p class="mt-1">{{ formAddTicket.startDate }}</p>
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
                  <p class="mt-1">{{ formAddTicket.endDate }}</p>
                </div>
              </div>
            </div>
            {{ statusDialog }}
            <div class="w-full pt-3">
              <q-btn
                color="secondary"
                icon="save_alt"
                label="Tambahkan Tiket"
                class="w-full"
                @click="addTicket"
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

const q = useQuasar();

const props = defineProps({
  statusDialog: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["updateStatusDialog"]);

const counterLabelFn = ({ totalSize, filesNumber, maxFiles }) => {
  return `${filesNumber} files of ${maxFiles} | ${totalSize}`;
};

const uploadProgress = ref([]);
const uploading = ref(null);
const files = ref(null);

function cleanUp() {
  clearTimeout(uploading.value);
}

function updateUploadProgress() {
  let done = true;

  uploadProgress.value = uploadProgress.value.map((progress, index) => {
    console.log(index);
    if (progress.percent === 1 || progress.error === true) {
      return progress;
    }

    const percent = Math.min(1, progress.percent + Math.random() / 10);
    const error = percent < 1 && Math.random() > 0.95;

    if (!error && percent === 1) {
      console.log(files);
      const fileName = files.value[index].name;
      if (!formAddTicket.image.includes(fileName)) {
        formAddTicket.image.push(fileName); // Menyimpan nama file
      }
    }

    if (error === false && percent < 1 && done === true) {
      done = false;
    }

    return {
      ...progress,
      error,
      color: error === true ? "red-2" : "green-2",
      percent,
    };
  });

  uploading.value =
    done !== true ? setTimeout(updateUploadProgress, 300) : null;
}

// Cleanup when the component is unmounted
onBeforeUnmount(cleanUp);

// Computed properties
const isUploading = computed(() => uploading.value !== null);
const canUpload = computed(() => files !== null);

// Methods
function cancelFile(index) {
  formAddTicket.image = [];
  uploadProgress.value[index] = {
    ...uploadProgress.value[index],
    error: true,
    color: "orange-2",
  };
}

function updateFiles(newFiles) {
  console.log(newFiles);
  files.value = newFiles;
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
  cleanUp();

  const allDone = uploadProgress.value.every(
    (progress) => progress.percent === 1
  );

  uploadProgress.value = uploadProgress.value.map((progress) => ({
    ...progress,
    error: false,
    color: "green-2",
    percent: allDone === true ? 0 : progress.percent,
  }));

  updateUploadProgress();
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
  formAddTicket.price = rupiah; // Update the value without adding "Rp." to avoid duplication
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
    formAddTicket.startDate = `${startDate.value} ${startTime.value}`;
  } else {
    console.log(endDate.value);
    console.log(endTime.value);
    formAddTicket.endDate = `${endDate.value} ${endTime.value}`;
  }
};

const formAddTicket = reactive({
  image: [],
  name: "",
  price: "",
  description: "",
  startDate: "",
  endDate: "",
  quota: "",
});

const addTicket = async () => {
  console.log(formAddTicket);
  q.loading.show();
  try {
    const response = await $fetch("/api/tickets", {
      method: "POST",
      body: {
        name: formAddTicket.name,
        copywriting: formAddTicket.description,
        start: formAddTicket.startDate,
        end: formAddTicket.endDate,
        price: parseInt(formAddTicket.price.replace(/\./g, "")),
        quota: parseInt(formAddTicket.quota),
        medias: formAddTicket.image,
      },
    });
    console.log("Post Tiket:", response);
    q.notify({
      type: "positive",
      message: "Tiket berhasil ditambahkan",
      position: "top",
      timeout: 2000,
    });
    emit("updateStatusDialog", false);
    q.loading.hide();
  } catch (error) {
    console.log(error.response);
    q.notify({
      type: "negative",
      message: error.response._data.message,
      position: "top",
      timeout: 2000,
    });
    q.loading.hide();
  }
};
</script>

<style setup></style>
