<template>
  <v-card class="elevation-12 pa-2">
    <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
      <v-icon medium class="ma-1">mdi-calendar-plus</v-icon>
      {{formTitle}}
    </div>
    <v-divider />
    <v-card-text class="mt-2">
      <v-form>
        <v-row dense>
          <v-col cols="12" md="4">
            <input type="hidden" v-model="tour.tourID" />
            <v-text-field
              v-model="tour.name"
              label="Tour name"
              prepend-icon="mdi-card-account-details-outline"
              name="tourName"
              required
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
              required
              dense
              color="#151c55"
              :items="attire"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-select
              v-model="tour.checkPoints"
              label="Checkpoint(s)"
              prepend-icon="mdi-map-marker-multiple-outline"
              name="checkPoints"
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
          <v-col cols="12" md="4">
            <v-combobox
              v-model="tour.startPoint"
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
              v-model="tour.endPoint"
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
              v-model="tour.assignedAmbassadors"
              label="Assigned ambassador(s)"
              prepend-icon="mdi-account-multiple-check-outline"
              name="assignedAmbassadors"
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
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="tour.ambassadorIC"
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
              v-model="tour.remarks"
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
              v-model="tour.office"
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
              v-model="tour.officeLiaison"
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
              v-model="tour.officePhoneContact"
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
              v-model="tour.officeEmailContact"
              label="Liaison email"
              prepend-icon="mdi-email-outline"
              name="liaisonEmail"
              required
              dense
              color="#151c55"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn color="#151c55" small dark class="ma-1" @click="onSubmit">
          <v-icon class="mr-1" small>mdi-pencil-plus</v-icon>Confirm
        </v-btn>
        <v-btn v-show="newTour" color="#151c55" small dark class="ma-1" @click="onSubmitAndEmail">
          <v-icon class="mr-1" small>mdi-pencil-plus</v-icon>Confirm and Email
        </v-btn>
        <v-btn color="error" small dark class="ma-1" @click="onCancel">
          <v-icon class="mr-1" small>mdi-close-circle</v-icon>Cancel
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TourForm",

  props: {
    tour: Object,
    formTitle: String,
    newTour: Boolean,
    onSubmitAndEmail: Function,
    onCancel: Function,
    onSubmit: Function
  },

  data() {
    return {
      statuses: ["Initiated", "Announced", "Assigned", "Completed"],
      tourTypes: ["TOUR", "UE"],
      purposeOfTour: [
        "Donor related",
        "Entrepreneurship",
        "Learning pedagogy",
        "Partnerships",
        "School facilities",
        "Ushering duty",
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
      attire: ["Polo T-Shirt", "Suit"],
      checkpoints: [
        "Admin Building",
        "LKS Library",
        "SMU Connexion",
        "KGC Library",
        "LKSCB",
        "SIS",
        "SOE",
        "SOSS",
        "SOA",
        "SOL",
        "Concourse",
        "Campus Green",
        "T-Junction"
      ],
      ambassadors: [
        { "text": "Gabriel", "value":"000000000000000000000001" },
        { "text": "Wei Hao", "value": "000000000000000000000002" },
        { "text": "Nigel", "value": "000000000000000000000003" },
        { "text": "John Doe", "value": "000000000000000000000004" },
        { "text": "N/A", "value": "000000000000000000000000" },
      ],
      offices: ["OUAFA", "IO", "SIS", "SOE", "SOSS", "SOA", "SOL", "LKCSB"],
      date: new Date().toISOString().substr(0, 10),
      menu: false
    };
  }
};
</script>