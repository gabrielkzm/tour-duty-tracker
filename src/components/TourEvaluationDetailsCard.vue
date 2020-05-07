<template>
    <v-card class="pt-3">
      <v-card-text>
        <div class="mb-1">Ambassador Details:</div>
        <p class="title text-capitalize" style="color:#978c69">{{tourEvaluationDetails.name}}</p>
        <div class="text--primary">
          <v-row>
            <v-col md="6">
              <span><v-icon small>mdi-bullseye-arrow</v-icon> Final Score: {{tourEvaluationDetails.finalScore}}</span>
            </v-col>
            <v-col md="6">
              <span class="text-capitalize"><v-icon small>mdi-clipboard-list-outline</v-icon> Pass/Fail: {{tourEvaluationDetails.passOrFail}}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="12">
              <span><v-icon small>mdi-calendar-multiple</v-icon> Tours Conducted:</span>
              <div class="ml-5">
                <li v-for="item in tourEvaluationDetails.toursConducted" :key="item">{{item}}</li>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="12">
              <span><v-icon small>mdi-calendar-remove-outline</v-icon> Deductions:</span>
              <div class="ml-5">
                <li v-for="item in tourEvaluationDetails.toursDeductions" :key="item">{{item}}</li>
              </div>
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
  name: "TourEvaluationDetailsCard",
  props: {
    tourEvaluationDetails: Object,
    onClose: Function,
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