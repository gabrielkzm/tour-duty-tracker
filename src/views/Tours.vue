<template>
  <v-container cols="12" fluid>
    <v-row>
      <v-col>
        <v-data-table
          :loading="loading"
          :loading-text="loadingText"
          :headers="headers"
          :items="tours"
          :footer-props="{
            itemsPerPageOptions: [10,20,30,40,50,-1]
          }"
          multi-sort
          sort-by="name"
          class="elevation-12"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Tours</v-toolbar-title>
              <v-divider class="mx-4"></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="1000px">
                <template v-slot:activator="{ on }">
                  <v-btn small color="#151c55" dark class="mb-2" v-on="on">Add Tour</v-btn>
                </template>
                <TourForm
                  :tour="editedItem"
                  :onCancel="close"
                  :onSubmit="save"
                  :onSubmitAndEmail="save"
                  :formTitle="formTitle"
                  :newTour="newTour"
                />
              </v-dialog>
              <v-dialog v-model="detailsDialog" max-width="750px">
                <TourDetailsCard :ambassadors="ambassadors" :tour="viewItem" :onClose="close" :generalDetails="true" :ambassadorsHaveNotResponded="ambassadorsHaveNotResponded" />
              </v-dialog>
              <v-dialog v-model="assignmentDialog" max-width="600px">
                <TourDetailsCard :ambassadors="ambassadors" :tour="viewItem" :onClose="close" :assignmentDetails="true" :ambassadorsHaveNotResponded="ambassadorsHaveNotResponded" />
              </v-dialog>
              <v-dialog v-model="replyDialog" max-width="600px">
                <TourDetailsCard :ambassadors="ambassadors" :tour="viewItem" :onClose="close" :replyDetails="true" :ambassadorsHaveNotResponded="ambassadorsHaveNotResponded"/>
              </v-dialog>
              <v-dialog v-model="emailAnnounceDialog" max-width="700px">
                <EmailForm
                  :onCancel="close"
                  :onSubmit="emailCorps"
                  :tour="viewItem"
                  type="Announced"
                  title="Broadcast Tour to Ambassadors | Initial Email to Office"
                />
              </v-dialog>
              <v-dialog v-model="emailOfficeDialog" max-width="700px">
                <EmailForm
                  :onCancel="close"
                  :onSubmit="emailOffice"
                  :tour="viewItem"
                  type="Assigned"
                  title="Confirm Tour Assignment to Ambassadors | Confirmation Email to Office"
                />
              </v-dialog>
              <v-dialog v-model="assignDialog" max-width="700px">
                <AssignForm
                  :ambassadors="ambassadors"
                  :onCancel="close"
                  :tour="viewItem"
                  :onSubmitAutomatically="assignAmbassadorsAutomatically"
                  :onSubmitManually="assignAmbassadorsManually"
                />
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.name="{ item }">
            <v-container>
              <v-row>
                <span class="mr-2">{{item.name}}</span>
                <v-icon small class="mr-2" @click="getDetails(item)">mdi-open-in-new</v-icon>
                <div v-if="item.urgentTour === true">
                  <v-icon small class="mr-2">mdi-exclamation-thick</v-icon>
                </div>
              </v-row>
            </v-container>
          </template>
          <template v-slot:item.assignedAmbassadors="{ item }">
            <div v-show="isAssigned(item)">
              <v-chip color="success" dark x-small class="mr-2" @click="getAssignmentDetails(item)">
                <v-icon x-small>mdi-check-circle</v-icon>
              </v-chip>
            </div>
            <div v-show="!isAssigned(item)">
              <v-chip color="error" dark x-small class="mr-2" @click="getAssignmentDetails(item)">
                <v-icon x-small>mdi-close-circle</v-icon>
              </v-chip>
            </div>
          </template>
          <template v-slot:item.status="{ item }">
            <div v-show="item.status === 'Initiated'">
              <v-chip
                color="grey"
                dark
                x-small
                class="mr-2 text-capitalize"
                @click="getReplyDetails(item)"
              >{{item.status}}</v-chip>
            </div>
            <div v-show="item.status === 'Announced'">
              <v-chip
                color="primary"
                dark
                x-small
                class="mr-2 text-capitalize"
                @click="getReplyDetails(item)"
              >{{item.status}}</v-chip>
            </div>
            <div v-show="item.status === 'Assigned'">
              <v-chip
                color="orange"
                dark
                x-small
                class="mr-2 text-capitalize"
                @click="getReplyDetails(item)"
              >{{item.status}}</v-chip>
            </div>
            <div v-show="item.status === 'Confirmed' && isConducted(item.date)">
              <v-chip
                color="success"
                dark
                x-small
                class="mr-2 text-capitalize"
                @click="getReplyDetails(item)"
              >Completed</v-chip>
            </div>
            <div v-show="item.status === 'Confirmed' && !isConducted(item.date)">
              <v-chip
                color="cyan"
                dark
                x-small
                class="mr-2 text-capitalize"
                @click="getReplyDetails(item)"
              >{{item.status}}</v-chip>
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon 
              v-show="item.status !== 'Assigned' && item.status !== 'Confirmed'"
              small 
              class="mr-2" 
              @click="emailAnnounceItem(item)"
            >mdi-email-send
            </v-icon>
            <v-icon 
              v-show="item.status === 'Assigned' || item.status === 'Confirmed'"
              small
              disabled
              class="mr-2" 
              @click="emailAnnounceItem(item)"
            >mdi-email-send
            </v-icon>
            <v-icon
              v-show="item.status === 'Announced' || item.status === 'Initiated' || item.status === 'Assigned'"
              small
              class="mr-2"
              @click="assignItem(item)"
            >mdi-clipboard-text</v-icon>
            <v-icon
              v-show="item.status !== 'Announced' && item.status !== 'Initiated' && item.status !== 'Assigned'"
              disabled
              small
              class="mr-2"
              @click="assignItem(item)"
            >mdi-clipboard-text</v-icon>

            <v-icon
              v-show="item.status === 'Assigned'"
              small
              class="mr-2"
              @click="emailOfficeItem(item)"
            >mdi-email-check</v-icon>
            <v-icon
              v-show="item.status !== 'Assigned'"
              disabled
              small
              class="mr-2"
              @click="emailOfficeItem(item)"
            >mdi-email-check</v-icon>

            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-snackbar color="success" :timeout="timeout" top v-model="snackbarSuccess">
      {{snackbarText}}
      <v-btn dark text @click="snackbarSuccess=false">Close</v-btn>
    </v-snackbar>
    <v-snackbar color="error" :timeout="timeout" top v-model="snackbarFail">
      {{snackbarText}}
      <v-btn dark text @click="snackbarFail=false">Close</v-btn>
    </v-snackbar>
    <v-snackbar color="warning" timeout="5000" right v-model="snackbarDelete">
      <span>Are you sure you want to delete this ambassador?</span>
      <v-btn dark text @click="deleteTour">Delete</v-btn>
      <v-btn dark text @click="snackbarDelete=false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import TourForm from "@/components/TourForm";
