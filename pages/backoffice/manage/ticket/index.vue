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
            @click="dialog = true"
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
          <q-btn label="data" color="primary" @click="getData" />
          <q-table
            :dense="$q.screen.lt.md"
            flat
            bordered
            title="Treats"
            :rows="dataTable"
            no-data-label="I didn't find anything for you"
            :columns="columns"
            row-key="name"
          >
            <template v-slot:body-cell-aksi="props">
              <td class="flex justify-center w-full h-full space-x-2">
                <q-btn color="red" icon="delete_forever" class="w-1/4" />
                <q-btn color="secondary" icon="edit" class="w-1/4" />
              </td>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </div>

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
        :statusDialog="dialog"
        @updateStatusDialog="updateDialog"
      ></AddTicket>
    </q-card>
  </q-dialog>
</template>

<script setup>
import AddTicket from "./components/addTicket.vue";
import { useQuasar } from "quasar";
import { ref, reactive, defineProps, defineEmits } from "vue";

definePageMeta({
  layout: "backoffice",
});

const q = useQuasar();

const dialog = ref(false);
const maximizedToggle = ref(true);
function updateDialog(newStatus) {
  console.log(newStatus);
  dialog.value = newStatus;
  getData();
}

const columns = [
  {
    name: "ticket",
    required: true,
    label: "Ticket",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "copywriting",
    align: "center",
    label: "Deskripsi",
    field: "copywriting",
    sortable: true,
  },
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
  { name: "aksi", align: "center", label: "", field: "aksi" },
];

const dataTable = ref([]);

const getData = async () => {
  try {
    q.loading.show();

    const { data } = await $fetch("/api/tickets", {
      method: "GET",
    });
    console.log(data);
    const newData =
      data != null
        ? data.map((obj, index) => ({
            ...obj,
          }))
        : [];

    // paginationConfig.total = data.totalElements;
    dataTable.value = newData;

    // const newData =
    //   data.data != null
    //     ? data.data.map((obj, index) => ({
    //         ...obj,
    //         daya: obj.daya
    //           .toString()
    //           .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, "."),
    //         kapasitas_output_inverter: obj.kapasitas_output_inverter
    //           .toString()
    //           .replace(/\.0\b/, ""),
    //         kapasitas_modul_surya: obj.kapasitas_modul_surya
    //           .toString()
    //           .replace(/\.0\b/, ""),
    //       }))
    //     : [];

    // paginationConfig.total = data.totalElements;
    // datas.value = newData;
  } catch (error) {
    console.log(error);

    // datas.value = [];
    // if (!error.response?.data?.message.toLowerCase().includes("token")) {
    //   showNotificationError(error.response?.data?.message || "Unknown error");
    // }
    // ////console.log(error);
  } finally {
    q.loading.hide();
  }
};
</script>

<style scoped></style>
