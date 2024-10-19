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
                  @click.stop.prevent="formEditTicket.image = null"
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
              <div v-if="formEditTicket.image.length > 0">
                <h3>Uploaded Files:</h3>
                <ul>
                  <li
                    v-for="(file, index) in formEditTicket.image"
                    :key="index"
                  >
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

const q = useQuasar();

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

onMounted(() => {
  getData();
});

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
      if (!formEditTicket.image.includes(fileName)) {
        formEditTicket.image.push(fileName); // Menyimpan nama file
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
  formEditTicket.image = [];
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

    const { data } = await $fetch(`/api/tickets/${props.idTicket}`, {
      method: "GET",
    });
    console.log(data);
    formEditTicket.name = data.name;
    formEditTicket.description = data.copywriting;
    formEditTicket.price = data.price;
    formEditTicket.quota = data.quota;
    formEditTicket.startDate = data.start;
    formEditTicket.endDate = data.end;
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
    const response = await $fetch(`/api/tickets/${props.idTicket}`, {
      method: "PUT",
      body: {
        name: formEditTicket.name,
        copywriting: formEditTicket.description,
        start: formEditTicket.startDate,
        end: formEditTicket.endDate,
        price: parseInt(formEditTicket.price),
        quota: parseInt(formEditTicket.quota),
        medias: formEditTicket.image,
      },
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