import EmailForm from "@/components/EmailForm";
import AssignForm from "@/components/AssignForm";
import TourDetailsCard from "@/components/TourDetailsCard";

export default {
  name: "Tours",

  components: {
    TourForm,
    TourDetailsCard,
    EmailForm,
    AssignForm
  },

  data: () => ({
    today: new Date(),
    index: null,
    loading: "#151c55",
    loadingText: "Loading items...",
    snackbarText: "",
    snackbarSuccess: false,
    snackbarFail: false,
    snackbarDelete: false,
    timeout: 3000,
    ambassadors: {},
    dialog: false,
    emailAnnounceDialog: false,
    emailOfficeDialog: false,
    detailsDialog: false,
    assignDialog: false,
    assignmentDialog: false,
    replyDialog: false,
    headers: [
      {
        text: "Name",
        align: "start",
        value: "name"
      },
      { text: "Date", value: "date" },
      { text: "Start Time", value: "startTime" },
      { text: "End Time", value: "endTime" },
      { text: "Assigned?", value: "assignedAmbassadors" },
      { text: "Status", value: "status" },
      // Email Initial, email confirm, assign
      { text: "Actions", value: "actions", sortable: false }
    ],
    tours: [],
    editedItem: {
      tourID: 0,
      name: "",
      date: null,
      startTime: null,
      endTime: null,
      type: "",
      numberOfGuests: null,
      numberOfAmbassadorsRequired: null,
      ambassadorsAccepted: [],
      ambassadorsDeclinedWithReason: [],
      ambassadorsDeclinedWithoutReason: [],
      assignedAmbassadors: [],
      ambassadorIC: "",
      attire: "",
      purposeOfTour: [],
      guestProfile: "",
      checkPoints: [],
      startPoint: "",
      endPoint: "",
      remarks: "",
      office: "",
      officePhoneContact: "",
      officeEmailContact: "",
      officeLiaison: "",
      status: "",
      urgentTour: "",
    },
    defaultItem: {
      tourID: 0,
      name: "",
      date: null,
      startTime: null,
      endTime: null,
      type: "",
      numberOfGuests: null,
      numberOfAmbassadorsRequired: null,
      ambassadorsAccepted: [],
      ambassadorsDeclinedWithReason: [],
      ambassadorsDeclinedWithoutReason: [],
      assignedAmbassadors: [],
      ambassadorIC: "",
      attire: "",
      purposeOfTour: [],
      guestProfile: "",
      checkPoints: [],
      startPoint: "",
      endPoint: "",
      remarks: "",
      office: "",
      officePhoneContact: "",
      officeEmailContact: "",
      officeLiaison: "",
      status: "",
      urgentTour: "",
    },
    viewItem: {
      tourID: 0,
      name: "",
      date: null,
      startTime: null,
      endTime: null,
      type: "",
      numberOfGuests: null,
      numberOfAmbassadorsRequired: null,
      ambassadorsAccepted: [],
      ambassadorsDeclinedWithReason: [],
      ambassadorsDeclinedWithoutReason: [],
      assignedAmbassadors: [],
      ambassadorIC: "",
      attire: "",
      purposeOfTour: [],
      guestProfile: "",
      checkPoints: [],
      startPoint: "",
      endPoint: "",
      remarks: "",
      office: "",
      officePhoneContact: "",
      officeEmailContact: "",
      officeLiaison: "",
      status: "",
      urgentTour: "",
    }
  }),

  computed: {
    formTitle() {
      return this.editedItem.tourID === 0 ? "Add Tour" : "Edit Tour";
    },

    newTour() {
      return this.editedItem.tourID === 0 ? true : false;
    },

    ambassadorsHaveNotResponded(){
      let ambassadorsAccepted = this.viewItem.ambassadorsAccepted
      let ambassadorsDeclinedWithoutReason = this.viewItem.ambassadorsDeclinedWithoutReason
      let ambassadorsDeclinedWIthReason = this.viewItem.ambassadorsDeclinedWithReason
      let result = []
      for(let [key, value] of Object.entries(this.ambassadors)){
        if(!ambassadorsAccepted.includes(key) && !ambassadorsDeclinedWithoutReason.includes(key) 
          && !ambassadorsDeclinedWIthReason.includes(key) && value.currentAvailability && key !== '000000000000000000000000'){
            result.push(key)
        }
      }
      return result;
    }
  },

  watch: {
    dialog: function(val) {
      val || this.close();
    },

    detailsDialog: function(val) {
      val || this.close();
    },

    assignmentDialog: function(val) {
      val || this.close();
    },

    assignDialog: function(val) {
      val || this.close();
    },

    emailOfficeDialog: function(val) {
      val || this.close();
    },

    emailAnnounceDialog: function(val) {
      val || this.close();
    }
  },

  created(){
    this.$http.get('ambassadors?filter[hasGraduated]=false&filter[isMinimal]=true')
      .then(response => {
        response.data.ambassadors.forEach(ambassador => {
          this.ambassadors[ambassador._id] = {"name": ambassador.name, "currentAvailability": ambassador.currentAvailability}
        });
        this.ambassadors['000000000000000000000000'] = {"name": 'N/A', "currentAvailability": false}
      })
      .catch(error => {
        const message = 'Something went wrong, please contact Tours Portfolio Head/EXCO/Platform Administrator.';
        this.snackbarText = message;
        this.snackbarFail = true;
        console.log(error);
      })
  },
  
  mounted() {
    this.$http
      .get("tours")
      .then(response => {
        this.tours = response.data.tours.map(tour => {
          return this.transformTourData(tour);
        });
        this.loading = false;
      })
      .catch(error => {
        const message =
          "Loading failed. Please contact Tours Portfolio Head/EXCO/Platform Administrator.";
        this.snackbarText = message;
        this.snackbarFail = true;
        this.loadingText = message;
        console.log(error);
      });
  },

  methods: {
    transformTourData(tour) {
      delete tour.createdAt;
      delete tour.updatedAt;
      delete tour.__v;
      tour["tourID"] = tour._id;
      delete tour._id;
      tour["date"] = tour.date.substr(0, 10);
      tour["startTime"] = tour.startTime.substr(11, 5);
      tour["endTime"] = tour.endTime.substr(11, 5);
      return tour;
    },

    emailOffice() {
      //TODO: to change this algo
      let tour = this.viewItem;
      let tours = this.tours;
      tour.status = "Confirmed";
      for (let i = 0; i < tours.length; i++) {
        let selectedTour = tours[i];
        if (selectedTour.tourID === tour.tourID) {
          Object.assign(tours[i], tour);
        }
      }
      this.close();
    },

    emailCorps() {
      //TODO: to change this algo
      let tour = this.viewItem;
      let tours = this.tours;
      tour.status = "Announced";
      for (let i = 0; i < tours.length; i++) {
        let selectedTour = tours[i];
        if (selectedTour.tourID === tour.tourID) {
          Object.assign(tours[i], tour);
        }
      }
      this.close();
    },

    isAssigned(item) {
      //TODO: check this out again
      let assignedAmbassadors = item.assignedAmbassadors;
      let ambassadorIC = item.ambassadorIC;
      if (
        assignedAmbassadors.length === 0 ||
        assignedAmbassadors.includes("000000000000000000000000") ||
        ambassadorIC === null ||
        ambassadorIC === "" ||
        ambassadorIC === '000000000000000000000000'
      ) {
        return false;
      } else {
        return true;
      }
    },

    emailAnnounceItem(item) {
      this.index = this.tours.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.emailAnnounceDialog = true;
    },

    emailOfficeItem(item) {
      this.index = this.tours.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.emailOfficeDialog = true;
    },

    assignItem(item) {
      this.index = this.tours.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.assignDialog = true;
    },

    assignAmbassadorsAutomatically() {
      let viewItem = this.viewItem;
      let tours = this.tours;
      let endPointBody = {
        "tourID": viewItem.tourID,
        "assignAutomatically": true,
        "ambassdorsHaveNotResponded": this.ambassadorsHaveNotResponded,
      }

      this.$http.post(`assignments`, endPointBody)
        .then(response => {
          let tour = response.data.tour
          tour = this.transformTourData(tour);
          Object.assign(tours[this.index], tour);
          this.snackbarText = `${response.data.message} I/C: ${this.ambassadors[tour.ambassadorIC]["name"]}`
          this.snackbarSuccess = true;
        })
        .catch(error => {
            this.snackbarText = 'Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.'
            this.snackbarFail = true;
            console.log(error);
          })
        .then(() => {
          this.close();
        });
    },

    isConducted(dateStr){
      let date = new Date(dateStr)
      if(date.getTime() < this.today){
        return true
      }else{
        return false
      }
    },

    assignAmbassadorsManually(selectedAmbassadors) {
      let viewItem = this.viewItem;
      let tours = this.tours;
      let endPointBody = {
        "tourID": viewItem.tourID,
        "assignAutomatically": false,
        "selectedAmbassadors": selectedAmbassadors,
        "ambassdorsHaveNotResponded": this.ambassadorsHaveNotResponded,
      }

      this.$http.post(`assignments`, endPointBody)
        .then(response => {
          let tour = response.data.tour
          tour = this.transformTourData(tour);
          Object.assign(tours[this.index], tour);
          this.snackbarText = `${response.data.message} I/C: ${this.ambassadors[tour.ambassadorIC]["name"]}`
          this.snackbarSuccess = true;
        })
        .catch(error => {
            this.snackbarText = 'Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.'
            this.snackbarFail = true;
            console.log(error);
          })
        .then(() => {
          this.close();
        });
      
    },

    editItem(item) {
      this.index = this.tours.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.snackbarDelete = true;
      this.index = this.tours.indexOf(item);
      this.viewItem = Object.assign({}, item);
    },

    deleteTour() {
      this.$http
        .delete(`tours/${this.viewItem.tourID}`)
        .then(response => {
          this.tours.splice(this.index, 1);
          this.snackbarText = response.data.message;
          this.snackbarSuccess = true;
        })
        .catch(error => {
          this.snackbarText =
            "Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.";
          this.snackbarFail = true;
          console.log(error);
        })
        .then(() => {
          this.snackbarDelete = false;
          this.close();
        });
    },

    getDetails(item) {
      this.index = this.tours.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.detailsDialog = true;
    },

    getAssignmentDetails(item) {
      this.index = this.tours.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.assignmentDialog = true;
    },

    getReplyDetails(item) {
      this.index = this.tours.indexOf(item);
      this.viewItem = Object.assign({}, item);
      this.replyDialog = true;
    },

    close() {
      this.dialog = false;
      this.detailsDialog = false;
      this.assignmentDialog = false;
      this.replyDialog = false;
      this.emailOfficeDialog = false;
      this.emailAnnounceDialog = false;
      this.assignDialog = false;
      setTimeout(() => {
        this.index = null;
        this.editedItem = Object.assign({}, this.defaultItem);
        this.viewItem = Object.assign({}, this.defaultItem);
      }, 200);
    },

    save() {
      let editedItem = this.editedItem;
      let tours = this.tours;
      if (editedItem.tourID !== 0) {
        this.$http.put(`tours/${editedItem.tourID}`, editedItem)
          .then(response => {
            let tour = response.data.tour;
            tour = this.transformTourData(tour);
            Object.assign(tours[this.index], tour);
            this.snackbarText = response.data.message;
            this.snackbarSuccess = true;
          })
          .catch(error => {
            this.snackbarText = 'Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.'
            this.snackbarFail = true;
            console.log(error);
          })
          .then( () => {
            this.close();
          });
      } else {
        this.$http.post('tours', editedItem)
          .then(response => {
            let tour = this.transformTourData(response.data.tour);
            tours.push(tour);
            this.snackbarText = response.data.message;
            this.snackbarSuccess = true;
          })
          .catch(error => {
            this.snackbarText = 'Something went wrong. Please contact Tours Portfolio Head/EXCO/Administrator.';
            this.snackbarFail = true;
            console.log(error);
          })
          .then( () => {
            this.close();
          });
      }
    }
  }
};
</script>