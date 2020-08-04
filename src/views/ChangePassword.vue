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
              <v-form ref="changePasswordForm" v-model="validated">
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
                      :rules="[required('Current password')]"
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
                      :rules="[required('New password'), validPassword()]"
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
                      :rules="[required('Confirm new password'), v => v === user.newPassword || 'Password must match.']"
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
                      :rules="[required('PIN')]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-btn :disabled="buttonDisable" color="#151c55" small class="ma-1 white--text" @click="handleSubmit">
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
import validations from '@/helpers/validations';

export default {
  name: "ChangePassword",

  components: {
    NavBar
  },

  data() {
    return {
      buttonDisable: false,
      validated: true,
      required: validations.required,
      validPassword: validations.validPassword,
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
      this.$refs.changePasswordForm.reset()
      this.snackbarText = 'Your entry has been cleared';
      this.snackbarFail = true;
    },

    handleSubmit(e){
      this.buttonDisable = true;
      e.preventDefault();
      if(!this.$refs.changePasswordForm.validate()){
        return
      }

      this.$http.put('/api/users/changePassword', this.user)
        .then(response => {
          this.snackbarText = response.data.message;
          this.snackbarSuccess = true;
          this.$refs.changePasswordForm.reset()
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
        .then( () => {
          this.buttonDisable = false;
        });
    }
  }
};
</script>
