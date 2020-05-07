<template>
  <v-card class="pt-3">
    <v-card-text>
      <div class="mb-1">Tour Details:</div>
      <p class="title text-capitalize" style="color:#978c69">{{tour.name}}</p>
      <div class="text--primary">
        <v-row v-show="replyDetails">
          <v-col md="6">
            <span>
              <v-icon small>mdi-text-box-check</v-icon>
              Accepted:
            </span>
            <div class="ml-5">
              <li v-for="item in tour.ambassadorsAccepted" :key="item">{{item}}</li>
            </div>
          </v-col>
          <v-col md="6">
            <span>
              <v-icon small>mdi-text-box</v-icon>
              Declined with reason:
            </span>
            <div class="ml-5">
              <li v-for="item in tour.ambassadorsDeclinedWithReason" :key="item">{{item}}</li>
            </div>
          </v-col>
        </v-row>
        <v-row v-show="replyDetails">
          <v-col md="12">
            <span>
              <v-icon small>mdi-text-box-remove</v-icon>
              Declined without reason / No Reason:
            </span>
            <div class="ml-5">
              <li v-for="item in tour.ambassadorsDeclinedWithoutReason" :key="item">{{item}}</li>
            </div>
          </v-col>
        </v-row>
        <v-row v-show="assignmentDetails">
          <v-col md="6">
            <span>
              <v-icon small>mdi-account-multiple-check</v-icon>
              Assigned:
            </span>
            <div class="ml-5">
              <li v-for="item in tour.assignedAmbassadors" :key="item">{{item}}</li>
            </div>
          </v-col>
          <v-col md="6">
            <span>
              <v-icon small>mdi-account-star</v-icon>
              I/C: {{tour.ambassadorIC}}
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="6">
            <span>
              <v-icon small>mdi-format-list-text</v-icon>
              Guest Profile: {{tour.guestProfile}}
            </span>
          </v-col>
          <v-col md="6">
            <span>
              <v-icon small>mdi-account</v-icon>
              Liaison: {{tour.officeLiaison}}
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="6">
            <span>
              <v-icon small>mdi-office-building</v-icon>
              Office: {{tour.office}}
            </span>
          </v-col>
          <v-col md="6">
            <span>
              <v-icon small>mdi-clipboard-list</v-icon>
              Type: {{tour.type}}
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="6">
            <span>
              <v-icon small>mdi-account-group</v-icon>
              No. of Guests: {{tour.numberOfGuests}}
            </span>
          </v-col>
          <v-col md="6">
            <span>
              <v-icon small>mdi-account-tie</v-icon>
              No. of Ambassadors: {{tour.numberOfAmbassadorsRequired}}
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="6">
            <span>
              <v-icon small>mdi-home-map-marker</v-icon>
              Start Point: {{tour.startPoint}}
            </span>
          </v-col>
          <v-col md="6">
            <span>
              <v-icon small>mdi-map-marker-check</v-icon>
              End Point: {{tour.endPoint}}
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="12">
            <span>
              <v-icon small>mdi-tshirt-crew</v-icon>
              Attire: {{tour.attire}}
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="12">
            <span>
              <v-icon small>mdi-phone</v-icon>
              Office Contact #1: {{tour.officePhoneContact}}, {{tour.officeEmailContact}}
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="12">
            <span>
              <v-icon small>mdi-map-marker-multiple</v-icon>
              Checkpoints: {{tour.checkPoints.toString()}}
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="12">
            <span>
              <v-icon small>mdi-information-variant</v-icon>
              Purpose: {{tour.purposeOfTour.toString()}}
            </span>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="onClose" text color="#978c69">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "TourDetailsCard",
  props: {
    tour: Object,
    onClose: Function,
    assignmentDetails: Boolean,
    generalDetails: Boolean,
    replyDetails: Boolean
  },

  data() {
    return {};
  }
};
</script>

<style scoped>
.smuColorGold {
  color: #8a704c;
}
.smuColorBlue {
  color: #151c55;
}
.asmuColorOne {
  color: #7a6c4b;
}
.asmuColorTwo {
  color: #978c69;
}
</style>