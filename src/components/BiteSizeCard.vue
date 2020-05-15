<template>
  <v-col xs="12" sm="6" md="3">
    <v-card class="pa-4 mr-2" outlined>
      <div class="overline mb-2 font-weight-medium" style="color:#978c69">{{title}}</div>
      <div class="subtitle-1 font-weight-bold text-capitalize" style="color:#8a704c">{{value}}</div>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "BiteSizeCard",
  props: {
    title: String,
    value: String
  },

  data() {
    return {};
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