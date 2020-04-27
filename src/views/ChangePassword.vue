<template>
  <div>
    <v-container fluid>
      <NavBar :isFullNavBar="false" :hasUserOptions="true" />
    </v-container>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12 pa-2 ma-2">
            <v-row class="ma-1">
              <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
                <span>
                  <v-icon medium class="mr-2">mdi-lock-reset</v-icon>Change Password
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
                      label="Current password"
                      prepend-icon="mdi-lock-question"
                      name="currentPassword"
                      type="password"
                      required
                      dense
                      color="#151c55"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="New password"
                      prepend-icon="mdi-lock-plus"
                      name="newPassword"
                      type="password"
                      required
                      dense
                      color="#151c55"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="Confirm new password"
                      prepend-icon="mdi-lock-plus"
                      name="confirmNewPassword"
                      type="password"
                      required
                      dense
                      color="#151c55"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="PIN"
                      prepend-icon="mdi-key-variant"
                      name="pin"
                      type="password"
                      required
                      dense
                      color="#151c55"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-btn color="#151c55" small dark class="ma-1">
                  <v-icon class="mr-1" small>mdi-check-circle</v-icon>Confirm
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
    return {};
  }
};
</script>
