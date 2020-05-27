<template>
  <v-container cols="12" fluid>
    <v-snackbar color="error" :timeout="timeout" top v-model="snackbarFail">
      {{snackbarText}}
      <v-btn dark text @click="snackbarFail=false">Close</v-btn>
    </v-snackbar>
    <v-row align="center" justify="center" fluid dense>
      <v-col align="center" justify="center" fluid dense>
        <v-card>
          <span class="overline">
            All info for period: {{period.semesterStartDate}} to {{period.semesterEndDate}}.
            <p>If visualisation is marked with *, only current information is available</p>
          </span>
          <div class="ma-5">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="selectedDate"
                  label="Select any date within desired semester"
                  name="date"
                  required
                  v-on="on"
                  dense
                  color="#151c55"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="selectedDate"
                show-current
                no-title
                scrollable
                @input="menu = false"
                color="#7a6c4b"
              ></v-date-picker>
            </v-menu>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row fluid class="ma-3">
      <BiteSizeCard title="Tour King" :value="tourKing" />
      <BiteSizeCard title="Tour Queen" :value="tourQueen" />
      <BiteSizeCard title="Total Tours" :value="totalTours" />
      <BiteSizeCard title="Active Ambassadors*" :value="activeAmbassadors" />
    </v-row>
    <v-row fluid class="ma-3">
      <v-col cols="12" fluid>
        <v-card class="pa-2 mr-2">
          <div class="px-2 py-1 text-capitalize font-weight-medium">Tour Evaluations</div>
          <div class="ml-2 mt-2">
            <span
              class="overline"
            >Evaluation scores are tabulated on semester basis, to tabulate on yearly basis, toggle between two semesters and aggregate manually.</span>
          </div>
          <v-divider></v-divider>
          <v-container fluid>
            <v-row fluid>
              <v-col fluid>
                <v-dialog v-model="detailsDialog" max-width="500px">
                  <TourEvaluationDetailsCard :tourEvaluationDetails="viewItem" :onClose="close" />
                </v-dialog>
                <v-data-table
                  loading-text="Loading..."
                  :headers="headers"
                  :items="evaluationData"
                  sort-by="name"
                  dense
                  :footer-props="{
                    itemsPerPageOptions: [60,80,100,120, -1]
                  }"
                >
                  <template v-slot:item.details="{ item }">
                    <v-icon small class="mr-2" @click="getDetails(item)">mdi-open-in-new</v-icon>
                  </template>
                  <template v-slot:item.passOrFail="{ item }">
                    <div v-show="item.passOrFail">
                      <v-chip color="success" dark x-small class="mr-2">
                        <v-icon x-small>mdi-check-circle</v-icon>
                      </v-chip>
                    </div>
                    <div v-show="!item.passOrFail">
                      <v-chip color="error" dark x-small class="mr-2">
                        <v-icon x-small>mdi-close-circle</v-icon>
                      </v-chip>
                    </div>
                  </template>
                </v-data-table>
              </v-col>
              <v-divider vertical inset></v-divider>
              <v-col md="3">
                <container fluid>
                  <PieChart :chartData="evaluationPieData" :options="pieOptions"></PieChart>
                </container>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row fluid class="ma-3">
      <v-col md="4" fluid>
        <v-card class="pa-2 mr-2">
          <div
            class="mt-1 text-capitalize font-weight-medium"
            align="center"
          >Tours Requested By Offices</div>
          <v-container>
            <BarChart :chartData="officeData" :options="barOptions"></BarChart>
          </v-container>
        </v-card>
      </v-col>
      <v-col md="4" fluid>
        <v-card class="pa-2 mr-2">
          <div
            class="mt-1 text-capitalize font-weight-medium"
            align="center"
          >Mandarin to Non-Mandarin Tour Ratio</div>
          <v-container>
            <PieChart :chartData="mandarinTourData" :options="pieOptions"></PieChart>
          </v-container>
        </v-card>
      </v-col>
      <v-col md="4" fluid>
        <v-card class="pa-2 mr-2">
          <div class="mt-1 text-capitalize font-weight-medium" align="center">Tours By Purpose</div>
          <v-container>
            <BarChart :chartData="purposeOfTourData" :options="barOptions"></BarChart>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row fluid class="ma-3" justify="center">
      <v-col md="4" fluid align="center">
        <v-card class="pa-2 mr-2">
          <div class="mt-1 text-capitalize font-weight-medium" align="center">Tour Figures Trend*</div>
          <v-container>
            <LineChart :chartData="toursTrendData" :options="lineOptions"></LineChart>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BiteSizeCard from "@/components/BiteSizeCard";
