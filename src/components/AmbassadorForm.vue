<template>
  <v-card class="elevation-12 pa-2">
    <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
      <v-icon medium class="ma-1">mdi-account-plus</v-icon>{{formTitle}}
    </div>
    <v-divider />
    <v-card-text class="mt-2">
      <v-form v-model="validated" ref="ambassadorForm">
        <v-row dense>
          <v-col cols="12" md="12">
            <input type="hidden" v-model="ambassador.ambassadorID" />
            <v-text-field
              v-model="ambassador.name"
              label="Full name"
              prepend-icon="mdi-account-tie-outline"
              name="name"
              required
              :rules="[required('Full name'), minLength('Full name', 5)]"
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="ambassador.contact"
              label="Phone contact"
              prepend-icon="mdi-phone-outline"
              name="contact"
              :rules="[required('Phone contact'), validPhone('Phone contact', 8)]"
              required
              type="number"
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="ambassador.email"
              label="Email"
              prepend-icon="mdi-email-outline"
              name="email"
              :rules="[required('Email'), validEmail('Email')]"
              required
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="ambassador.batch"
              label="Batch"
              prepend-icon="mdi-account-group-outline"
              name="batch"
              required
              :rules="[required('Batch')]"
              dense
              color="#151c55"
              :items="batches"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="ambassador.year"
              label="Year of study"
              prepend-icon="mdi-layers-outline"
              name="year"
              :rules="[required('Year of study')]"
              required
              dense
              color="#151c55"
              :items="years"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="ambassador.primaryDegree"
              label="Primary degree"
              prepend-icon="mdi-school-outline"
              name="primaryDegree"
              :rules="[required('Primary degree')]"
              required
              dense
              color="#151c55"
              :items="degrees"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="ambassador.secondaryDegree"
              label="Secondary degree"
              prepend-icon="mdi-school-outline"
              name="secondaryDegree"
              :rules="[requiredWithNA('Secondary degree'), v => v !== ambassador.primaryDegree || 'Secondary degree must not be the same as Primary degree, consider selecting N/A.']"
              required
              dense
              color="#151c55"
              :items="degrees"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="ambassador.nationality"
              label="Nationality"
              prepend-icon="mdi-map-outline"
              name="nationality"
              required
              :rules="[requiredWithOthers('Nationality')]"
              dense
              color="#151c55"
              :items="nationalities"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="ambassador.race"
              label="Race"
              prepend-icon="mdi-account-circle-outline"
              name="race"
              required
              :rules="[requiredWithOthers('Race')]"
              dense
              color="#151c55"
              :items="races"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="ambassador.gender"
              label="Gender"
              prepend-icon="mdi-gender-male-female"
              name="gender"
              :rules="[required('Gender')]"
              required
              dense
              color="#151c55"
              :items="gender"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="ambassador.currentAvailability"
              label="Current availability"
              prepend-icon="mdi-calendar-check-outline"
              name="currentAvailability"
              :rules="[requiredBoolean('Current availability')]"
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
              v-model="ambassador.unavailabilityReason"
              label="Unavailablity reason"
              prepend-icon="mdi-calendar-remove-outline"
              :rules="[requiredWithNA('Unavailability reason')]"
              name="unavailabilityReason"
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
                  v-model="ambassador.unavailabilityFrom"
                  label="Unavailable from"
                  prepend-icon="mdi-calendar-month-outline"
                  name="unavailabilityFrom"
                  required
                  readonly
                  v-on="on"
                  :rules="[required('Unavailable from')]"
                  dense
                  color="#151c55"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="ambassador.unavailabilityFrom"
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
                  v-model="ambassador.unavailabilityTo"
                  label="Unavailable to"
                  prepend-icon="mdi-calendar-month-outline"
                  name="unavailabilityTo"
                  required
                  :rules="[required('Unavailable to'), v => new Date(v) >= new Date(ambassador.unavailabilityFrom) || 'Unavailable to - date must be greater or equal to Unavailable from - date.']"
                  readonly
                  v-on="on"
                  dense
                  color="#151c55"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="ambassador.unavailabilityTo"
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
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="ambassador.mandarinProficiency"
              label="Mandarin proficiency"
              prepend-icon="mdi-ideogram-cjk-variant"
              name="mandarinProficiency"
              required
              :rules="[required('Mandarin proficiency')]"
              dense
              color="#151c55"
              :items="mandarinProficiency"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="ambassador.leadershipStatus"
              label="Leadership status"
              prepend-icon="mdi-account-star-outline"
              name="leadershipStatus"
              :rules="[requiredBoolean('Leadership status')]"
              required
              dense
              color="#151c55"
              :items="leadershipStatuses"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="ambassador.hasGraduated"
              label="Graduation status"
              prepend-icon="mdi-certificate-outline"
              name="graduationStatus"
              :rules="[requiredBoolean('Graduation status')]"
              required
              dense
              color="#151c55"
              :items="graduationStatuses"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-btn :disabled="buttonDisable" color="#151c55" small class="ma-1 white--text"
          @click="() => { if(!this.$refs.ambassadorForm.validate()) return; onSubmit() }">
          <v-icon class="mr-1" small>mdi-pencil-plus</v-icon>Confirm
        </v-btn>
        <v-btn color="error" small dark class="ma-1" @click="onCancel">
          <v-icon class="mr-1" small>mdi-close-circle</v-icon>Cancel
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import validations from '@/helpers/validations';

export default {
  name: "AmbassadorForm",

  props: {
    ambassador: Object,
    formTitle: String,
    onCancel: Function,
    onSubmit: Function,
    buttonDisable: Boolean,
  },

  data() {
    return {
      validated: true,
      required: validations.required,
      minLength: validations.minLength,
      validPhone: validations.validPhone,
      validEmail: validations.validEmail,
      requiredWithNA: validations.requiredWithNA,
      requiredWithOthers: validations.requiredWithOthers,
      requiredBoolean: validations.requiredBoolean,
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
        'People Republic of China',
        'Indian',
        'Taiwanese',
        'Indonesian',
        'Korean',
        'Thai',
        'Vietnamese',
        'Filipino',
        'Cambodian',
        'French',
        'Italian',
        'Others'
      ],
      batches: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
      years: [1,2,3,4,5],
      gender: ['M','F'],
      degrees: [
        'BAcc',
        'BBM',
        'BSc (Econ)',
        'BSc (IS) - IS',
        'BSc (IS) - SMT',
        'BSc (CS)',
        'BSc (CL)',
        'LLB',
        'BSocSc (PPS)',
        'BSocSc (PLE)',
        'BSocSc (ACM)',
        'BSocSc (PPPM)',
        'N/A'
      ],
      availabilities: [
        { 'text': 'Available', "value": true},
        { 'text': 'Not Available', "value": false},
      ],
      unavailabilityReasons:[
        'N/A',
        'Leave of Absence',
        'Overseas Exchange Programme',
        'Others',
      ],
      mandarinProficiency: ['Proficient', 'Average', 'Not Proficient'],
      leadershipStatuses: [
        { 'text': 'Cleared', 'value': true },
        { 'text': 'Not Cleared', 'value': false },
      ],
      graduationStatuses: [
        { 'text': 'Graduated', 'value': true },
        { 'text': 'Not Graduated', 'value': false },
      ],
      menu: false,
      menuTwo: false,
    };
  }
};
</script>