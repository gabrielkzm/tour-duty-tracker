<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card class="elevation-12 pa-2 ma-2">
          <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
            <v-icon medium class="mr-2">mdi-account-plus</v-icon>Create Ambassador
          </div>
          <v-divider />
          <v-card-text>
            <v-form>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="First name"
                    prepend-icon="mdi-account-tie-outline"
                    name="firstName"
                    required
                    dense
                    color="#151c55"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Last name"
                    prepend-icon="mdi-account-tie-outline"
                    name="lastName"
                    required
                    dense
                    color="#151c55"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Batch"
                    prepend-icon="mdi-account-group-outline"
                    name="batch"
                    required
                    dense
                    color="#151c55"
                    :items="batches"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Year of study"
                    prepend-icon="mdi-layers-outline"
                    name="yearOfStudy"
                    required
                    dense
                    color="#151c55"
                    :items="years"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Primary degree"
                    prepend-icon="mdi-school-outline"
                    name="primaryDegree"
                    required
                    dense
                    color="#151c55"
                    :items="degrees"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Secondary degree"
                    prepend-icon="mdi-school-outline"
                    name="secondaryDegree"
                    required
                    dense
                    color="#151c55"
                    :items="degrees"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Nationality"
                    prepend-icon="mdi-map-outline"
                    name="nationality"
                    required
                    dense
                    color="#151c55"
                    :items="nationalities"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Race"
                    prepend-icon="mdi-account-circle-outline"
                    name="race"
                    required
                    dense
                    color="#151c55"
                    :items="races"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Current availability"
                    prepend-icon="mdi-calendar-check-outline"
                    name="currentAvailability"
                    required
                    dense
                    color="#151c55"
                    :items="availabilities"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row dense>
                
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Unavailablity reason"
                    prepend-icon="mdi-calendar-remove-outline"
                    name="unavailabilityReasons"
                    required
                    dense
                    color="#151c55"
                    :items="unavailabilityReasons"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dateFrom"
                        label="Unavailable from"
                        prepend-icon="mdi-calendar-month-outline"
                        name="unavailabilityFrom"
                        required
                        v-on="on"
                        dense
                        color="#151c55"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dateFrom"
                      show-current
                      no-title
                      scrollable
                      @input="menu = false"
                      color="#7a6c4b"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="4">
                  <v-menu
                    v-model="menuTwo"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dateTo"
                        label="Unavailable to"
                        prepend-icon="mdi-calendar-month-outline"
                        name="unavailabilityTo"
                        required
                        v-on="on"
                        dense
                        color="#151c55"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dateTo"
                      show-current
                      no-title
                      scrollable
                      @input="menuTwo = false"
                      color="#7a6c4b"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Mandarin proficiency"
                    prepend-icon="mdi-ideogram-cjk-variant"
                    name="mandarinProficiency"
                    required
                    dense
                    color="#151c55"
                    :items="mandarinProficiency"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Leadership status"
                    prepend-icon="mdi-account-star-outline"
                    name="leadershipStatus"
                    required
                    dense
                    color="#151c55"
                    :items="leadershipStatuses"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Tour count"
                    prepend-icon="mdi-counter"
                    name="tourCount"
                    dense
                    color="#151c55"
                    value="0"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Event count"
                    value="0"
                    prepend-icon="mdi-counter"
                    name="eventCount"
                    dense
                    color="#151c55"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-btn color="#151c55" small dark class="ma-1">
                <v-icon class="mr-1" small>mdi-pencil-plus</v-icon>Create
              </v-btn>
              <v-btn color="error" small dark class="ma-1">
                <v-icon class="mr-1" small>mdi-close-circle</v-icon>Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CreateAmbassador",

  data() {
    return {
      tourTypes: ["TOUR", "UE"],
      races: [
        'Chinese',
        'Malay',
        'Indian',
        'Eurasian',
        'Others'
      ],
      nationalities: [
        'Singaporean',
        'Malaysian',
        'Indian',
        'Chinese',
        'Indonesian'
      ],
      batches: [14,15,16,17,18],
      degrees: [
        'LKSCB',
        'SIS - CS',
        'SIS - IS(IS)',
        'SIS - IS(SMT)',
        'SOE',
        'SOSS - SOSS',
        'SOSS - PLE',
        'SOA',
        'SOL',
        'N/A'
      ],
      availabilities: [
        'Available',
        'Not Available'
      ],
      unavailabilityReasons:[
        'N/A',
        'LOA',
        'Overseas Exchange',
        'Others',
      ],
      mandarinProficiency: ['Proficient', 'Average', 'Not proficient'],
      leadershipStatuses: ['Cleared', 'Not cleared'],
      dateTo: new Date().toISOString().substr(0, 10),
      dateFrom: new Date().toISOString().substr(0, 10),
      menu: false,
      menuTwo: false,
    };
  }
};
</script>