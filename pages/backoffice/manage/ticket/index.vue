<template>
  <div class="p-10">
    <q-card>
      <q-card-section>
        <q-toolbar class="flex justify-between">
          <div class="text-slate-800">
            <h2 class="font-semibold text-2xl">Manage Tickets</h2>
            <p>Lihat dan atur tiket</p>
          </div>
          <q-btn
            color="secondary"
            icon-right="add_box"
            label="Tambah Tiket"
            @click="openDialog('tambah')"
          />
          <!-- <q-breadcrumbs
            class="text-cyan"
            active-color="cyan"
            style="font-size: 16px"
          >
            <q-breadcrumbs-el label="Backoffice" icon="home" />
            <q-breadcrumbs-el label="Manage" icon="widgets" />
            <q-breadcrumbs-el label="Tickets" icon="confirmation_number" />
          </q-breadcrumbs> -->
        </q-toolbar>
      </q-card-section>

      <q-separator></q-separator>
      <q-card-section>
        <div class="grid grid-cols-4 gap-6">
          <div class="col">
            <q-input outlined v-model="search" label="Search" :dense="true">
              <template v-slot:prepend>
                <q-icon name="place" />
              </template>

              <template v-slot:append>
                <q-icon
                  v-if="search !== ''"
                  name="close"
                  @click="search = ''"
                  class="cursor-pointer"
                />
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col">
            <q-select
              color="cyan"
              outlined
              v-model="model"
              :options="options"
              label="Label"
              :dense="true"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-select>
          </div>
          <div class="col">
            <q-select
              color="cyan"
              outlined
              v-model="model"
              :options="options"
              label="Label"
              :dense="true"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-select>
          </div>
          <div class="col">
            <q-select
              color="cyan"
              outlined
              v-model="model"
              :options="options"
              label="Label"
              :dense="true"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <div class="q-pa-md">
          <!-- <q-btn label="data" color="primary" @click="getData" /> -->
          <q-table
            :dense="$q.screen.lt.md"
            flat
            bordered
            title="Treats"
            :rows="dataTable"
            no-data-label="I didn't find anything for you"
            :columns="columns"
            row-key="name"
            :visible-columns="visible"
          >
            <template v-slot:body-cell-img="props">
              <td :props="props">
                <q-item class="items-center justify-center">
                  <!-- Section untuk gambar -->
                  <q-item-section side class="text-center">
                    <q-img
                      :src="
                        props.row.medias[0]?.url
                          ? props.row.medias[0].url
                          : 'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png'
                      "
                      :ratio="4 / 3"
                      class="w-[100px] rounded hover:cursor-pointer"
                      fit="contain"
                      @click="dialogPreview(props.row.id)"
                    />
                  </q-item-section>

                  <!-- Section untuk judul dan deskripsi -->
                  <q-item-section>
                    <div class="text-h5 font-bold q-mb-xs">
                      {{ props.row.name }}
                    </div>
                    <div class="text-caption text-grey-6">
                      {{ props.row.copywriting }}
                    </div>
                  </q-item-section>
                </q-item>
              </td>
            </template>

            <template v-slot:body-cell-status="props">
              <td
                :props="props"
                class="justify-center text-center w-full h-full space-x-2"
              >
                <q-toggle
                  v-model="status"
                  checked-icon="check"
                  color="green"
                  keep-color
                  unchecked-icon="clear"
                  size="lg"
                />
              </td>
            </template>

            <template v-slot:body-cell-aksi="props">
              <td
                :props="props"
                class="justify-center text-center w-full h-full space-x-2"
              >
                <q-btn
                  color="red"
                  icon="delete_forever"
                  class="w-1/4"
                  @click="openModalDelete(props.row.id)"
                />
                <q-btn
                  color="secondary"
                  icon="edit"
                  class="w-1/4"
                  @click="openDialog('edit', props.row.id)"
                />
              </td>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <!-- Delete Dialog -->
  <q-dialog v-model="confirmDialog" backdrop-filter="blur(4px)">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="report" color="red" text-color="white" />
        <span class="q-ml-sm"
          >Apakah anda yakin ingin menghapus tiket ini?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Yakin"
          color="primary"
          @click="deleteTicket"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Add & Edit Ticket-->
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-secondary text-white">
      <q-bar>
        <q-space />

        <q-btn
          dense
          flat
          icon="minimize"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
            >Maximize</q-tooltip
          >
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <AddTicket
        v-if="dialogOpened == 'tambah'"
        :statusDialog="dialog"
        @updateStatusDialog="updateDialog"
      ></AddTicket>
      <EditTicket
        v-if="dialogOpened == 'edit'"
        :statusDialog="dialog"
        :idTicket="id"
        @updateStatusDialog="updateDialog"
      ></EditTicket>
    </q-card>
  </q-dialog>

  <!--Image Preview Dialog-->
  <q-dialog v-model="photoPreview" class="">
    <q-carousel
      swipeable
      animated
      v-model="slide"
      thumbnails
      infinite
      arrows
      class="w-full border-4"
    >
      <q-carousel-slide
        v-for="(image, index) in imagePreview"
        :key="index"
        :name="index"
        :img-src="image"
      />
    </q-carousel>
  </q-dialog>
