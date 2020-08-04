<template>
  <div>
    <v-container fluid>
      <NavBar :isFullNavBar="false" :hasUserOptions="false"/>
    </v-container>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="#151c55" dark short elevation="6">
              <v-toolbar-title>Sign In</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form id="login-form">
                <v-text-field
                  label="Username"
                  name="login"
                  prepend-icon="mdi-account"
                  color="#151c55"
                  v-model="username"
                />
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  color="#151c55"
                  v-model="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn form="login-form" type="submit" color="#151c55" dark @click='handleSubmit'>Sign In</v-btn>
              <v-btn text color="#151c55" x-small @click="handleForgottenPassword">Forgotten your password?</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
      
<script>
import NavBar from "@/components/NavBar";

export default {
  name: "Login",

  components: {
    NavBar
  },

  data: () => ({
    username: '',
    password: '',
  }),

  methods:{
    handleSubmit(e){
      e.preventDefault();
      this.$http.post('/api/users/login', {
        username: this.username,
        password: this.password
      })
      .then(response => {
        const user = {
          userID:response.data.user._id,
          username: response.data.user.username,
          token: response.data.token
        }
        localStorage.setItem('user', JSON.stringify(user))
        this.$router.push('/');
      })
      .catch((error) => {
        //TODO: Insert snackbar instead
        alert('Incorrect username/password');
        console.log(error);
      })
    },

    handleForgottenPassword(){
      alert('Please contact Tours Portfolio Head/Exco/Platform Adminstrator.');
    }
  }
};
</script>