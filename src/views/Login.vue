<template>
  <div>
    <v-container fluid>
      <NavBar :isFullNavBar="false" />
    </v-container>
    <v-container class="fill-height" fluid>
      
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="#151c55" dark flat>
              <v-toolbar-title>Sign In</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Username"
                  name="login"
                  prepend-inner-icon="mdi-account"
                  type="password"
                  color="#151c55"
                />
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  prepend-inner-icon="mdi-lock"
                  type="password"
                  color="#151c55"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="#151c55" dark>Sign In</v-btn>
              <v-btn text color="#151c55" x-small>Forgotten your password?</v-btn>
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

  data: () => ({})
};
</script>

<style scoped>
.smuColorGold {
  color: #8a704c;
}
.smuColorBlue {
  color: #151c55;
}
.asmuColorOne {
  color: #7a6c4b;
}
.asmuColorTwo {
  color: #978c69;
}
</style>