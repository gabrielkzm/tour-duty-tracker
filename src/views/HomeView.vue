<template>
  <div>
    <NavBar :isFullNavBar="true" :hasUserOptions="true"/>
    <v-content>
      <router-view />
    </v-content>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
export default {
  name: "HomeView",
  components: {
    NavBar
  }
};
</script>