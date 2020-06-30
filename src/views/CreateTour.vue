<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <TourForm
          :buttonDisable="buttonDisable"
          :formTitle="formTitle"
          :tour="tour"
          :newTour="true"
          :onSubmitAndEmail="handleSubmitAndEmail"
          :onCancel="handleCancel"
          :onSubmit="handleSubmit"
          :ambassadors="ambassadors"
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

  created(){
    this.$http.get('ambassadors?filter[hasGraduated]=false&filter[isMinimal]=true')
      .then(
        response => {
          this.ambassadors = response.data.ambassadors.map(ambassador => {
            return {"text": ambassador.name, "value": ambassador._id}
          });
          this.ambassadors.push({"text": "N/A", 'value': "000000000000000000000000"})
          
        })
      .catch(error => {
        const message = 'Something went wrong, please contact Tours Portfolio Head/EXCO/Platform Administrator.';
        this.snackbarText = message;
        this.snackbarFail = true;
        console.log(error);
      })
  },

  data() {
    return {
      buttonDisable: false,
      ambassadors: [],
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
        type: "TOUR",
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
        status: " Initiated",
        urgentTour: false,
        requireMandarin: false,
      },
      defaultTour: {
        tourID: null,
        name: null,
        date: null,
        startTime: null,
        endTime: null,
        type: "TOUR",
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
        urgentTour: false,
        requireMandarin: false,
      },
      formTitle: "Create Tour"
    };
  },

  methods: {
    //TODO: To update on email endpoint
    handleSubmitAndEmail() {
      alert("handle submit and email");
    },

    handleSubmit() {
      this.buttonDisable = true;
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
      .then( () => {
        this.buttonDisable = false;
      });
    },

    handleCancel() {
      this.tour = Object.assign({}, this.defaultTour);
      this.snackbarText = "Your entry has been cleared.";
      this.snackbarFail = true;
    }
  }
};
</script>