</template>

<script setup>
import { mdiPrinterPosSync } from "@quasar/extras/mdi-v7";
import AddTicket from "./components/addTicket.vue";
import EditTicket from "./components/editTicket.vue";
import { useQuasar } from "quasar";
import { ref, reactive, defineProps, defineEmits } from "vue";
const { $axios } = useNuxtApp();

definePageMeta({
  layout: "backoffice",
});

const q = useQuasar();

const visible = ref([
  "no",
  "ticket",
  "copywriting",
  "price",
  "quota",
  "start",
  "end",
  "status",
  "aksi",
]);

const dialog = ref(false);
const confirmDialog = ref(false);
const maximizedToggle = ref(false);

const photoPreview = ref(false);
const slide = ref(0);
const imagePreview = ref([]);
const status = ref(false);

const dialogPreview = (id) => {
  q.loading.show();
  slide.value = 0;
  const ticket = dataTable.value.find((ticket) => ticket.id === id);

  console.log(ticket);

  imagePreview.value =
    ticket && ticket.medias.length > 0
      ? ticket.medias.map((media) => media.url)
      : [
          "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png",
        ];

  setTimeout(function () {
    q.loading.hide();
    photoPreview.value = true;
  }, 1500);
};

function updateDialog(newStatus) {
  console.log(newStatus);
  dialog.value = newStatus;
  getData();
}
onMounted(() => {
  getData();
});

const columns = [
  {
    name: "id",
    label: "id",
    field: "id",
  },
  {
    name: "no",
    required: true,
    label: "No.",
    align: "left",
    field: "no",
    sortable: true,
  },
  {
    name: "img",
    required: true,
    label: "Info Tiket",
    align: "left",
    field: "img",
  },
  // {
  //   name: "ticket",
  //   required: true,
  //   label: "Ticket",
  //   align: "left",
  //   field: (row) => row.name,
  //   format: (val) => `${val}`,
  //   sortable: true,
  // },
  // {
  //   name: "copywriting",
  //   align: "center",
  //   label: "Deskripsi",
  //   field: "copywriting",
  //   sortable: true,
  // },
  {
    name: "price",
    align: "center",
    label: "Harga (Rp.)",
    field: "price",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  { name: "quota", align: "center", label: "Stok", field: "quota" },
  { name: "start", align: "center", label: "Tanggal Mulai", field: "start" },
  { name: "end", align: "center", label: "Tanggal Selesai", field: "end" },
  {
    name: "status",
    align: "center",
    label: "Status",
    field: "status",
  },
  { name: "aksi", align: "center", label: "", field: "aksi" },
];

const dataTable = ref([]);

const getData = async () => {
  try {
    q.loading.show();

    const { data } = await $axios.get("/api/tickets");
    console.log(data);
    const newData =
      data != null
        ? data.data.map((obj, index) => ({
            ...obj,
            no: index + 1,
            price: `Rp. ${obj.price
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
            start: new Date(obj.start).toLocaleString(),
            end: new Date(obj.end).toLocaleString(),
          }))
        : [];

    // paginationConfig.total = data.totalElements;
    dataTable.value = newData;
  } catch (error) {
    console.log(error);
  } finally {
    q.loading.hide();
  }
};

const id = ref("");

const dialogOpened = ref("");

const openDialog = (status, idTicket = "") => {
  id.value = idTicket;
  dialogOpened.value = status;
  dialog.value = true;
  console.log(dialogOpened.value);
};

const openModalDelete = (idTicket) => {
  id.value = idTicket;
  confirmDialog.value = true;
};

const deleteTicket = async () => {
  console.log(id.value);

  try {
    q.loading.show();

    const response = await $axios.delete(`/api/tickets/${id.value}`);
    console.log(response);
    q.notify({
      type: "positive",
      message: "Tiket berhasil dihapus",
      position: "top",
      timeout: 2000,
    });
    getData();
  } catch (error) {
    console.log(error);
    q.notify({
      type: "negative",
      message: "Gagal menghapus tiket",
      position: "top",
      timeout: 2000,
    });
  } finally {
    q.loading.hide();
    id.value = "";
  }
};
</script>

<style scoped></style>
