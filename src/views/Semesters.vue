<template>
  <v-container cols="12" fluid>
    <v-row v-if="semesterCard !== null">
      <BiteSizeCard title="Current Date Today" :value="today.toISOString().substr(0,10)" />
      <BiteSizeCard title="Current Semester ID" :value="semesterCard.semesterID" />
      <BiteSizeCard title="Current Semester Start Date" :value="semesterCard.startDate" />
      <BiteSizeCard title="Current Semester End Date" :value="semesterCard.endDate" />
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="semesters"
          :loading="loading"
          :loading-text="loadingText"
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
    <v-snackbar color="success" :timeout="timeout" top v-model="snackbarSuccess">
      {{snackbarText}}
      <v-btn dark text @click="snackbarSuccess=false">Close</v-btn>
    </v-snackbar>
    <v-snackbar color="error" :timeout="timeout" top v-model="snackbarFail">
      {{snackbarText}}
      <v-btn dark text @click="snackbarFail=false">Close</v-btn>
    </v-snackbar>
    <v-snackbar color="warning" timeout="5000" right v-model="snackbarDelete">
      <span>Are you sure you want to delete this semester?</span>
      <v-btn dark text @click="deleteSemester">Delete</v-btn>
      <v-btn dark text @click="snackbarDelete=false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import BiteSizeCard from "@/components/BiteSizeCard";
import SemesterForm from "@/components/SemesterForm";

export default {
  name: "Semesters",

  components: {
    BiteSizeCard,
    SemesterForm
  },

  data: () => ({
    index: null,
    today: new Date(),
    semesterCard: null,
    loading: "#151c55",
    loadingText: "Loading items...",
    dialog: false,
    snackbarText: "",
    snackbarSuccess: false,
    snackbarFail: false,
    snackbarDelete: false,
    timeout: 2000,
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
    viewItem: {
      semesterID: 0,
      startDate: null,
      endDate: null,
    },
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
    formTitle: function() {
      return this.editedItem.semesterID === 0
        ? "Add Semester"
        : "Edit Semester";
    }
  },

  watch: {
    dialog: function(val) {
      val || this.close();
    }
  },

  mounted() {
    const todayTime = this.today.getTime();
    this.$http
      .get("semesters")
      .then(response => {
        response.data.semesters.map(semester => {
          if (
            todayTime >= new Date(semester.startDate).getTime() &&
            todayTime <= new Date(semester.endDate).getTime()
          ) {
            this.semesterCard = {
              semesterID: semester._id,
              startDate: semester.startDate.substr(0, 10),
              endDate: semester.endDate.substr(0, 10)
            };
          }
          this.semesters.push({
            semesterID: semester._id,
            startDate: semester.startDate.substr(0, 10),
            endDate: semester.endDate.substr(0, 10)
          });
        });
        this.loading = false;
      })
      .catch(error => {
        const message = "Loading failed. Please contact Tours Portfolio Head/Exco/Platform Adminstrator.";
        this.snackbarFail = true;
        this.snackbarText = message;
        this.loadingText = message;
        console.log(error);
      });
  },

  methods: {
    editItem(item) {
      this.index = this.semesters.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.index = this.semesters.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.snackbarDelete = true;
    },

    deleteSemester() {
      this.$http
        .delete(`semesters/${this.viewItem.semesterID}`)
        .then(response => {
          this.snackbarText = response.data.message;
          this.snackbarSuccess = true;
          this.semesters.splice(this.index, 1);
        })
        .catch(error => {
          this.snackbarText =
            "Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.";
          this.snackbarFail = true;
          console.log(error);
        })
        .then( () => {
          this.snackbarDelete = false;
          this.close();
        })
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.index = null;
        this.editedItem = Object.assign({}, this.defaultItem);
        this.viewItem = Object.assign({}, this.defaultItem);
      }, 200);
    },

    save() {
      let editedItem = this.editedItem;
      if (editedItem.semesterID !== 0) {
        this.$http
          .put(`semesters/${editedItem.semesterID}`, editedItem)
          .then(response => {
            Object.assign(this.semesters[this.index], {
              semesterID: response.data.semester._id,
              startDate: response.data.semester.startDate.substr(0, 10),
              endDate: response.data.semester.endDate.substr(0, 10)
            });
            this.snackbarText = response.data.message;
            this.snackbarSuccess = true;
          })
          .catch(error => {
            this.snackbarText =
              "Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.";
            this.snackbarFail = true;
            console.log(error);
          })
          .then(()=> {
            this.close();
          })
      } else {
        this.$http
          .post("semesters", this.editedItem)
          .then(response => {
            this.semesters.push({
              semesterID: response.data.semester._id,
              startDate: response.data.semester.startDate.substr(0, 10),
              endDate: response.data.semester.endDate.substr(0, 10)
            });
            this.snackbarText = response.data.message;
            this.snackbarSuccess = true;
          })
          .catch(error => {
            this.snackbarText =
              "Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.";
            this.snackbarFail = true;
            console.log(error);
          })
          .then(() => {
            this.close();
          });
      }
    }
  }
};
</script>
