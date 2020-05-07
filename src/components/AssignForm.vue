<template>
  <v-card class="elevation-12 pa-2">
    <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
      <v-icon medium class="mr-2">mdi-timeline-plus</v-icon>Assign Ambassadors
    </div>
    <v-divider />
    <v-card-text class="mt-2">
      <v-row>
        <v-col flex>Current Assigned Ambassador(s): {{tour.assignedAmbassadors.toString()}}</v-col>
      </v-row>
      <v-row dense>
        <v-col flex>Current Ambasador IC: {{tour.ambassadorIC}}</v-col>
      </v-row>
      <br />
      <v-divider></v-divider>
      <v-row dense>
        <v-col cols="12" flex>
            Select Ambassadors for Assignment (Manual Only):
            <br />
            <v-select
              v-model="selectedAmbassadors"
              label="Assigned ambassador(s)"
              class="mt-5"
              prepend-icon="mdi-account-multiple-check-outline"
              name="assignedAmbassadors"
              dense
              color="#151c55"
              multiple
              :items="tour.ambassadorsAccepted"
            >
              <template v-slot:selection="{item, index}">
                <span v-if="index === 0" class="mr-1">{{item}}</span>
                <span v-if="index === 1" class="mr-1">, {{item}}</span>
                <span v-if="index === 2" class="mr-1">, {{item}}</span>
                <span
                  v-if="index === 3"
                  class="grey--text caption"
                >(+{{tour.assignedAmbassadors.length - 3}} others)</span>
              </template>
            </v-select>
          </v-col>
      </v-row>
      <br />
      <v-row flex>
        <v-form>
          <v-btn color="#151c55" small dark class="ma-1" @click="onSubmitManually(selectedAmbassadors)">
            <v-icon class="mr-1" small>mdi-pencil-plus</v-icon>Assign Manually
          </v-btn>
          <v-btn v-show="tour.numberOfAmbassadorsRequired <= tour.ambassadorsAccepted.length" color="#151c55" small dark class="ma-1" @click="onSubmitAutomatically">
            <v-icon class="mr-1" small>mdi-pencil-plus</v-icon>Assign Automatically
          </v-btn>
          <v-btn color="error" small dark class="ma-1" @click="onCancel">
            <v-icon class="mr-1" small>mdi-close-circle</v-icon>Cancel
          </v-btn>
        </v-form>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AssignForm",

  props: {
    tour: Object,
    onCancel: Function,
    onSubmitAutomatically: Function,
    onSubmitManually: Function
  },

  data() {
    return {
      selectedAmbassadors: []
    };
  }
};
</script>