<template>
  <v-card class="elevation-12 pa-2">
    <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
      <v-icon medium class="mr-2">mdi-timeline-plus</v-icon>
      {{title}}
    </div>
    <v-divider />
    <v-card-text class="mt-2">
      <v-row dense>
        <v-col cols="6" flex>
          <span class="font-weight-bold">Distribution List (To Ambassadors):</span>
          <br />
          <li v-for="item in Object.keys(ambassadors)" :key="item">{{ambassadors[item]["name"]}}</li>
        </v-col>
        <v-col v-show="type === 'Assigned'" cols="6" flex>
          <span class="font-weight-bold">Distribution List (To Office, Ambsassador IC):</span>
          <br />
          <li>{{tour.officeEmailContact}}</li>
          <span v-if="ambassadors[tour.ambassadorIC]"><li>{{ambassadors[tour.ambassadorIC]["name"]}}</li></span>
          <span v-else><li>[Deleted Ambassador</li></span>
        </v-col>
      </v-row>
      <br />
      <v-divider></v-divider>
      <br />
      <v-row dense>
        <v-col v-show="type === 'Assigned'" cols="12" flex>
          Distribution List (Others):
          <br />
          <v-select
              v-model="selectedEmails"
              label="Others"
              class="mt-5"
              prepend-icon="mdi-account-multiple-check-outline"
              name="emails"
              dense
              color="#151c55"
              multiple
              :items="emails"
            >
              <template v-slot:selection="{item, index}">
                <span v-if="index === 0" class="mr-1">{{item}}</span>
                <span v-if="index === 1" class="mr-1">, {{item}}</span>
                <span v-if="index === 2" class="mr-1">, {{item}}</span>
                <span
                  v-if="index === 3"
                  class="grey--text caption"
                >(+{{selectedEmails.length - 3}} others)</span>
              </template>
          </v-select>
        </v-col>
      </v-row>
      <br />
      <v-row flex>
        <v-form>
          <v-btn :disabled="buttonDisable" color="#151c55" small class="ma-1 white--text" @click="onSubmit(selectedEmails)">
            <v-icon class="mr-1" small>mdi-email</v-icon>Email
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
  name: "EmailForm",

  props: {
    tour: Object,
    type: String,
    onCancel: Function,
    onSubmit: Function,
    title: String,
    ambassadors: Object,
    buttonDisable: Boolean,
    emails: Array,
  },

  data() {
    return {
      selectedEmails: [],
    };
  }
};
</script>