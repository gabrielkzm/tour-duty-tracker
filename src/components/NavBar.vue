<template>
  <v-container>
      <v-app-bar app color="#151C55" dense dark fixed>
        <!-- TODO: add v-navigation-drawer -->
        <!-- TODO: Change logo -->
        <div class="d-flex align-center">
          <v-img
            alt="ASMU Logo"
            class="shrink mr-3"
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            transition="scale-transition"
            width="20"
          />
          <h3 class="subtitle-1 font-weight-medium">ASMU TOURS SYSTEM</h3>
        </div>
        <v-spacer></v-spacer>
        <v-menu offset-y v-if="isFullNavBar">
          <template v-slot:activator="{ on }" class="ml-4">
            <v-btn v-on="on" text>
              <span class="mr-2">ADMIN</span>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="option in options" :key="option.text" :to="option.route">
              <v-list-item-icon class="mr-2">
                <v-icon medium>{{option.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{option.text}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <v-app-bar dense fixed :elevate-on-scroll="true" color="#F5F5F5" class="mt-12" v-show="isFullNavBar">
          <v-tabs color="#151c55">
          <v-tab text v-for="tab in tabs" :key="tab.text" :ripple="false" :to="tab.route">
            <span>
              <v-icon small color="#151c55" class="mr-1">{{tab.icon}}</v-icon>
            </span>
            <span class="mt-1 body-2 text-capitalize">{{tab.text}}</span>
          </v-tab>
          </v-tabs>
      </v-app-bar>
  </v-container>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    isFullNavBar: Boolean,
  },

  data() {
    return {
      options: [
        { icon: "mdi-lock-reset", text: "Change Password", route: 'changePassword'},
        { icon: "mdi-logout", text: "Log Out All", route: '/'},
        { icon: "mdi-logout-variant", text: "Log Out", route: '/'}
      ],
      tabs: [
        { icon: "mdi-calendar-multiple", text: "Tours", route: 'tours'},
        { icon: "mdi-account-group", text: "Ambassadors", route:'ambassadors'},
        { icon: "mdi-school", text: "Semesters", route:'semesters'},
        { icon: "mdi-chart-line", text: "Statistics", route:'statistics'},
        { icon: "mdi-calendar-plus", text: "Create Tour", route:'createTour'},
        { icon: "mdi-account-plus", text: "Create Ambassador", route:'createAmbassador'},
        { icon: "mdi-timeline-plus", text: "Create Semester", route:'createSemester'}
      ]
    };
  }
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