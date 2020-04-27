<template>
  <v-container cols="12" fluid>
    <v-row>
      <v-col xs="12" sm="6" md="3">
        <v-card class="pa-4 mr-2" outlined>
          <div class="overline mb-2 font-weight-medium" style="color:#978c69">Current Date Today</div>
          <div
            class="title text-capitalize"
            style="color:#8a704c"
          >{{new Date().toISOString().substr(0,10)}}</div>
        </v-card>
      </v-col>
      <v-col xs="12" sm="6" md="3">
        <v-card class="pa-4 mr-2" outlined>
          <div class="overline mb-2 font-weight-medium" style="color:#978c69">Current Semester ID</div>
          <div class="title text-capitalize" style="color:#8a704c">
            <!-- TODO: Change this, order by desc based on latest start date -->
            {{this.semesters[0]['semesterID']}}
          </div>
        </v-card>
      </v-col>
      <v-col xs="12" sm="6" md="3">
        <v-card class="pa-4 mr-2" outlined>
          <div
            class="overline mb-2 font-weight-medium"
            style="color:#978c69"
          >Current Semester Start Date</div>
          <div class="title text-capitalize" style="color:#8a704c">
            <!-- TODO: Change this, order by desc based on latest start date -->
            {{this.semesters[0]['startDate']}}
          </div>
        </v-card>
      </v-col>
      <v-col xs="12" sm="6" md="3">
        <v-card class="pa-4 mr-2" outlined>
          <div
            class="overline mb-2 font-weight-medium"
            style="color:#978c69"
          >Current Semester End Date</div>
          <div class="title text-capitalize" style="color:#8a704c">
            <!-- TODO: Change this, order by desc based on latest start date -->
            {{this.semesters[0]['endDate']}}
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="semesters"
          sort-desc="startDate"
          class="elevation-12"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Semesters</v-toolbar-title>
              <v-divider class="mx-4"></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn small color="#151c55" dark class="mb-2" v-on="on">Add Semester</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-menu
                            v-model="menu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="editedItem.startDate"
                                label="Start Date"
                                prepend-icon="mdi-calendar-arrow-left"
                                name="startDate"
                                required
                                v-on="on"
                                readonly
                                dense
                                color="#151c55"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="editedItem.startDate"
                              show-current
                              no-title
                              scrollable
                              @input="menu = false"
                              color="#7a6c4b"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-menu
                            v-model="menuTwo"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="editedItem.endDate"
                                label="End Date"
                                prepend-icon="mdi-calendar-arrow-right"
                                name="endDate"
                                required
                                readonly
                                v-on="on"
                                dense
                                color="#151c55"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="editedItem.endDate"
                              show-current
                              no-title
                              scrollable
                              @input="menuTwo = false"
                              color="#7a6c4b"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#151c55" text @click="close">Cancel</v-btn>
                    <v-btn color="#151c55" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Semesters",

  data: () => ({
    menu: false,
    menuTwo: false,
    dialog: false,
    headers: [
      {
        text: "Semester ID",
        align: "start",
        sortable: false,
        value: "semesterID"
      },
      { text: "Start Date", value: "startDate" },
      { text: "End Date", value: "endDate" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    semesters: [],
    editedIndex: -1,
    editedItem: {
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10)
    },
    defaultItem: {
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10)
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add Semester" : "Edit Semester";
    }
  },

  watch: {
    dialog: function(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.semesters = [
        {
          semesterID: 1,
          startDate: new Date("March 20, 2021, 12:00:01")
            .toISOString()
            .substr(0, 10),
          endDate: new Date("October 20, 2021, 12:00:01")
            .toISOString()
            .substr(0, 10)
        },
        {
          semesterID: 2,
          startDate: new Date("October 20, 2020, 12:00:01")
            .toISOString()
            .substr(0, 10),
          endDate: new Date("January 20, 2021, 12:00:01")
            .toISOString()
            .substr(0, 10)
        },
        {
          semesterID: 3,
          startDate: new Date("January 10, 2020, 12:00:01")
            .toISOString()
            .substr(0, 10),
          endDate: new Date("June 20, 2020, 12:00:01")
            .toISOString()
            .substr(0, 10)
        }
      ];
    },

    editItem(item) {
      this.editedIndex = this.semesters.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.semesters.indexOf(item);
      confirm("Are you sure you want to delete this semester?") &&
        this.semesters.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 200);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.semesters[this.editedIndex], this.editedItem);
      } else {
        this.semesters.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
