<template>
    <v-card class="pt-3">
      <v-card-text>
        <div class="mb-1">Ambassador Details:</div>
        <p class="title text-capitalize" style="color:#978c69">{{ambassador.name}}</p>
        <div class="text--primary">
          <v-row v-show="!unavailablityDetails">
            <v-col md="6">
              <span><v-icon small>mdi-gender-male-female</v-icon> Gender: {{ambassador.gender}}</span>
            </v-col>
            <v-col md="6">
              <span><v-icon small>mdi-account-circle</v-icon> Race: {{ambassador.race}}</span>
            </v-col>
          </v-row>
          <v-row v-show="!unavailablityDetails">
            <v-col md="6">
              <span><v-icon small>mdi-map</v-icon> Nationality: {{ambassador.nationality}}</span>
            </v-col>
            <v-col md="6">
              <span><v-icon small>mdi-certificate-outline</v-icon> Graduated: {{ambassador.hasGraduated}}</span>
            </v-col>
          </v-row>
          <v-row v-show="!unavailablityDetails">
            <v-col md="12">
              <span><v-icon small>mdi-phone</v-icon> Contact: {{ambassador.contact}}</span>
            </v-col>
          </v-row>
          <v-row v-show="!unavailablityDetails">
            <v-col md="12">
              <span><v-icon small>mdi-email</v-icon> Email: {{ambassador.email}}</span>
            </v-col>
          </v-row>
          <v-row v-show="unavailablityDetails">
            <v-col md="12">
              <span v-if="ambassador.currentAvailability === 'Not Available'">
                <v-icon small>mdi-calendar-check-outline</v-icon> Availablity: Not Available
              </span>
              <span v-else>
                <v-icon small>mdi-calendar-check-outline</v-icon> Availablity: Available
              </span>
            </v-col>
          </v-row>
          <v-row v-show="unavailablityDetails">
            <v-col md="12">
              <span><v-icon small>mdi-calendar-remove-outline</v-icon> Reasons: {{ambassador.unavailabilityReason}}</span>
            </v-col>
          </v-row>
          <v-row v-show="unavailablityDetails">
            <v-col md="6">
              <span><v-icon small>mdi-calendar-month-outline</v-icon> Reasons: {{ambassador.unavailabilityFrom}}</span>
            </v-col>
            <v-col md="6">
              <span><v-icon small>mdi-calendar-month-outline</v-icon> Reasons: {{ambassador.unavailabilityTo}}</span>
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
  name: "AmbassadorDetailsCard",
  props: {
    ambassador: Object,
    onClose: Function,
    unavailablityDetails: Boolean,
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