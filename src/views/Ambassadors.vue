<template>
  <v-container cols="12" fluid>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="ambassadors"
          :loading="loading"
          :loading-text="loadingText"
          :footer-props="{
            itemsPerPageOptions: [60,80,100,120, -1]
          }"
          multi-sort
          sort-by="name"
          class="elevation-12"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Current Ambassadors</v-toolbar-title>
              <v-divider class="mx-4"></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="1000px">
                <template v-slot:activator="{ on }">
                  <v-btn small color="#151c55" dark class="mb-2" v-on="on">Add Ambassador</v-btn>
                </template>
                <AmbassadorForm
                  :ambassador="editedItem"
                  :onCancel="close"
                  :onSubmit="save"
                  :formTitle="formTitle"
                />
              </v-dialog>
              <v-dialog v-model="unavailabilityDialog" max-width="500px">
                <AmbassadorDetailsCard
                  :ambassador="viewItem"
                  :onClose="close"
                  :unavailablityDetails="true"
                />
              </v-dialog>
              <v-dialog v-model="detailsDialog" max-width="500px">
                <AmbassadorDetailsCard
                  :ambassador="viewItem"
                  :onClose="close"
                  :unavailablityDetails="false"
                />
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.name="{ item }">
            <v-container>
              <v-row>
                <span class="mr-2">{{item.name}}</span>
                <v-icon small class="mr-2" @click="getDetails(item)">mdi-open-in-new</v-icon>
                <div v-if="batches[0] === item.batch">
                  <v-icon small class="mr-2">mdi-baby-bottle</v-icon>
                </div>
                <div v-else>
                  <v-icon small class="mr-2">mdi-briefcase</v-icon>
                </div>
              </v-row>
            </v-container>
          </template>
          <template v-slot:item.currentAvailability="{ item }">
            <div v-show="item.currentAvailability">
              <v-chip color="success" dark x-small class="mr-2">
                <v-icon x-small>mdi-check-circle</v-icon>
              </v-chip>
            </div>
            <div v-show="!item.currentAvailability">
              <v-chip
                color="error"
                dark
                x-small
                class="mr-2"
                @click="getUnavailablityDetails(item)"
              >
                <v-icon x-small>mdi-close-circle</v-icon>
              </v-chip>
            </div>
          </template>
          <template v-slot:item.mandarinProficiency="{ item }">
            <div v-show="item.mandarinProficiency === 'Proficient'">
              <v-chip color="success" dark x-small class="mr-2">
                <v-icon x-small>mdi-check-circle</v-icon>
              </v-chip>
            </div>
            <div v-show="item.mandarinProficiency === 'Average'">
              <v-chip color="warning" dark x-small class="mr-2">
                <v-icon x-small>mdi-check-circle</v-icon>
              </v-chip>
            </div>
            <div v-show="item.mandarinProficiency === 'Not Proficient'">
              <v-chip color="error" dark x-small class="mr-2">
                <v-icon x-small>mdi-close-circle</v-icon>
              </v-chip>
            </div>
          </template>
          <template v-slot:item.leadershipStatus="{ item }">
            <div v-show="item.leadershipStatus">
              <v-chip color="success" dark x-small class="mr-2">
                <v-icon x-small>mdi-check-circle</v-icon>
              </v-chip>
            </div>
            <div v-show="!item.leadershipStatus">
              <v-chip color="error" dark x-small class="mr-2">
                <v-icon x-small>mdi-close-circle</v-icon>
              </v-chip>
            </div>
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
      <span>Are you sure you want to delete this ambassador?</span>
      <v-btn dark text @click="deleteAmbassador">Delete</v-btn>
      <v-btn dark text @click="snackbarDelete=false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import AmbassadorForm from "@/components/AmbassadorForm";
import AmbassadorDetailsCard from "@/components/AmbassadorDetailsCard";

