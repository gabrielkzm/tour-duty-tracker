<template>
  <v-container cols="12" fluid>
    <v-row>
      <v-col>
        <v-data-table
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
            </v-toolbar>
          </template>
          <template v-slot:item.name="{ item }">
            <v-container>
              <v-row>
                <span class="mr-2">{{item.name}}</span>
                <v-icon small class="mr-2" @click="getDetails(item)">mdi-open-in-new</v-icon>
                <v-dialog v-model="detailsDialog" max-width="500px">
                  <TourDetailsCard :tour="viewItem" :onClose="close" :generalDetails="true" />
                </v-dialog>
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
              <v-dialog v-model="assignmentDialog" max-width="500px">
                <TourDetailsCard :tour="viewItem" :onClose="close" :assignmentDetails="true" />
              </v-dialog>
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
            <div v-show="item.status === 'Completed'">
              <v-chip
                color="success"
                dark
                x-small
                class="mr-2 text-capitalize"
                @click="getReplyDetails(item)"
              >{{item.status}}</v-chip>
            </div>
            <v-dialog v-model="replyDialog" max-width="500px">
              <TourDetailsCard :tour="viewItem" :onClose="close" :replyDetails="true" />
            </v-dialog>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="emailAnnounceItem(item)">mdi-email-send</v-icon>
            <v-dialog v-model="emailAnnounceDialog" max-width="700px">
              <EmailForm
                :onCancel="close"
                :onSubmit="emailCorps"
                :tour="viewItem"
                type="Announced"
                title="Broadcast tour to ambassadors"
              />
            </v-dialog>
            <v-icon
              v-show="item.status === 'Announced' || item.status === 'Initiated'"
              small
              class="mr-2"
              @click="assignItem(item)"
            >mdi-clipboard-text</v-icon>
            <v-icon
              v-show="item.status !== 'Announced' && item.status !== 'Initiated'"
              disabled
              small
              class="mr-2"
              @click="assignItem(item)"
            >mdi-clipboard-text</v-icon>
            <v-dialog v-model="assignDialog" max-width="700px">
              <AssignForm
                :onCancel="close"
                :tour="viewItem"
                :onSubmitAutomatically="assignAmbassadorsAutomatically"
                :onSubmitManually="assignAmbassadorsManually"
              />
            </v-dialog>
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
            <v-dialog v-model="emailOfficeDialog" max-width="700px">
              <EmailForm
                :onCancel="close"
                :onSubmit="emailOffice"
                :tour="viewItem"
                type="Assigned"
                title="Confirm tour assignment to ambassadors and office"
              />
            </v-dialog>
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
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
      status: ""
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
      status: ""
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
      status: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedItem.tourID === 0 ? "Add Tour" : "Edit Tour";
    },

    newTour() {
      return this.editedItem.tourID === 0 ? true : false;
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

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.tours = [
        {
          tourID: 9,
          name: "Tour for Ngee Ann Polytechnic",
          date: new Date().toISOString().substr(0, 10),
          startTime: new Date().toTimeString().substr(0, 8),
          endTime: new Date().toTimeString().substr(0, 8),
          type: "TOUR",
          numberOfGuests: 10,
          numberOfAmbassadorsRequired: 1,
          ambassadorsAccepted: ["Nigel", "Louis"],
          ambassadorsDeclinedWithReason: ["Wei Hao"],
          ambassadorsDeclinedWithoutReason: ["Gabriel"],
          assignedAmbassadors: ["Nigel", "Louis"],
          ambassadorIC: "Louis",
          attire: "Polo T-Shirt",
          purposeOfTour: ["Learning pedagogy"],
          guestProfile: "Students",
          checkPoints: ["Admin Building", "LKS Library", "Campus Green"],
          startPoint: "Admin Building",
          endPoint: "Admin Building",
          remarks: "Be on time",
          office: "IO",
          officePhoneContact: "92367762",
          officeEmailContact: "gabriel.koh.2016@smu.edu.sg",
          officeLiaison: "John Doe",
          status: "Initiated"
        },
        {
          tourID: 2,
          name: "Patron's Day",
          date: new Date().toISOString().substr(0, 10),
          startTime: new Date().toTimeString().substr(0, 8),
          endTime: new Date().toTimeString().substr(0, 8),
          type: "UE",
          numberOfGuests: 100,
          numberOfAmbassadorsRequired: 2,
          ambassadorsAccepted: ["Wei Hao", "Gabriel", "Louis"],
          ambassadorsDeclinedWithReason: ["Nigel"],
          ambassadorsDeclinedWithoutReason: [],
          assignedAmbassadors: ["N/A"],
          ambassadorIC: "N/A",
          attire: "Suit",
          purposeOfTour: ["Partnerships", "Donor related"],
          guestProfile: "Corporate",
          checkPoints: ["Admin Building", "LKS Library", "T-Junction"],
          startPoint: "Admin Building",
          endPoint: "Admin Building",
          remarks: "Some random remark",
          office: "OUAFA",
          officePhoneContact: "92367762",
          officeEmailContact: "gabriel.koh.2016@smu.edu.sg",
          officeLiaison: "John Doe",
          status: "Initiated"
        },
        {
          tourID: 3,
          name: "Tour for RI",
          date: new Date().toISOString().substr(0, 10),
          startTime: new Date().toTimeString().substr(0, 8),
          endTime: new Date().toTimeString().substr(0, 8),
          type: "TOUR",
          numberOfGuests: 30,
          numberOfAmbassadorsRequired: 1,
          ambassadorsAccepted: ["Nigel", "Wei Hao"],
          ambassadorsDeclinedWithReason: ["Gabriel"],
          ambassadorsDeclinedWithoutReason: ["Louis"],
          assignedAmbassadors: ["N/A"],
          ambassadorIC: "N/A",
          attire: "Polo T-Shirt",
          purposeOfTour: ["School facilities"],
          guestProfile: "Students",
          checkPoints: ["Admin Building", "LKS Library", "Campus Green"],
          startPoint: "Admin Building",
          endPoint: "Admin Building",
          remarks: "Another random remark",
          office: "OUAFA",
          officePhoneContact: "92367762",
          officeEmailContact: "gabriel.koh.2016@smu.edu.sg",
          officeLiaison: "John Doe",
          status: "Announced"
        }
      ];
    },

    emailOffice() {
      //TODO: to change this algo
      let tour = this.viewItem;
      let tours = this.tours;
      tour.status = "Completed";
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
      let assignedAmbassadors = item.assignedAmbassadors;
      let ambassadorIC = item.ambassadorIC;
      if (
        assignedAmbassadors.length === 0 ||
        assignedAmbassadors.includes("N/A") ||
        ambassadorIC === null ||
        ambassadorIC === ""
      ) {
        return false;
      } else {
        return true;
      }
    },

    emailAnnounceItem(item) {
      this.viewItem = Object.assign({}, item);
      this.emailAnnounceDialog = true;
    },

    emailOfficeItem(item) {
      this.viewItem = Object.assign({}, item);
      this.emailOfficeDialog = true;
    },

    assignItem(item) {
      this.viewItem = Object.assign({}, item);
      this.assignDialog = true;
    },

    assignAmbassadorsAutomatically() {
      //TODO: Change this algo
      let tour = this.viewItem;
      let tours = this.tours;
      let assignments = [];
      if (tour.numberOfAmbassadorsRequired <= tour.ambassadorsAccepted.length) {
        for (let i = 0; i < tour.numberOfAmbassadorsRequired; i++) {
          assignments.push(tour.ambassadorsAccepted[i]);
        }
        tour.assignedAmbassadors = assignments;
        tour.ambassadorIC = assignments[0];
        tour.status = "Assigned";
        for (let i = 0; i < tours.length; i++) {
          let selectedTour = tours[i];
          if (selectedTour.tourID === tour.tourID) {
            Object.assign(tours[i], tour);
          }
        }
        this.close();
      } else {
        this.close();
      }
    },

    assignAmbassadorsManually(selectedAmbassadors) {
      //TODO: Change this algo
      let tour = this.viewItem;
      let tours = this.tours;
      if (tour.numberOfAmbassadorsRequired <= tour.ambassadorsAccepted.length) {
        tour.assignedAmbassadors = selectedAmbassadors;
        tour.ambassadorIC = selectedAmbassadors[0];
        tour.status = "Assigned";
        for (let i = 0; i < tours.length; i++) {
          let selectedTour = tours[i];
          if (selectedTour.tourID === tour.tourID) {
            Object.assign(tours[i], tour);
          }
        }
        this.close();
      } else {
        this.close();
      }
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.tours.indexOf(item);
      confirm("Are you sure you want to delete this tour?") &&
        this.tours.splice(index, 1);
    },

    getDetails(item) {
      this.viewItem = Object.assign({}, item);
      this.detailsDialog = true;
    },

    getAssignmentDetails(item) {
      this.viewItem = Object.assign({}, item);
      this.assignmentDialog = true;
    },

    getReplyDetails(item) {
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
        this.editedItem = Object.assign({}, this.defaultItem);
        this.viewItem = Object.assign({}, this.defaultItem);
      }, 200);
    },

    save() {
      let editedItem = this.editedItem;
      let tours = this.tours;
      if (editedItem.tourID !== 0) {
        for (let i = 0; i < tours.length; i++) {
          let selectedTour = tours[i];
          if (selectedTour.tourID === editedItem.tourID) {
            Object.assign(this.tours[i], this.editedItem);
          }
        }
      } else {
        editedItem.tourID = Math.floor(Math.random() * Math.floor(100));
        tours.push(editedItem);
      }
      this.close();
    }
  }
};
</script>