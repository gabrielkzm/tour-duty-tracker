<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card class="elevation-12 pa-2 ma-2">
          <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
            <v-icon medium class="mr-2">mdi-calendar-plus</v-icon>Create Tour
          </div>
          <v-divider />
          <v-card-text>
            <v-form>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Tour name"
                    prepend-icon="mdi-card-account-details-outline"
                    name="tourName"
                    required
                    dense
                    color="#151c55"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    label="Type"
                    prepend-icon="mdi-clipboard-list-outline"
                    name="type"
                    required
                    dense
                    color="#151c55"
                    :items="tourTypes"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" md="3">
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date"
                        label="Tour date"
                        prepend-icon="mdi-calendar-month-outline"
                        name="tourDate"
                        readonly
                        v-on="on"
                        required
                        dense
                        color="#151c55"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      show-current
                      no-title
                      scrollable
                      @input="menu = false"
                      color="#7a6c4b"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    type="time"
                    label="Start time"
                    prepend-icon="mdi-clock-start"
                    name="startTime"
                    required
                    dense
                    color="#151c55"                   
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Duration"
                    type="number"
                    suffix="minutes"
                    prepend-icon="mdi-clock-end"
                    name="duration"
                    required
                    dense
                    color="#151c55"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                    <v-select
                      v-model="tourPurposeSelection"
                      label="Tour purpose"
                      prepend-icon="mdi-information-variant"
                      name="purposeOfTour"
                      required
                      dense
                      color="#151c55"
                      multiple
                      :items="purposeOfTour"
                  >
                    <template v-slot:selection="{item, index}">
                      <span v-if="index === 0" class="mr-1">{{item}}</span>
                      <span v-if="index === 1" class="grey--text caption">(+{{tourPurposeSelection.length - 1}} others)</span>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="No. of guests"
                    prepend-icon="mdi-account-group-outline"
                    type="number"
                    name="numberOfGuests"
                    required
                    dense
                    color="#151c55"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Guest profile"
                    prepend-icon="mdi-format-list-text"
                    name="guestProfile"
                    required
                    dense
                    color="#151c55"
                    :items="guestProfiles"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="No. of ambassadors"
                    prepend-icon="mdi-account-tie-outline"
                    name="numberOfAmbassadors"
                    type="number"
                    required
                    dense
                    color="#151c55"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Attire"
                    prepend-icon="mdi-tshirt-crew-outline"
                    name="attire"
                    required
                    dense
                    color="#151c55"
                    :items="attire"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Checkpoint(s)"
                    prepend-icon="mdi-map-marker-multiple-outline"
                    name="checkPoints"
                    required
                    dense
                    color="#151c55"
                    :items="checkpoints"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4">
                  <v-combobox
                    label="Start location"
                    prepend-icon="mdi-home-map-marker"
                    name="startLocation"
                    :items="checkpoints"
                    required
                    dense
                    color="#151c55"
                  ></v-combobox>
                </v-col>
                <v-col cols="12" md="4">
                  <v-combobox
                    :items="checkpoints"
                    label="End location"
                    prepend-icon="mdi-map-marker-check-outline"
                    name="endLocation"
                    required
                    dense
                    color="#151c55"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-select
                      v-model="ambassadorsSelection"
                      label="Assigned ambassador(s)"
                      prepend-icon="mdi-account-multiple-check-outline"
                      name="assignedAmbassadors"
                      dense
                      color="#151c55"
                      multiple
                      :items="ambassadors"
                  >
                    <template v-slot:selection="{item, index}">
                      <span v-if="index === 0" class="mr-1">{{item}}</span>
                      <span v-if="index === 1" class="mr-1">, {{item}}</span>
                      <span v-if="index === 2" class="mr-1">, {{item}}</span>
                      <span v-if="index === 3" class="grey--text caption">(+{{ambassadorsSelection.length - 3}} others)</span>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-autocomplete
                    label="Ambassador IC"
                    prepend-icon="mdi-account-star-outline"
                    name="ambassadorIC"
                    dense
                    color="#151c55"
                    :items="ambassadors"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Remarks"
                    prepend-icon="mdi-comment-text-outline"
                    name="remarks"
                    dense
                    color="#151c55"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" md="3">
                  <v-autocomplete
                    label="Office"
                    prepend-icon="mdi-office-building"
                    name="office"
                    required
                    dense
                    color="#151c55"
                    :items="offices"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Liaison name"
                    prepend-icon="mdi-account-outline"
                    name="liaisonName"
                    required
                    dense
                    color="#151c55"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Liaison contact"
                    prepend-icon="mdi-phone-outline"
                    name="liaisonContact"
                    dense
                    color="#151c55"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Liaison email"
                    prepend-icon="mdi-email-outline"
                    name="liaisonEmail"
                    required
                    dense
                    color="#151c55"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-btn color="#151c55" small dark class="ma-1">
                <v-icon class="mr-1" small>mdi-pencil-plus</v-icon>Create Tour
              </v-btn>
              <v-btn color="#151c55" small dark class="ma-1">
                <v-icon class="mr-1" small>mdi-pencil-plus</v-icon>Create Tour and Email
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
  name: "CreateTour",

  data() {
    return {
      tourTypes: ["TOUR", "UE"],
      purposeOfTour: [
        'Donor related',
        'Entrepreneurship',
        'Learning pedagogy',
        'Partnerships',
        'School facilities',
        'Ushering duty',
        'Others'],
      guestProfiles: [
        'Students',
        'Parents',
        'Donors',
        'Faculty',
        'Corporate',
        'Government',
      ],
      attire: [
        'Polo T-Shirt',
        'Suit'
      ],
      checkpoints: [
        'Admin Building',
        'LKS Library',
        'SMU Connexion',
        'KGC Library',
        'LKSCB',
        'SIS',
        'SOE',
        'SOSS',
        'SOA',
        'SOL',
        'Concourse',
        'Campus Green'
      ],
      ambassadors: [
        'Gabriel',
        'Louis',
        'Wei Hao',
        'Nigel',
        'John Doe'
      ],
      offices:[
        'OUAFA',
        'IO',
        'SIS',
        'SOE',
        'SOSS',
        'SOA',
        'SOL',
        'LKCSB',
      ],
      ambassadorsSelection: [],
      tourPurposeSelection: [],
      date: new Date().toISOString().substr(0, 10),
      menu: false
    };
  }
};
</script>