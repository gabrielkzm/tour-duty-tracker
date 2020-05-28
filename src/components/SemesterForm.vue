<template>
  <v-card class="elevation-12 pa-2">
          <div class="px-2 py-1 subtitle-1 font-weight-medium" style="color:#151c55">
            <v-icon medium class="mr-2">mdi-timeline-plus</v-icon>{{formTitle}}
          </div>
          <v-divider />
          <v-card-text class="mt-2">
            <v-form ref="semesterForm" v-model="validated">
              <v-row dense>
                <v-col cols="12">
                  <input type="hidden" v-model="semester.id" />
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="semester.startDate"
                        label="Start Date"
                        prepend-icon="mdi-calendar-arrow-left"
                        name="startDate"
                        required
                        v-on="on"
                        readonly
                        dense
                        color="#151c55"
                        :rules="[required('Start date')]"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="semester.startDate"
                      show-current
                      no-title
                      scrollable
                      @input="menu = false"
                      color="#7a6c4b"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row dense>              
                <v-col cols="12">
                  <v-menu
                    v-model="menuTwo"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="semester.endDate"
                        label="End date"
                        prepend-icon="mdi-calendar-arrow-right"
                        name="endDate"
                        required
                        
                        v-on="on"
                        dense
                        :rules="[required('End date'), v => new Date(v) >= new Date(semester.startDate) || 'End date must be greater or equal to start date.']"
                        color="#151c55"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="semester.endDate"
                      show-current
                      no-title
                      scrollable
                      @input="menuTwo = false"
                      color="#7a6c4b"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-btn :disabled="buttonDisable" color="#151c55" small class="ma-1 white--text"
                @click="() => { if(!this.$refs.semesterForm.validate()) return; onSubmit() }">
                <v-icon class="mr-1" small>mdi-pencil-plus</v-icon>Confirm
              </v-btn>
              <v-btn color="error" small dark class="ma-1" @click="onCancel">
                <v-icon class="mr-1" small>mdi-close-circle</v-icon>Cancel
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
</template>

<script>
import validations from '@/helpers/validations';

export default {
  name: "SemesterForm",

  props: {
    semester: Object,
    formTitle: String,
    onCancel: Function,
    onSubmit: Function,
    buttonDisable: Boolean,
  },

  data() {
    return {
      validated: true,
      menu: false,
      menuTwo: false,
      required: validations.required,
    };
  }
};
</script>