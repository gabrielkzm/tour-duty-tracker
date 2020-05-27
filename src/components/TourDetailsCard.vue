<template>
  <v-card class="pt-3">
    <v-card-text>
      <div class="mb-1 font-weight-bold">Tour Details:</div>
      <p class="title text-capitalize" style="color:#978c69">{{tour.name}}</p>
      <div class="text--primary">
        <v-row v-show="replyDetails">
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-text-box-check</v-icon>
              Accepted:
            </span>
            <div class="ml-5">
              <li v-for="item in tour.ambassadorsAccepted" :key="item">
                <span v-if="ambassadors[item]" >{{ambassadors[item]["name"]}}</span>
                <span v-else>[Deleted Ambassador]</span>
              </li>
            </div>
          </v-col>
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-text-box</v-icon>
              Declined with reason:
            </span>
            <div class="ml-5">
              <li v-for="item in tour.ambassadorsDeclinedWithReason" :key="item">
                <span v-if="ambassadors[item]" >{{ambassadors[item]["name"]}}</span>
                <span v-else>[Deleted Ambassador]</span>
              </li>
            </div>
          </v-col>
        </v-row>
        <v-row v-show="replyDetails">
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-text-box-remove</v-icon>
              Declined without reason / No Reason:
            </span>
            <div class="ml-5">
              <li v-for="item in tour.ambassadorsDeclinedWithoutReason" :key="item">
                <span v-if="ambassadors[item]" >{{ambassadors[item]["name"]}}</span>
                <span v-else>[Deleted Ambassador]</span>
              </li>
            </div>
          </v-col>
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-text-box-remove</v-icon>
              Have not responded:
            </span>
            <div class="ml-5">
              <li v-for="item in ambassadorsHaveNotResponded" :key="item">
                <span v-if="ambassadors[item]" >{{ambassadors[item]["name"]}}</span>
                <span v-else>[Deleted Ambassador]</span>
              </li>
            </div>
          </v-col>
        </v-row>
        <v-row v-show="assignmentDetails">
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-account-multiple-check</v-icon>
              Assigned:
            </span>
            <div class="ml-5">
              <li v-for="item in tour.assignedAmbassadors" :key="item">
                <span v-if="ambassadors[item]" >{{ambassadors[item]["name"]}}</span>
                <span v-else>[Deleted Ambassador]</span>
              </li>
            </div>
          </v-col>
          <v-col md="6">
            <span class="font-weight-bold"><v-icon small>mdi-account-star</v-icon> I/C: </span>
            <span v-if="ambassadors[tour.ambassadorIC]">{{ambassadors[tour.ambassadorIC]["name"]}}</span>
            <span v-else>[Deleted Ambassador]</span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-format-list-text</v-icon>
              Guest Profile: 
            </span>
            {{tour.guestProfile}}
          </v-col>
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-account</v-icon>
              Liaison: 
            </span>
            {{tour.officeLiaison}}
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-office-building</v-icon>
              Office: 
            </span>
            {{tour.office}}
          </v-col>
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-clipboard-list</v-icon>
              Type: 
            </span>
            {{tour.type}}
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="6">
            <span class="font-weight-bold"> 
              <v-icon small>mdi-account-group</v-icon>
              No. of Guests: 
            </span>
            {{tour.numberOfGuests}}
          </v-col>
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-account-tie</v-icon>
              No. of Ambassadors: 
            </span>
            {{tour.numberOfAmbassadorsRequired}}
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-home-map-marker</v-icon>
              Start Point: 
            </span>
            {{tour.startPoint}}
          </v-col>
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-map-marker-check</v-icon>
              End Point: 
            </span>
            {{tour.endPoint}}
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="6">
            <span class="font-weight-bold">
              <v-icon small>mdi-tshirt-crew</v-icon>
              Attire: 
            </span>
            {{tour.attire}}
          </v-col>
          <v-col md="6">
            <span v-show="tour.urgentTour">
              <v-icon small>mdi-exclamation</v-icon>
              <span class="font-weight-bold"> Urgent Tour: </span> Yes
            </span>
            <span v-show="!tour.urgentTour">
              <v-icon small>mdi-exclamation</v-icon>
              <span class="font-weight-bold"> Urgent Tour: </span> No
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="12">
            <span v-show="tour.requireMandarin">
              <v-icon small>mdi-ideogram-cjk-variant</v-icon>
              <span class="font-weight-bold"> Mandarin Tour: </span> Yes
            </span>
            <span v-show="!tour.requireMandarin">
              <v-icon small>mdi-ideogram-cjk-variant</v-icon>
              <span class="font-weight-bold"> Mandarin Tour: </span> No
            </span>
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="12">
            <span class="font-weight-bold">
              <v-icon small>mdi-phone</v-icon>
              Office Contact #1: 
            </span>
            {{tour.officePhoneContact}}, {{tour.officeEmailContact}}
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="12">
            <span class="font-weight-bold">
              <v-icon small>mdi-map-marker-multiple</v-icon>
              Checkpoints: 
            </span>
            {{tour.checkPoints.join(', ')}}
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="12">
            <span class="font-weight-bold">
              <v-icon small>mdi-information-variant</v-icon>
              Purpose: 
            </span>
            {{tour.purposeOfTour.join(', ')}}
          </v-col>
        </v-row>
        <v-row v-show="generalDetails">
          <v-col md="12">
            <span class="font-weight-bold">
              <v-icon small>mdi-comment-text-outline</v-icon>
              Remarks: 
            </span>
            {{tour.remarks}}
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
    replyDetails: Boolean,
    ambassadors: Object,
    ambassadorsHaveNotResponded: Array,
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