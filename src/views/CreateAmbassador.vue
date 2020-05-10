<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <AmbassadorForm
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
        secondaryDegree: null,
        nationality: null,
        race: null,
        gender: null,
        currentAvailability: null,
        unavailabilityReason: null,
        unavailabilityFrom: new Date().toISOString().substr(0, 10),
        unavailabilityTo: new Date().toISOString().substr(0, 10),
        mandarinProficiency: null,
        leadershipStatus: null,
        hasGraduated: null,
        contact: null,
        email: null
      },

      defaultAmbassador: {
        ambassadorID: null,
        name: null,
        batch: null,
        year: null,
        primaryDegree: null,
        secondaryDegree: null,
        nationality: null,
        race: null,
        gender: null,
        currentAvailability: null,
        unavailabilityReason: null,
        unavailabilityFrom: new Date().toISOString().substr(0, 10),
        unavailabilityTo: new Date().toISOString().substr(0, 10),
        mandarinProficiency: null,
        leadershipStatus: null,
        hasGraduated: null,
        contact: null,
        email: null
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

    handleSubmit(e) {
      e.preventDefault();
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
    }
  }
};
</script>