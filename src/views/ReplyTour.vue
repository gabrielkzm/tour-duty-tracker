<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" fluid>
          <v-img :src="require('../assets/asmu-logo-1.png')" class="my-3" contain height="150" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-card class="elevation-12 pa-2 ma-2" max-width="1000">
          <v-card-text>
            <div>Tour/UE Name:</div>
            <p class="headline text--primary">{{this.$route.query.name}}</p>
            <p>Day: {{this.$route.query.day}}</p>
            <p>Date: {{this.$route.query.date}}</p>
            <p>Start Time: {{this.$route.query.startTime}}</p>
            <p>End Time: {{this.$route.query.endTime}}</p>
            <v-divider></v-divider>
            <br />
            <div>
              <v-form>
                <v-row dense>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="name"
                      label="Name"
                      prepend-icon="mdi-account"
                      name="name"
                      required
                      dense
                      color="#151c55"
                      :items="ambassadors"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="PIN"
                      name="pin"
                      prepend-icon="mdi-lock"
                      type="password"
                      color="#151c55"
                      v-model="pin"
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="declineReason"
                      label="Reject Reason (Choose any option if accepting)"
                      prepend-icon="mdi-calendar-remove"
                      name="name"
                      required
                      dense
                      color="#151c55"
                      :items="declineReasons"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <br />
                <v-btn color="#151c55" small dark class="ma-1" @click="handleSubmit">
                  <v-icon class="mr-1" small>mdi-check-circle</v-icon>Accept Tour
                </v-btn>
                <v-btn color="error" small dark class="ma-1" @click="handleReject">
                  <v-icon class="mr-1" small>mdi-close-circle</v-icon>Reject Tour
                </v-btn>
              </v-form>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-snackbar color="success" :timeout="timeout" top v-model="snackbarSuccess">
        {{snackbarText}}
        <v-btn dark text @click="snackbarSuccess=false">Close</v-btn>
      </v-snackbar>
      <v-snackbar color="error" :timeout="timeout" top v-model="snackbarFail">
        {{snackbarText}}
        <v-btn dark text @click="snackbarFail=false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ChangePassword",

  data() {
    return {
      snackbarSuccess: false,
      snackbarFail: false,
      snackbarText: "",
      timeout: 2000,

      tourID: null,
      name: null,
      pin: null,
      declineReason: null,
      ambassadors: null,
      declineReasons: ['Class', 'Appointment', 'Meeting', 'Overseas', 'Emergency', 'Upcoming LOA or Exchange', 'Unable to speak Mandarin (Applicable only for tour hosted in Mandarin']
    };
  },

  created() {
    this.$http
      .get("/api/ambassadors/names")
      .then(response => {
        let ambassadorObjs = response.data.ambassadors;
        this.ambassadors = ambassadorObjs.map(ambassador => {
          return ambassador["name"]
        })
        this.tourID = this.$route.query.tourID
      })
      .catch(error => {
        const message =
          "Something went wrong, please contact Tours Portfolio Head/EXCO/Platform Administrator.";
        this.snackbarText = message;
        this.snackbarFail = true;
        console.log(error);
      });
  },

  methods: {
    handleReject(e) {
      e.preventDefault();

      const requestBody = {
        "name": this.name,
        "pin": this.pin,
        "declineReason": this.declineReason,
        "tourID": this.tourID
      }

      this.$http
        .put(`/api/tours/replyTour/reject`, requestBody)
        .then(response => {
          this.name = null;
          this.pin = null;
          this.declineReason = null;
          this.snackbarText = response.data.message;
          this.snackbarSuccess = true;
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.snackbarText = error.response.data.message;
          } else {
            this.snackbarText =
              "Something went wrong. Pleae contact Tours Portfolio Head/EXCO/Administrator.";
          }
          this.snackbarFail = true;
          console.log(error);
        });
    },

    handleSubmit(e) {
      e.preventDefault();

      const requestBody = {
        "name": this.name,
        "pin": this.pin,
        "declineReason": this.declineReason,
        "tourID": this.tourID
      }

      this.$http
        .put(`/api/tours/replyTour/accept`, requestBody)
        .then(response => {
          this.name = null;
          this.pin = null;
          this.declineReason = null;
          this.snackbarText = response.data.message;
          this.snackbarSuccess = true;
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.snackbarText = error.response.data.message;
          } else {
            this.snackbarText =
              "Something went wrong. Pleae contact Tours Portfolio Head/EXCO/Administrator.";
          }
          this.snackbarFail = true;
          console.log(error);
        });
    }
  }
};
</script>
