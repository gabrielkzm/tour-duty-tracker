<template>
  <v-container cols="12" fluid>
    <v-row>
      <BiteSizeCard title="Current Date Today" :value="new Date().toISOString().substr(0,10)" />
      <BiteSizeCard title="Current Semester ID" :value="this.semesters[0]['semesterID']" />
      <BiteSizeCard title="Current Semester Start Date" :value="this.semesters[0]['startDate']" />
      <BiteSizeCard title="Current Semester End Date" :value="this.semesters[0]['endDate']" />
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="semesters"
          sort-desc="startDate"
          class="elevation-12"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Semesters</v-toolbar-title>
              <v-divider class="mx-4"></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn small color="#151c55" dark class="mb-2" v-on="on">Add Semester</v-btn>
                </template>
                <SemesterForm
                  :semester="editedItem"
                  :onCancel="close" 
                  :onSubmit="save"
                  :formTitle="formTitle"
                />
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BiteSizeCard from "@/components/BiteSizeCard";
import SemesterForm from '@/components/SemesterForm';

export default {
  name: "Semesters",

  components: {
    BiteSizeCard,
    SemesterForm,
  },

  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Semester ID",
        align: "start",
        sortable: false,
        value: "semesterID"
      },
      { text: "Start Date", value: "startDate" },
      { text: "End Date", value: "endDate" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    semesters: [],
    editedItem: {
      semesterID: 0,
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10)
    },
    defaultItem: {
      semesterID: 0,
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10)
    }
  }),

  computed: {
    formTitle() {
      return this.editedItem.semesterID === 0 ? "Add Semester" : "Edit Semester";
    }
  },

  watch: {
    dialog: function(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.semesters = [
        {
          semesterID: 1,
          startDate: new Date("March 20, 2021, 12:00:01")
            .toISOString()
            .substr(0, 10),
          endDate: new Date("October 20, 2021, 12:00:01")
            .toISOString()
            .substr(0, 10)
        },
        {
          semesterID: 2,
          startDate: new Date("October 20, 2020, 12:00:01")
            .toISOString()
            .substr(0, 10),
          endDate: new Date("January 20, 2021, 12:00:01")
            .toISOString()
            .substr(0, 10)
        },
        {
          semesterID: 3,
          startDate: new Date("January 10, 2020, 12:00:01")
            .toISOString()
            .substr(0, 10),
          endDate: new Date("June 20, 2020, 12:00:01")
            .toISOString()
            .substr(0, 10)
        }
      ];
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.semesters.indexOf(item);
      confirm("Are you sure you want to delete this semester?") &&
        this.semesters.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      }, 200);
    },

    save() {
      let editedItem = this.editedItem;
      if (editedItem.semesterID !== 0) {
        for(let i= 0; i < this.semesters.length; i++){
          let sem = this.semesters[i];
          if (sem.semesterID === editedItem.semesterID){
            Object.assign(this.semesters[i], this.editedItem);
          }
        }
      } else {
        editedItem.semesterID = Math.floor(Math.random() * Math.floor(100));
        this.semesters.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