export default {
  name: "Ambassadors",

  components: {
    AmbassadorForm,
    AmbassadorDetailsCard
  },

  data: () => ({
    index: null,
    loading: "#151c55",
    loadingText: "Loading items...",
    dialog: false,
    detailsDialog: false,
    unavailabilityDialog: false,
    snackbarText: "",
    snackbarSuccess: false,
    snackbarFail: false,
    snackbarDelete: false,
    timeout: 2000,
    headers: [
      {
        text: "Name",
        align: "start",
        value: "name"
      },
      { text: "Batch", value: "batch" },
      { text: "Year", value: "year" },
      { text: "Degree #1", value: "primaryDegree" },
      { text: "Degree #2", value: "secondaryDegree" },
      { text: "Available?", value: "currentAvailability" },
      { text: "Mandarin?", value: "mandarinProficiency" },
      { text: "Leadership?", value: "leadershipStatus" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    batches: [14, 15, 16, 17, 18, 19],
    ambassadors: [],
    editedItem: {
      ambassadorID: 0,
      name: "",
      batch: null,
      year: null,
      primaryDegree: "",
      secondaryDegree: "",
      nationality: "",
      race: "",
      gender: "",
      currentAvailability: "",
      unavailabilityReason: "",
      unavailabilityFrom: new Date().toISOString().substr(0, 10),
      unavailabilityTo: new Date().toISOString().substr(0, 10),
      mandarinProficiency: "",
      leadershipStatus: "",
      hasGraduated: "",
      contact: null,
      email: "",
      tourCount: {},
      eventCount: {}
    },
    defaultItem: {
      ambassadorID: 0,
      name: "",
      batch: null,
      year: null,
      primaryDegree: "",
      secondaryDegree: "",
      nationality: "",
      race: "",
      gender: "",
      currentAvailability: "",
      unavailabilityReason: "",
      unavailabilityFrom: new Date().toISOString().substr(0, 10),
      unavailabilityTo: new Date().toISOString().substr(0, 10),
      mandarinProficiency: "",
      leadershipStatus: "",
      hasGraduated: "",
      contact: null,
      email: "",
      tourCount: {},
      eventCount: {}
    },
    viewItem: {
      ambassadorID: 0,
      name: "",
      batch: null,
      year: null,
      primaryDegree: "",
      secondaryDegree: "",
      nationality: "",
      race: "",
      gender: "",
      currentAvailability: "",
      unavailabilityReason: "",
      unavailabilityFrom: new Date().toISOString().substr(0, 10),
      unavailabilityTo: new Date().toISOString().substr(0, 10),
      mandarinProficiency: "",
      leadershipStatus: "",
      hasGraduated: "",
      contact: null,
      email: "",
      tourCount: {},
      eventCount: {}
    }
  }),

  computed: {
    formTitle() {
      return this.editedItem.ambassadorID === 0
        ? "Add Ambassador"
        : "Edit Ambassador";
    }
  },

  watch: {
    dialog: function(val) {
      val || this.close();
    },

    detailsDialog: function(val) {
      val || this.close();
    },

    unavailabilityDialog: function(val) {
      val || this.close();
    }
  },

  created() {
    this.batches.sort(function(a, b) {
      return b - a;
    });
  },

  mounted() {
    this.$http
      .get("ambassadors?filter[hasGraduated]=false")
      .then(response => {
        this.ambassadors = response.data.ambassadors.map(ambassador => {
          return this.transformAmbassadorData(ambassador);
        });
        this.loading = false;
      })
      .catch(error => {
        const message =
          "Loading failed. Please contact Tours Portfolio Head/EXCO/Platform Administrator.";
        this.snackbarFail = true;
        this.snackbarText = message;
        this.loadingText = message;
        console.log(error);
      });
  },

  methods: {
    transformAmbassadorData(ambassador) {
      delete ambassador.createdAt;
      delete ambassador.eventCount;
      delete ambassador.tourCount;
      delete ambassador.updatedAt;
      delete ambassador.__v;
      ambassador["ambassadorID"] = ambassador._id;
      delete ambassador._id;
      ambassador["unavailabilityFrom"] = ambassador.unavailabilityFrom.substr(
        0,
        10
      );
      ambassador["unavailabilityTo"] = ambassador.unavailabilityTo.substr(
        0,
        10
      );
      return ambassador;
    },

    editItem(item) {
      this.index = this.ambassadors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.snackbarDelete = true;
      this.index = this.ambassadors.indexOf(item);
      this.viewItem = Object.assign({}, item);
    },

    deleteAmbassador() {
      this.$http
        .delete(`ambassadors/${this.viewItem.ambassadorID}`)
        .then(response => {
          this.ambassadors.splice(this.index, 1);
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
          this.snackbarDelete = false;
          this.close();
        });
    },

    getDetails(item) {
      this.index = this.ambassadors.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.detailsDialog = true;
    },

    getUnavailablityDetails(item) {
      this.index = this.ambassadors.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.unavailabilityDialog = true;
    },

    close() {
      this.dialog = false;
      this.detailsDialog = false;
      this.unavailabilityDialog = false;
      setTimeout(() => {
        this.index = null;
        this.editedItem = Object.assign({}, this.defaultItem);
        this.viewItem = Object.assign({}, this.defaultItem);
      }, 200);
    },

    save() {
      let editedItem = this.editedItem;
      let ambassadors = this.ambassadors;
      if (editedItem.ambassadorID !== 0) {
        this.$http
          .put(`ambassadors/${editedItem.ambassadorID}`, editedItem)
          .then(response => {
            let ambassador = response.data.ambassador;
            ambassador = this.transformAmbassadorData(ambassador);
            Object.assign(ambassadors[this.index], ambassador);
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
      } else {
        this.$http
          .post("ambassadors", editedItem)
          .then(response => {
            let ambassador = this.transformAmbassadorData(
              response.data.ambassador
            );
            ambassadors.push(ambassador);
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