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
                      v-model="user.password"
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
                      v-model="user.newPassword"
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
                      v-model="user.confirmNewPassword"
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
                      v-model="user.pin"
                    ></v-text-field>
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
      <v-snackbar color="success" :timeout="timeout" top v-model="snackbarSuccess">{{snackbarText}}<v-btn dark text @click='snackbarSuccess=false'>Close</v-btn></v-snackbar>
    <v-snackbar color="error" :timeout="timeout" top v-model="snackbarFail">{{snackbarText}}<v-btn dark text @click='snackbarFail=false'>Close</v-btn></v-snackbar>
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
      snackbarText: '',
      timeout: 2000,

      user: {
        password: null,
        newPassword: null,
        confirmNewPassword: null,
        pin: null,
      },

      defaultUser:{
        password: null,
        newPassword: null,
        confirmNewPassword: null,
        pin: null
      }
    };
  },

  methods: {
    handleCancel(){
      this.user = Object.assign({}, this.defaultUser);
      this.snackbarText = 'Your entry has been cleared';
      this.snackbarFail = true;
    },

    handleSubmit(e){
      e.preventDefault();
      this.$http.put('users/changePassword', this.user)
        .then(response => {
          this.snackbarText = response.data.message;
          this.snackbarSuccess = true;
          this.user = Object.assign({}, this.defaultUser);
        })
        .catch(error => {
          if(error.response.status === 400){
            this.snackbarText = error.response.data.message;
          }else{
            this.snackbarText = 'Something went wrong. Pleae contact Tours Portfolio Head/EXCO/Administrator.'  
          }
          this.snackbarFail = true;
          console.log(error);
        })
      
    
    }
  }
};
</script>
