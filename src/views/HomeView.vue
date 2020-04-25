<template>
  <div>
    <vcontainer fluid>
      <NavBar :isFullNavBar="true" />
    </vcontainer>
    <v-content>
      <router-view />
    </v-content>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
export default {
  name: "HomeView",
  components: {
    NavBar
  }
};
</script>