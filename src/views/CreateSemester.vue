<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <SemesterForm :semester="semester" :formTitle="title" :onCancel="handleCancel" :onSubmit="handleSubmit" :buttonDisable="buttonDisable"/>
      </v-col>
    </v-row>
    <v-snackbar color="success" :timeout="timeout" top v-model="snackbarSuccess">{{snackbarText}}<v-btn dark text @click='snackbarSuccess=false'>Close</v-btn></v-snackbar>
    <v-snackbar color="error" :timeout="timeout" top v-model="snackbarFail">{{snackbarText}}<v-btn dark text @click='snackbarFail=false'>Close</v-btn></v-snackbar>
  </v-container>
</template>

<script>
import SemesterForm from "@/components/SemesterForm";

export default {
  name: "CreateAmbassador",

  components: {
    SemesterForm,
  },

  data() {
    return {
      buttonDisable: false,
      snackbarSuccess: false,
      snackbarFail: false,
      snackbarText: '',
      timeout: 2000,
      semester: {
        semesterID: 0,
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substring(0, 10)
      },
      
      defaultSemester: {
        semesterID: 0,
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substring(0, 10)
      },

      title: "Create Semester"
    };
  },

  methods:{
    handleCancel(){
      this.semester = Object.assign({}, this.defaultSemester);
      this.snackbarText = 'Your entry has been cleared.'
      this.snackbarFail = true;
    },

    handleSubmit(){
      this.buttonDisable = true;
      this.$http.post('/api/semesters', this.semester)
      .then(response => {
        this.snackbarText = response.data.message;
        this.snackbarSuccess = true;
        this.semester = Object.assign({}, this.defaultSemester);
      })
      .catch((error) => {
        this.snackbarText = 'Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.'
        this.snackbarFail = true;
        console.log(error);
      })
      .then( () => {
        this.buttonDisable = false;
      });
    },
  }
};
</script>