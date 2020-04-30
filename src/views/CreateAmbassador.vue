<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <AmbassadorForm :formTitle="formTitle" :ambassador="ambassador"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AmbassadorForm from '@/components/AmbassadorForm';

export default {
  name: "CreateAmbassador",

  components:{
    AmbassadorForm
  },

  data() {
    return {
      ambassador:{

      },
      formTitle: "Create Ambassador"
    };
  }
};
</script>