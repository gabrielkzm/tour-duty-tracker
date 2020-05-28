<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <AmbassadorForm
          :buttonDisable="buttonDisable"
          :formTitle="formTitle"
          :ambassador="ambassador"
          :onCancel="handleCancel"
          :onSubmit="handleSubmit"
        />
      </v-col>
    </v-row>
    <v-snackbar color="success" :timeout="timeout" top v-model="snackbarSuccess">{{snackbarText}}<v-btn dark text @click='snackbarSuccess=false'>Close</v-btn></v-snackbar>
    <v-snackbar color="error" :timeout="timeout" top v-model="snackbarFail">{{snackbarText}}<v-btn dark text @click='snackbarFail=false'>Close</v-btn></v-snackbar>
  </v-container>
</template>

<script>
import AmbassadorForm from "@/components/AmbassadorForm";

export default {
  name: "CreateAmbassador",

  components: {
    AmbassadorForm
  },

  data() {
    return {
      buttonDisable: false,
      snackbarSuccess: false,
      snackbarFail: false,
      snackbarText: "",
      timeout: 2000,
      
      ambassador: {
        ambassadorID: null,
        name: null,
        batch: null,
        year: null,
        primaryDegree: null,
        secondaryDegree: 'N/A',
        nationality: null,
        race: null,
        gender: null,
        currentAvailability: null,
        unavailabilityReason: 'N/A',
        unavailabilityFrom: new Date().toISOString().substr(0, 10),
        unavailabilityTo: new Date().toISOString().substr(0, 10),
        mandarinProficiency: null,
        leadershipStatus: null,
        hasGraduated: null,
        contact: null,
        email: null,
        eventCount: {},
        tourCount: {}
      },

      defaultAmbassador: {
        ambassadorID: null,
        name: null,
        batch: null,
        year: null,
        primaryDegree: null,
        secondaryDegree: 'N/A',
        nationality: null,
        race: null,
        gender: null,
        currentAvailability: null,
        unavailabilityReason: 'N/A',
        unavailabilityFrom: new Date().toISOString().substr(0, 10),
        unavailabilityTo: new Date().toISOString().substr(0, 10),
        mandarinProficiency: null,
        leadershipStatus: null,
        hasGraduated: null,
        contact: null,
        email: null,
        eventCount: {},
        tourCount: {}
      },

      formTitle: "Create Ambassador"
    };
  },

  methods: {
    handleCancel() {
      this.ambassador = Object.assign({}, this.defaultAmbassador);
      this.snackbarText = 'Your entry has been cleared.'
      this.snackbarFail = true;
    },

    handleSubmit() {
      this.buttonDisable = true;
      this.$http.post('ambassadors', this.ambassador)
      .then(response => {
        this.snackbarText = response.data.message;
        this.snackbarSuccess = true;
        this.ambassador = Object.assign({}, this.defaultAmbassador);
      })
      .catch((error) => {
        this.snackbarText = 'Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.'
        this.snackbarFail = true;
        console.log(error);
      })
      .then( () => {
        this.buttonDisable = false;
      });
    }
  }
};
</script>