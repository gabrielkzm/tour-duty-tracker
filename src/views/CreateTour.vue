<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <TourForm :formTitle="formTitle" :tour="tour"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TourForm from '@/components/TourForm';

export default {
  name: "CreateTour",

  components:{
    TourForm
  },

  data() {
    return {
      tour: {},
      formTitle: 'Create Tour'
    };
  }
};
</script>