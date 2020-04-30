<template>
  <v-container cols="12" fluid>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
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
  </v-container>
</template>

<script>
import AmbassadorForm from '@/components/AmbassadorForm';

export default {
  name: "GraduatedAmbassadors",
  
  components:{
    AmbassadorForm,
  },

  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Name",
        align: "start",
        value: "name",
        sortable: false
      },
      { text: "Batch", value: "batch" },
      { text: "Degree #1", value: "primaryDegree" },
      { text: "Degree #2", value: "secondaryDegree" },
      { text: "Contact", value: "contact"},
      { text: "Email", value: "email"},
      { text: "Actions", value: "actions", sortable: false }
    ],
    graduatedAmbassadors: [],
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
    }
  }),

  computed: {
    
  },

  watch: {
    dialog: function(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
    this.batches.sort(function(a,b) {return b - a});
  },

  methods: {
    initialize() {
      this.graduatedAmbassadors = [
        {
          ambassadorID: 1213123,
          name: "Aaron Lam Sth Sth",
          batch: 19,
          year: 4,
          primaryDegree: "SIS - IS(IS)",
          secondaryDegree: "SOSS - SOSS",
          nationality: "Singaporean",
          race:"Chinese",
          gender:"F",
          currentAvailability: 'Available',
          unavailabilityReason: 'N/A',
          unavailabilityFrom: new Date().toISOString().substr(0, 10),
          unavailabilityTo: new Date().toISOString().substr(0, 10),
          mandarinProficiency: 'Proficient',
          leadershipStatus: 'Cleared',
          hasGraduated: "Graduated",
          contact: 92367762,
          email: 'gabriel.koh.2016@smu.edu.sg'
        },
        {
          ambassadorID: 5345,
          name: "Sasha Joseph",
          batch: 18,
          year: 3,
          primaryDegree: "LKSCB",
          secondaryDegree: "N/A",
          nationality: "Malaysian",
          race:"Malay",
          gender:"M",
          currentAvailability: 'Available',
          unavailabilityReason: 'N/A',
          unavailabilityFrom: new Date().toISOString().substr(0, 10),
          unavailabilityTo: new Date().toISOString().substr(0, 10),
          mandarinProficiency: 'Proficient',
          leadershipStatus: 'Not Cleared',
          hasGraduated: "Graduated",
          contact: 92367762,
          email: 'gabriel.koh.2016@smu.edu.sg'
        },
      ];
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.graduatedAmbassadors.indexOf(item);
      confirm("Are you sure you want to delete this ambassador?") &&
        this.graduatedAmbassadors.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      }, 200);
    },

    save() {
      let editedItem = this.editedItem;
      let graduatedAmbassadors = this.graduatedAmbassadors;
      if (this.editedItem.ambassadorID !== 0) {
        for(let i = 0; i < graduatedAmbassadors.length; i++){
          let ambass = graduatedAmbassadors[i];
          if(ambass.ambassadorID === editedItem.ambassadorID){
            Object.assign(this.graduatedAmbassadors[i], this.editedItem);
          }
        }
      } else {
        editedItem.ambassadorID = Math.floor(Math.random() * Math.floor(100));
        this.graduatedAmbassadors.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>