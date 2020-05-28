<template>
  <v-card class="elevation-12 pa-2">
    <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
      <v-icon medium class="ma-1">mdi-calendar-plus</v-icon>
      {{formTitle}}
    </div>
    <v-divider />
    <v-card-text class="mt-2">
      <v-form v-model="validated" ref="tourForm">
        <v-row dense>
          <v-col cols="12" md="4">
            <input type="hidden" v-model="tour.tourID" />
            <v-text-field
              v-model="tour.name"
              label="Tour name"
              prepend-icon="mdi-card-account-details-outline"
              name="tourName"
              required
              :rules="[required('Tour name'), minLength('Tour name', 5)]"
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="tour.type"
              label="Type"
              prepend-icon="mdi-clipboard-list-outline"
              name="type"
              required
              :rules="[required('Type')]"
              dense
              color="#151c55"
              :items="tourTypes"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="tour.status"
              label="Status"
              prepend-icon="mdi-order-bool-descending"
              name="status"
              :rules="[required('Status')]"
              required
              dense
              color="#151c55"
              :items="statuses"
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
                  v-model="tour.date"
                  label="Tour date"
                  prepend-icon="mdi-calendar-month-outline"
                  name="tourDate"
                  readonly
                  :rules="[required('Tour date')]"
                  v-on="on"
                  required
                  dense
                  color="#151c55"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="tour.date"
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
              v-model="tour.startTime"
              type="time"
              label="Start time"
              :rules="[required('Start time')]"
              prepend-icon="mdi-clock-start"
              name="startTime"
              required
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="tour.endTime"
              type="time"
              label="End Time"
              :rules="[required('End time')]"
              prepend-icon="mdi-clock-end"
              name="endTime"
              required
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="tour.purposeOfTour"
              label="Tour purpose"
              prepend-icon="mdi-information-variant"
              name="purposeOfTour"
              :rules="[required('Tour purpose')]"
              required
              dense
              color="#151c55"
              multiple
              :items="purposeOfTour"
            >
              <template v-slot:selection="{item, index}">
                <span v-if="index === 0" class="mr-1">{{item}}</span>
                <span
                  v-if="index === 1"
                  class="grey--text caption"
                >(+{{tour.purposeOfTour.length - 1}} others)</span>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="tour.numberOfGuests"
              label="No. of guests"
              prepend-icon="mdi-account-group-outline"
              :rules="[required('No. of guests')]"
              type="number"
              name="numberOfGuests"
              required
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="tour.guestProfile"
              label="Guest profile"
              prepend-icon="mdi-format-list-text"
              :rules="[required('Guest profile')]"
              name="guestProfile"
              required
              dense
              color="#151c55"
              :items="guestProfiles"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="tour.numberOfAmbassadorsRequired"
              label="No. of ambassadors"
              prepend-icon="mdi-account-tie-outline"
              name="numberOfAmbassadors"
              :rules="[required('No. of ambassadors')]"
              type="number"
              required
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="tour.attire"
              label="Attire"
              prepend-icon="mdi-tshirt-crew-outline"
              name="attire"
              :rules="[required('Attire')]"
              required
              dense
              color="#151c55"
              :items="attire"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="tour.requireMandarin"
              label="Mandarin tour"
              prepend-icon="mdi-ideogram-cjk-variant"
              name="requireMandarin"
              :rules="[requiredBoolean('Mandarin tour')]"
              required
              dense
              color="#151c55"
              :items="requireMandarinSelection"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="tour.checkPoints"
              label="Checkpoint(s)"
              prepend-icon="mdi-map-marker-multiple-outline"
              name="checkPoints"
              :rules="[required('Checkpoint(s)')]"
              required
              dense
              color="#151c55"
              multiple
              :items="checkpoints"
            >
              <template v-slot:selection="{item, index}">
                <span v-if="index === 0" class="mr-1">{{item}}</span>
                <span
                  v-if="index === 1"
                  class="grey--text caption"
                >(+{{tour.checkPoints.length - 1}} others)</span>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-combobox
              v-model="tour.startPoint"
              label="Start location"
              prepend-icon="mdi-home-map-marker"
              :rules="[required('Start location')]"
              name="startLocation"
              :items="checkpoints"
              required
              dense
              color="#151c55"
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="3">
            <v-combobox
              v-model="tour.endPoint"
              :items="checkpoints"
              label="End location"
              :rules="[required('End location')]"
              prepend-icon="mdi-map-marker-check-outline"
              name="endLocation"
              required
              dense
              color="#151c55"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-select
              v-model="tour.assignedAmbassadors"
              label="Assigned ambassador(s)"
              prepend-icon="mdi-account-multiple-check-outline"
              name="assignedAmbassadors"
              :rules="[required('Assigned ambassador(s)')]"
              dense
              color="#151c55"
              multiple
              :items="ambassadors"
            >
              <template v-slot:selection="{item, index}">
                <span v-if="index === 0" class="mr-1">{{item.text}}</span>
                <span v-if="index === 1" class="mr-1">, {{item.text}}</span>
                <span v-if="index === 2" class="mr-1">, {{item.text}}</span>
                <span
                  v-if="index === 3"
                  class="grey--text caption"
                >(+{{tour.assignedAmbassadors.length - 3}} others)</span>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="tour.ambassadorIC"
              label="Ambassador IC"
              prepend-icon="mdi-account-star-outline"
              :rules="[required('Ambassador IC')]"
              name="ambassadorIC"
              dense
              color="#151c55"
              :items="ambassadors"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="tour.remarks"
              label="Remarks"
              prepend-icon="mdi-comment-text-outline"
              name="remarks"
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="tour.urgentTour"
              label="Urgent tour"
              prepend-icon="mdi-exclamation"
              :rules="[requiredBoolean('Urgent tour')]"
              name="urgentTour"
              required
              dense
              color="#151c55"
              :items="urgentTourSelection"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="tour.office"
              label="Office"
              prepend-icon="mdi-office-building"
              :rules="[required('Office')]"
              name="office"
              required
              dense
              color="#151c55"
              :items="offices"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="tour.officeLiaison"
              label="Liaison name"
              :rules="[required('Liaison name')]"
              prepend-icon="mdi-account-outline"
              name="liaisonName"
              required
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="tour.officePhoneContact"
              label="Liaison contact"
              prepend-icon="mdi-phone-outline"
              :rules="[required('Liaison contact'), validPhone('Liaison contact', 8)]"
              name="liaisonContact"
              dense
              color="#151c55"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="tour.officeEmailContact"
              label="Liaison email"
              prepend-icon="mdi-email-outline"
              name="liaisonEmail"
              :rules="[required('Liaison Email'), validEmail('Liaison Email')]"
              required
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn :disabled="buttonDisable" color="#151c55" small class="ma-1 white--text" 
          @click="() => { if(!this.$refs.tourForm.validate()) return; onSubmit() }">
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
  name: "TourForm",

  props: {
    tour: Object,
    formTitle: String,
    newTour: Boolean,
    onSubmitAndEmail: Function,
    onCancel: Function,
    onSubmit: Function,
    ambassadors: Array,
    buttonDisable: Boolean,
  },

  data() {
    return {
      validated: true,
      statuses: ["Initiated", "Announced", "Assigned", "Confirmed"],
      required: validations.required,
      minLength: validations.minLength,
      requiredBoolean: validations.requiredBoolean,
      validPhone: validations.validPhone,
      validEmail: validations.validEmail,
      tourTypes: ["TOUR", "UE"],
      purposeOfTour: [
        "Donor Related",
        "Entrepreneurship",
        "Learning Pedagogy",
        "Partnerships",
        "Facility Visits",
        "Others"
      ],
      guestProfiles: [
        "Students",
        "Parents",
        "Donors",
        "Faculty",
        "Corporate",
        "Government"
      ],
      attire: ["ASMU Polo T-Shirt", "ASMU Suit"],
      checkpoints: [
        "Admin Building",
        "Big Steps",
        "Campus Green",
        "Gymnasium",
        "Kwa Geok Choo Law Library",
        "Li Ka Shing Library",
        "SMU Connexion",
        "T-Junction",
        "The SMU Shop",
        "Wall of Fame",
        "School of Business",
        "School of Information Systems",
        "School of Economics",
        "School of Social Sciences",
        "School of Law",
        "School of Accountancy",
        "Pending",
      ],
      urgentTourSelection:[
        {"text": "Yes", "value": true},
        {"text": "No", "value": false}
      ],
      requireMandarinSelection:[
        {"text": "Yes", "value": true},
        {"text": "No", "value": false}
      ],
      offices: [
        "Office of Advancement",
        "Office of Business Development",
        "Office of Campus Infrastructure and Services",
        "Office of Undergraduate Admissions & Financial Assistance",
        "Office of Corporate Communications and Marketing",
        "Office of Dean of Students",
        "Office of Human Resources & Faculty Administration",
        "Office of Internal Audit",
        "Office of Legal & General Affairs",
        "Office of Postgraduate Research Programmes",
        "Office of Research & Tech Transfer",
        "Office of SMU Academy",
        "Office of SMU International Office",
        "Office of Student Life",
        "Office of Alumni Relations",
        "Office of Business Improvement",
        "Office of Core Curriculum",
        "Office of Dato' Kho Hui Meng Career Centre",
        "Office of Finance",
        "Office of Integrated Information Technology Services",
        "Office of Investment",
        "Office of Postgraduate Professional Programmes",
        "Office of Registrar",
        "Office of Safety & Security",
        "Office of SMU Executive Development",
        "Office of SMU Institutional Review Board",
        "Others"
      ],
      date: new Date().toISOString().substr(0, 10),
      menu: false
    };
  }
};
</script>