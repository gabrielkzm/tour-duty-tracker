<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <SemesterForm :semester="semester" :formTitle="title" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SemesterForm from "@/components/SemesterForm";

export default {
  name: "CreateAmbassador",

  components: {
    SemesterForm
  },

  data() {
    return {
      semester: {
        semesterID: 0,
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substring(0, 10)
      },
      title: "Create Semester"
    };
  }
};
</script>