<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" fluid>
        <v-img
          :src="require('../assets/asmu-logo-1.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col v-if="!error" cols=12 fluid align="center" class="display-1 font-weight-light">
        <span>Logging you out...</span>
      </v-col>
      <v-col cols="8" fluid v-if="!error">        
          <v-progress-linear indeterminate color="#7a6c4b"></v-progress-linear>
      </v-col>
      <v-col v-if="error" cols=12 fluid align="center" class="subtitle-1 font-weight-light">
        <span>Something went wrong, please try <router-link to="/login">logging</router-link> in again</span>
        <v-spacer></v-spacer>
        <span>Alternatively, you may opt to contact the Tours Portfolio Head/Exco/Administrator if the problem persists.</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Logout",

  data: () => ({
    error: false,
  }),

  created:  function() {
    this.$http
      .delete("/api/users/logout")
      // eslint-disable-next-line no-unused-vars
      .then(response => {
        localStorage.removeItem("user");
        let sleep = new Promise(r => setTimeout(r, 1000));
        sleep.then(() => {
          this.$router.push("/login");
        })
      })
      .catch(error => {
        console.log(error);
        this.error = true;
      })
  },
};
</script>