import BarChart from "@/components/BarChart";
import PieChart from "@/components/PieChart";
import LineChart from "@/components/LineChart";
import TourEvaluationDetailsCard from "@/components/TourEvaluationDetailsCard";

export default {
  name: "Statistics",

  components: {
    BiteSizeCard,
    BarChart,
    PieChart,
    LineChart,
    TourEvaluationDetailsCard
  },

  data: () => ({
    snackbarFail: false,
    snackbarText: "",
    menu: false,
    detailsDialog: false,
    defaultItem: {
      name: "",
      numberOfTours: null,
      numberOfUEHours: null,
      tourPoints: null,
      replyPoints: null,
      passOrFail: "",
      finalScore: null,
      toursConducted: [],
      tourDeductions: []
    },
    viewItem: {
      name: "",
      numberOfTours: null,
      numberOfUEHours: null,
      tourPoints: null,
      replyPoints: null,
      passOrFail: "",
      finalScore: null,
      toursConducted: [],
      tourDeductions: []
    },

    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Details", value: "details" },
      { text: "Tour No.", value: "numberOfTours" },
      { text: "UE HRs.", value: "numberOfUEHours" },
      { text: "Tour Pts", value: "tourPoints" },
      { text: "Reply Pts", value: "replyPoints" },
      { text: "Pass?", value: "passOrFail" },
      { text: "Final Pts", value: "finalScore" }
    ],
    evaluationData: [],
    mandarinTourData: null,
    toursTrendData: null,
    evaluationPieData: null,
    officeData: null,
    purposeOfTourData: null,
    barOptions: null,
    pieOptions: null,
    lineOptions: null,
    tourKing: "",
    tourQueen: "",
    totalTours: "0",
    activeAmbassadors: "",
    period: {
      semesterStartDate: null,
      semesterEndDate: null
    },
    selectedDate: new Date().toISOString().substr(0,10)
  }),

  mounted() {
    this.loadData(new Date().toISOString().substr(0,10));
  },

  watch: {
    selectedDate: function(){
      this.loadData(this.selectedDate)
    }
  },

  methods: {
    loadData(date) {
      this.$http
        .get(`statistics/${date}`)
        .then(response => {
          let statistics = response.data.statistics;
          this.period.semesterStartDate = statistics.startDate;
          this.period.semesterEndDate = statistics.endDate;

          let tourKingArr = statistics.tourKing.map(king => {
            return `${king.name} (${king.count})`;
          });
          this.tourKing = tourKingArr.join(", ");

          let tourQueenArr = statistics.tourQueen.map(queen => {
            return `${queen.name} (${queen.count})`;
          });
          this.tourQueen = tourQueenArr.join(", ");
          this.totalTours = statistics.tourCount;
          this.activeAmbassadors = `${statistics.ambassadorAvailableCount}/${statistics.ambassadorCount}`;

          this.fillMandarinTourData(
            statistics.mandarinTourCount,
            statistics.nonMandarinTourCount
          );

          let tourCountTrendLabel = [];
          let tourCountTrendData = [];
          statistics["toursGroupByYearCount"].map(tour => {
            tourCountTrendLabel.push(tour._id);
            tourCountTrendData.push(tour.count);
          });
          this.fillToursTrendData(tourCountTrendLabel, tourCountTrendData);

          let tourOfficeLabel = [];
          let tourOfficeData = [];
          statistics["toursGroupByOfficeCount"].map(tour => {
            tourOfficeLabel.push(tour._id);
            tourOfficeData.push(tour.count);
          });
          this.fillOfficeData(tourOfficeLabel, tourOfficeData);

          let tourPurposeLabel = [];
          let tourPurposeData = [];
          statistics["toursGroupByPurposeCount"].map(tour => {
            tourPurposeLabel.push(tour._id);
            tourPurposeData.push(tour.count);
          });
          this.fillPurposeOfTourData(tourPurposeLabel, tourPurposeData);

          let numPass = 0;
          let numFail = 0;
          this.evaluationData = Object.keys(statistics.tourEvaluations).map(
            key => {
              let ambassador = statistics.tourEvaluations[key];
              if (ambassador.pass) {
                numPass += 1;
              } else {
                numFail += 1;
              }

              return {
                name: ambassador.name,
                numberOfTours: ambassador.toursConducted.length,
                numberOfUEHours: ambassador.UEHours,
                tourPoints: ambassador.tourPoints,
                replyPoints: ambassador.replyPoints,
                passOrFail: ambassador.pass,
                finalScore: ambassador.finalPoints,
                toursConducted: ambassador.toursConducted,
                tourDeductions: ambassador.tourDeductions
              };
            }
          );

          this.fillEvaluationPieData(numPass, numFail);
        })
        .catch(error => {
          console.log(error)
          const message = error.response.data.message ? error.response.data.message : "Loading failed. Please contact Tours Portfolio Head/EXCO/Platform Administrator.";
          this.snackbarFail = true;
          this.snackbarText = message;
          console.log(error);
        });
      this.fillBarOptions();
      this.fillPieOptions();
      this.fillLineOptions();
    },

    getDetails(item) {
      this.viewItem = Object.assign({}, item);
      this.detailsDialog = true;
    },

    close() {
      this.detailsDialog = false;
      setTimeout(() => {
        this.viewItem = Object.assign({}, this.defaultItem);
      }, 200);
    },

    fillEvaluationPieData(passCount, failCount) {
      this.evaluationPieData = {
        labels: ["Pass", "Fail"],
        datasets: [
          {
            backgroundColor: ["#978c69", "#7a6c4b"],
            data: [passCount, failCount]
          }
        ]
      };
    },

    fillOfficeData(labels, data) {
      this.officeData = {
        labels: labels,
        datasets: [
          {
            label: "Number of Tours",
            backgroundColor: "#978c69",
            data: data
          }
        ]
      };
    },

    fillPurposeOfTourData(labels, data) {
      this.purposeOfTourData = {
        labels: labels,
        datasets: [
          {
            label: "Types of Tours",
            backgroundColor: "#978c69",
            data: data
          }
        ]
      };
    },

    fillMandarinTourData(mandarinTourCount, nonMandarinTourCount) {
      this.mandarinTourData = {
        labels: ["Mandarin", "Non Mandarin"],
        datasets: [
          {
            backgroundColor: ["#978c69", "#7a6c4b"],
            data: [mandarinTourCount, nonMandarinTourCount]
          }
        ]
      };
    },

    fillPieOptions() {
      this.pieOptions = {
        responsive: true,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        }
      };
    },

    fillBarOptions() {
      this.barOptions = {
        responsive: true,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      };
    },

    fillLineOptions() {
      this.lineOptions = {
        responsive: true,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        }
      };
    },

    fillToursTrendData(labels, data) {
      this.toursTrendData = {
        labels: labels,
        datasets: [
          {
            label: "Number of Tours",
            backgroundColor: "#978c69",
            data: data
          }
        ]
      };
    }
  }
};
</script>