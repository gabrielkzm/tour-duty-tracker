<template>
  <div>
    <v-container fluid>
      <NavBar :isFullNavBar="false" :hasUserOptions="true" />
    </v-container>
    <v-container class="fill-height" fluid>
      <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
      <span>
        Current Settings
      </span>
      </div>
      <v-row align="center" justify="center" class="elevation-6">
        <v-col flex>
          <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Tour Assigner Name</th>
                  <th class="text-left">Tour Assigner Phone</th>
                  <th class="text-left">Tour Assigner Email</th>
                  <th class="text-left">Add'tl Distribution List</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{currentSettings.tourAssignerName}}</td>
                  <td>{{currentSettings.tourAssignerContact}}</td>
                  <td>{{currentSettings.tourAssignerEmail}}</td>
                  <td>{{currentSettings.additionalDistributionList.join(', ')}}</td>
                </tr>
              </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12 pa-2 ma-2">
            <v-row class="ma-1">
              <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
                <span>
                  <v-icon medium class="mr-2">mdi-cog-outline</v-icon>Edit Settings
                </span>
              </div>
              <v-spacer></v-spacer>
              <div
                class="px-2 py-1 subtitle-1 font-weight-medium"
                align="right"
                style="color:#151c55"
              >
                <router-link to="/tours" tag="span" style="cursor:pointer">
                  <v-icon medium class="mr-2">mdi-arrow-left</v-icon>Back
                </router-link>
              </div>
            </v-row>
            <v-divider />
            <v-card-text>
              <v-form>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="Tour Assigner Name"
                      prepend-icon="mdi-account"
                      name="tourAssignerName"
                      required
                      dense
                      color="#151c55"
                      v-model="settings.tourAssignerName"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="Tour Assigner Phone Number"
                      prepend-icon="mdi-phone"
                      name="tourAssignerContact"
                      required
                      dense
                      color="#151c55"
                      v-model="settings.tourAssignerContact"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="Tour Assigner Email"
                      prepend-icon="mdi-email"
                      name="email"
                      required
                      dense
                      color="#151c55"
                      v-model="settings.tourAssignerEmail"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-combobox
                      v-model="settings.additionalDistributionList"
                      label="Additional Distribution List"
                      prepend-icon="mdi-mailbox-open-up"
                      name="additionalDistributionList"
                      :items="currentSettings.additionalDistributionList"
                      required
                      dense
                      small-chips
                      clearable
                      persistent-hint
                      multiple
                      color="#151c55"
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-btn color="#151c55" small dark class="ma-1" @click="handleSubmit">
                  <v-icon class="mr-1" small>mdi-check-circle</v-icon>Confirm
                </v-btn>
                <v-btn color="error" small dark class="ma-1" @click="handleCancel">
                  <v-icon class="mr-1" small>mdi-close-circle</v-icon>Cancel
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar color="success" :timeout="timeout" top v-model="snackbarSuccess">
        {{snackbarText}}
        <v-btn dark text @click="snackbarSuccess=false">Close</v-btn>
      </v-snackbar>
      <v-snackbar color="error" :timeout="timeout" top v-model="snackbarFail">
        {{snackbarText}}
        <v-btn dark text @click="snackbarFail=false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  name: "ChangePassword",

  components: {
    NavBar
  },

  data() {
    return {
      snackbarSuccess: false,
      snackbarFail: false,
      snackbarText: "",
      timeout: 2000,

      settings: {
        tourAssignerID: null,
        tourAssignerName: null,
        tourAssignerContact: null,
        tourAssignerEmail: null,
        additionalDistributionList: null
      },

      defaultSettings: {
        tourAssignerID: null,
        tourAssignerName: null,
        tourAssignerContact: null,
        tourAssignerEmail: null,
        additionalDistributionList: null
      },

      currentSettings: {
        tourAssignerID: null,
        tourAssignerName: null,
        tourAssignerContact: null,
        tourAssignerEmail: null,
        additionalDistributionList: null
      }
    };
  },

  created() {
    this.$http
      .get("settings")
      .then(response => {
        let settings = response.data.settings[0];
        this.currentSettings.tourAssignerID = settings._id;
        this.currentSettings.tourAssignerName = settings.tourAssignerName;
        this.currentSettings.tourAssignerContact = settings.tourAssignerContact;
        this.currentSettings.tourAssignerEmail = settings.tourAssignerEmail;
        this.currentSettings.additionalDistributionList = settings.additionalDistributionList;
      })
      .catch(error => {
        const message =
          "Something went wrong, please contact Tours Portfolio Head/EXCO/Platform Administrator.";
        this.snackbarText = message;
        this.snackbarFail = true;
        console.log(error);
      });
  },

  methods: {
    handleCancel() {
      this.settings = Object.assign({}, this.defaultSettings);
      this.snackbarText = "Your entry has been cleared";
      this.snackbarFail = true;
    },

    handleSubmit(e) {
      e.preventDefault();
      this.$http
        .put(`settings/${this.currentSettings.tourAssignerID}`, this.settings)
        .then(response => {
          this.snackbarText = response.data.message;
          this.snackbarSuccess = true;

          let newSettings = response.data.settings;
          this.currentSettings.tourAssignerName = newSettings.tourAssignerName;
          this.currentSettings.tourAssignerContact =
            newSettings.tourAssignerContact;
          this.currentSettings.tourAssignerEmail =
            newSettings.tourAssignerEmail;
          this.currentSettings.additionalDistributionList =
            newSettings.additionalDistributionList;

          this.settings = Object.assign({}, this.defaultSettings);
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.snackbarText = error.response.data.message;
          } else {
            this.snackbarText =
              "Something went wrong. Pleae contact Tours Portfolio Head/EXCO/Administrator.";
          }
          this.snackbarFail = true;
          console.log(error);
        });
    }
  }
};
</script>
