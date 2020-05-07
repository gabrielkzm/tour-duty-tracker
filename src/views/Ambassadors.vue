<template>
  <v-container cols="12" fluid>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="ambassadors"
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
            </v-toolbar>
          </template>
          <template v-slot:item.name="{ item }">
            <v-container>
              <v-row>
                <span class="mr-2">{{item.name}}</span>
                <v-icon small class="mr-2" @click="getDetails(item)">mdi-open-in-new</v-icon>
                <v-dialog v-model="detailsDialog" max-width="500px">
                  <AmbassadorDetailsCard
                    :ambassador="viewItem"
                    :onClose="close"
                    :unavailablityDetails="false"
                  />
                </v-dialog>
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
            <div v-show="item.currentAvailability === 'Available'">
              <v-chip color="success" dark x-small class="mr-2">
                <v-icon x-small>mdi-check-circle</v-icon>
              </v-chip>
            </div>
            <div v-show="item.currentAvailability === 'Not Available'">
              <v-chip
                color="error"
                dark
                x-small
                class="mr-2"
                @click="getUnavailablityDetails(item)"
              >
                <v-icon x-small>mdi-close-circle</v-icon>
              </v-chip>
              <v-dialog v-model="unavailabilityDialog" max-width="500px">
                <AmbassadorDetailsCard
                  :ambassador="viewItem"
                  :onClose="close"
                  :unavailablityDetails="true"
                />
              </v-dialog>
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
            <div v-show="item.leadershipStatus === 'Cleared'">
              <v-chip color="success" dark x-small class="mr-2">
                <v-icon x-small>mdi-check-circle</v-icon>
              </v-chip>
            </div>
            <div v-show="item.leadershipStatus === 'Not Cleared'">
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
    dialog: false,
    detailsDialog: false,
    unavailabilityDialog: false,
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
      contact: 0,
      email: ""
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
      contact: 0,
      email: ""
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
      contact: 0,
      email: ""
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
    }
  },

  created() {
    this.initialize();
    this.batches.sort(function(a, b) {
      return b - a;
    });
  },

  methods: {
    initialize() {
      this.ambassadors = [
        {
          ambassadorID: 123,
          name: "Gabriel Koh Zhe Ming",
          batch: 19,
          year: 4,
          primaryDegree: "SIS - IS(IS)",
          secondaryDegree: "SOSS - SOSS",
          nationality: "Singaporean",
          race: "Chinese",
          gender: "F",
          currentAvailability: "Available",
          unavailabilityReason: "N/A",
          unavailabilityFrom: new Date().toISOString().substr(0, 10),
          unavailabilityTo: new Date().toISOString().substr(0, 10),
          mandarinProficiency: "Proficient",
          leadershipStatus: "Cleared",
          hasGraduated: "Graduated",
          contact: 92367762,
          email: "gabriel.koh.2016@smu.edu.sg"
        },
        {
          ambassadorID: 4567,
          name: "Louis Lui Yu Ze",
          batch: 18,
          year: 3,
          primaryDegree: "LKSCB",
          secondaryDegree: "N/A",
          nationality: "Malaysian",
          race: "Malay",
          gender: "M",
          currentAvailability: "Not Available",
          unavailabilityReason: "LOA",
          unavailabilityFrom: new Date().toISOString().substr(0, 10),
          unavailabilityTo: new Date().toISOString().substr(0, 10),
          mandarinProficiency: "Average",
          leadershipStatus: "Not Cleared",
          hasGraduated: "Not Graduated",
          contact: 92367762,
          email: "gabriel.koh.2016@smu.edu.sg"
        },
        {
          ambassadorID: 452,
          name: "Nigel Siew Something Something",
          batch: 17,
          year: 2,
          primaryDegree: "LKSCB",
          secondaryDegree: "SOA",
          nationality: "Chinese",
          race: "Chinese",
          gender: "M",
          currentAvailability: "Available",
          unavailabilityReason: "N/A",
          unavailabilityFrom: new Date().toISOString().substr(0, 10),
          unavailabilityTo: new Date().toISOString().substr(0, 10),
          mandarinProficiency: "Not Proficient",
          leadershipStatus: "Not Cleared",
          hasGraduated: "Not Graduated",
          contact: 92367762,
          email: "gabriel.koh.2016@smu.edu.sg"
        }
      ];
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.ambassadors.indexOf(item);
      confirm("Are you sure you want to delete this ambassador?") &&
        this.ambassadors.splice(index, 1);
    },

    getDetails(item) {
      this.viewItem = Object.assign({}, item);
      this.detailsDialog = true;
    },

    getUnavailablityDetails(item) {
      this.viewItem = Object.assign({}, item);
      this.unavailabilityDialog = true;
    },

    close() {
      this.dialog = false;
      this.detailsDialog = false;
      this.unavailabilityDialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.viewItem = Object.assign({}, this.defaultItem);
      }, 200);
    },

    save() {
      let editedItem = this.editedItem;
      let ambassadors = this.ambassadors;
      if (editedItem.ambassadorID !== 0) {
        for (let i = 0; i < ambassadors.length; i++) {
          let ambass = ambassadors[i];
          if (ambass.ambassadorID === editedItem.ambassadorID) {
            Object.assign(this.ambassadors[i], this.editedItem);
          }
        }
      } else {
        editedItem.ambassadorID = Math.floor(Math.random() * Math.floor(100));
        ambassadors.push(editedItem);
      }
      this.close();
    }
  }
};
</script>
