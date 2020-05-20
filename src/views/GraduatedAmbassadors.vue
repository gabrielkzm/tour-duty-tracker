<template>
  <v-container cols="12" fluid>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :loading="loading"
          :loading-text="loadingText"
          :items="graduatedAmbassadors"
          :footer-props="{
            itemsPerPageOptions: [60,80,100,120, -1]
          }"
          multi-sort
          sort-by="name"
          class="elevation-12"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Graduated Ambassadors</v-toolbar-title>
              <v-divider class="mx-4"></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="1000px">
                <AmbassadorForm
                  :ambassador="editedItem"
                  :onCancel="close" 
                  :onSubmit="save"
                  formTitle="Edit Ambassador"
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
      <span>Are you sure you want to delete this ambassador?</span>
      <v-btn dark text @click="deleteAmbassador">Delete</v-btn>
      <v-btn dark text @click="snackbarDelete=false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import AmbassadorForm from '@/components/AmbassadorForm';

export default {
  name: "GraduatedAmbassadors",
  
  components:{
    AmbassadorForm,
  },

  mounted(){
    this.$http.get('ambassadors?filter[hasGraduated]=true')
      .then(response => {
        this.graduatedAmbassadors = response.data.ambassadors.map(ambassador => {
          return this.transformAmbassadorData(ambassador);
        });
        this.loading = false;
      })
      .catch(error => {
        const message = "Loading failed. Please contact Tours Portfolio Head/Exco/Platform Adminstrator.";
        this.snackbarFail = true;
        this.snackbarText = message;
        this.loadingText = message;
        console.log(error);
      })
  },

  data: () => ({
    index: null,
    loading: '#151c55',
    loadingText: 'Loading items...',
    snackbarFail: false,
    snackbarSuccess: false,
    snackbarDelete: false,
    snackbarText: '',
    timeout: 2000,
    dialog: false,
    headers: [
      {
        text: "Name",
        align: "start",
        value: "name",
      },
      { text: "Batch", value: "batch" },
      { text: "Degree #1", value: "primaryDegree" },
      { text: "Degree #2", value: "secondaryDegree" },
      { text: "Contact", value: "contact"},
      { text: "Email", value: "email"},
      { text: "Actions", value: "actions", sortable: false }
    ],
    graduatedAmbassadors: [],
    viewItem: {
      ambassadorID: 0,
      name: "",
      batch: null,
      year: null,
      primaryDegree: "",
      secondaryDegree: "",
      nationality: "",
      race:"",
      gender:"",
      currentAvailability: '',
      unavailabilityReason: '',
      unavailabilityFrom: new Date().toISOString().substr(0, 10),
      unavailabilityTo: new Date().toISOString().substr(0, 10),
      mandarinProficiency: '',
      leadershipStatus: '',
      hasGraduated: '',
      contact: 0,
      email: '',
      tourCount: {},
      eventCount: {}
    },
    editedItem: {
      ambassadorID: 0,
      name: "",
      batch: null,
      year: null,
      primaryDegree: "",
      secondaryDegree: "",
      nationality: "",
      race:"",
      gender:"",
      currentAvailability: '',
      unavailabilityReason: '',
      unavailabilityFrom: new Date().toISOString().substr(0, 10),
      unavailabilityTo: new Date().toISOString().substr(0, 10),
      mandarinProficiency: '',
      leadershipStatus: '',
      hasGraduated: '',
      contact: 0,
      email: '',
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
      race:"",
      gender:"",
      currentAvailability: '',
      unavailabilityReason: '',
      unavailabilityFrom: new Date().toISOString().substr(0, 10),
      unavailabilityTo: new Date().toISOString().substr(0, 10),
      mandarinProficiency: '',
      leadershipStatus: '',
      hasGraduated: '',
      contact: 0,
      email: '',
      tourCount: {},
      eventCount: {}
    }
  }),

  watch: {
    dialog: function(val) {
      val || this.close();
    },
  },

  created() {
    this.batches.sort(function(a,b) {return b - a});
  },

  methods: {
    transformAmbassadorData(ambassador){
      delete ambassador.createdAt
      delete ambassador.eventCount
      delete ambassador.tourCount
      delete ambassador.updatedAt
      delete ambassador.__v
      ambassador['ambassadorID'] = ambassador._id
      delete ambassador._id
      ambassador['unavailabilityFrom'] = ambassador.unavailabilityFrom.substr(0,10)
      ambassador['unavailabilityTo'] = ambassador.unavailabilityTo.substr(0,10)
      return ambassador
    },

    editItem(item) {
      this.index = this.graduatedAmbassadors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.index = this.graduatedAmbassadors.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.snackbarDelete = true;
    },

    deleteAmbassador(){
      this.$http.delete(`ambassadors/${this.viewItem.ambassadorID}`)
        .then(response => {
          this.snackbarText = response.data.message;
          this.snackbarSuccess = true;
          this.graduatedAmbassadors.splice(this.index,1);
        })
        .catch(error => {
          this.snackbarText = "Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.";
          this.snackbarFail = true;
          console.log(error);
        })
        .then(()=>{
          this.snackbarDelete = false;
          this.close();
        });
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
      let graduatedAmbassadors = this.graduatedAmbassadors;
      this.$http.put(`ambassadors/${editedItem.ambassadorID}`, editedItem)
        .then(response => {
          let ambassador = response.data.ambassador;
          ambassador = this.transformAmbassadorData(ambassador);
          Object.assign(graduatedAmbassadors[this.index],ambassador);
          this.snackbarText = response.data.message;
          this.snackbarSuccess = true;
        })
        .catch(error => {
          this.snackbarText = 'Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.';
          this.snackbarFail = true;
          console.log(error);
        })
        .then(() => {
          this.close();
        });
    }
  }
};
</script>