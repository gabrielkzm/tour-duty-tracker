<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <TourForm
          :formTitle="formTitle"
          :tour="tour"
          :newTour="true"
          :onSubmitAndEmail="handleSubmitAndEmail"
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
import TourForm from "@/components/TourForm";

export default {
  name: "CreateTour",

  components: {
    TourForm
  },

  data() {
    return {
      snackbarSuccess: false,
      snackbarFail: false,
      snackbarText: "",
      timeout: 2000,
      tour: {
        tourID: null,
        name: null,
        date: null,
        startTime: null,
        endTime: null,
        type: null,
        numberOfGuests: null,
        numberOfAmbassadorsRequired: null,
        ambassadorsAccepted: [],
        ambassadorsDeclinedWithReason: [],
        ambassadorsDeclinedWithoutReason: [],
        assignedAmbassadors: ['000000000000000000000000'],
        ambassadorIC: '000000000000000000000000',
        attire: null,
        purposeOfTour: null,
        guestProfile: null,
        checkPoints: null,
        startPoint: null,
        endPoint: null,
        remarks: null,
        office: null,
        officePhoneContact: null,
        officeEmailContact: null,
        officeLiaison: null,
        status: null,
      },
      defaultTour: {
        tourID: null,
        name: null,
        date: null,
        startTime: null,
        endTime: null,
        type: null,
        numberOfGuests: null,
        numberOfAmbassadorsRequired: null,
        ambassadorsAccepted: [],
        ambassadorsDeclinedWithReason: [],
        ambassadorsDeclinedWithoutReason: [],
        assignedAmbassadors: ['000000000000000000000000'],
        ambassadorIC: '000000000000000000000000',
        attire: null,
        purposeOfTour: null,
        guestProfile: null,
        checkPoints: null,
        startPoint: null,
        endPoint: null,
        remarks: null,
        office: null,
        officePhoneContact: null,
        officeEmailContact: null,
        officeLiaison: null,
        status: null,
      },
      formTitle: "Create Tour"
    };
  },

  methods: {
    //TODO: To update on email endpoint
    handleSubmitAndEmail() {
      alert("handle submit and email");
    },

    handleSubmit(e) {
      e.preventDefault();
      this.$http.post('tours', this.tour)
      .then(response => {
        this.snackbarText = response.data.message;
        this.snackbarSuccess = true;
        this.tour = Object.assign({}, this.defaultTour);
      })
      .catch((error) => {
        this.snackbarText = 'Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.'
        this.snackbarFail = true;
        console.log(error);
      })
    },

    handleCancel() {
      this.tour = Object.assign({}, this.defaultTour);
      this.snackbarText = "Your entry has been cleared.";
      this.snackbarFail = true;
    }
  }
};
</script>