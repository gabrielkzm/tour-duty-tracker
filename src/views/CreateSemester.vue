<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 pa-2 ma-2">
          <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
            <v-icon medium class="mr-2">mdi-timeline-plus</v-icon>Create Semester
          </div>
          <v-divider />
          <v-card-text>
            <v-form>
              <v-row dense>
                <v-col cols="12">
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
                        label="Start Date"
                        prepend-icon="mdi-calendar-arrow-left"
                        name="startDate"
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
              </v-row>
              <v-row dense>              
                <v-col cols="12">
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
                        label="End date"
                        prepend-icon="mdi-calendar-arrow-right"
                        name="endDate"
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