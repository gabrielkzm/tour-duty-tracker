<template>
  <v-container cols="12" fluid>
    <v-row dense>
      <BiteSizeCard title="Tour King!" :value="tourKing" />
      <BiteSizeCard title="Tour Queen!" :value="tourQueen" />
      <BiteSizeCard title="Total Tours" :value="totalTours" />
      <BiteSizeCard title="Active Ambassadors" :value="activeAmbassadors" />
    </v-row>
    <span class="overline">Info for period: {{period.semesterStartDate}} to {{period.currentDate}}</span>
    <v-row fluid class="ma-3">
      <v-col cols="12" fluid>
        <v-card class="pa-2 mr-2">
          <div class="px-2 py-1 text-capitalize font-weight-medium">Tour Evaluations</div>
          <div class="ml-2 mt-2">
            <v-autocomplete
              :items="years"
              dense
              label="Year"
              v-model="selectedYear"
              @change="loadData"
            ></v-autocomplete>
          </div>
          <v-divider></v-divider>
          <v-container fluid>
            <v-row fluid>
              <v-col fluid>
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
                    <v-dialog v-model="detailsDialog" max-width="500px">
                      <TourEvaluationDetailsCard :tourEvaluationDetails="viewItem" :onClose="close" />
                    </v-dialog>
                  </template>
                  <template v-slot:item.passOrFail="{ item }">
                    <div v-show="item.passOrFail === 'pass'">
                      <v-chip color="success" dark x-small class="mr-2">
                        <v-icon x-small>mdi-check-circle</v-icon>
                      </v-chip>
                    </div>
                    <div v-show="item.passOrFail === 'fail'">
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
          <div class="mt-1 text-capitalize font-weight-medium" align="center">Tour Figures Trend</div>
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
import TourEvaluationDetailsCard from '@/components/TourEvaluationDetailsCard';

export default {
  name: "Statistics",

  components: {
    BiteSizeCard,
    BarChart,
    PieChart,
    LineChart,
    TourEvaluationDetailsCard,
  },

  data: () => ({
    detailsDialog: false,
    defaultItem: {
      name: "",
      numberOfTours: null,
      numberOfUEHours: null,
      numberOfLOAAndExchange: null,
      baseScore: null,
      bonusScore: null,
      deductions: null,
      passOrFail: "",
      finalScore: null,
      toursConducted: [],
      toursDeductions: [],
    },
    viewItem: {
      name: "",
      numberOfTours: null,
      numberOfUEHours: null,
      numberOfLOAAndExchange: null,
      baseScore: null,
      bonusScore: null,
      deductions: null,
      passOrFail: "",
      finalScore: null,
      toursConducted: [],
      toursDeductions: [],
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
      { text: "LOA/ISEP", value: "numberOfLOAAndExchange" },
      { text: "Base", value: "baseScore" },
      { text: "Bonus", value: "bonusScore" },
      { text: "Penalities", value: "deductions" },
      { text: "Pass?", value: "passOrFail" },
      { text: "Final Pts", value: "finalScore" }
    ],
    // evaluationData: [],
    evaluationData: [
      {
        name: "Gabriel Koh Zhe Ming",
        numberOfTours: 10,
        numberOfUEHours: 4,
        numberOfLOAAndExchange: 0,
        baseScore: 10,
        bonusScore: 5,
        deductions: 2,
        passOrFail: "pass",
        finalScore: 13,
        toursConducted: ['Tour A', 'Tour B', 'Tour C'],
        toursDeductions: ['Tour D', 'Tour E'],
      },
      {
        name: "Louis Lui Yu Ze",
        numberOfTours: 8,
        numberOfUEHours: 2,
        numberOfLOAAndExchange: 1,
        baseScore: 8,
        bonusScore: 5,
        deductions: 1,
        passOrFail: "pass",
        finalScore: 12,
        toursConducted: ['Tour B', 'Tour C', 'Tour D'],
        toursDeductions: ['Tour A', 'Tour E'],
      },
      {
        name: "Nigel Siew",
        numberOfTours: 4,
        numberOfUEHours: 2,
        numberOfLOAAndExchange: 0,
        baseScore: 5,
        bonusScore: 0,
        deductions: 3,
        passOrFail: "fail",
        finalScore: 2,
        toursConducted: ['Tour D', 'Tour E', 'Tour C'],
        toursDeductions: ['Tour A', 'Tour B'],
      }
    ],
    years: ["2016", "2017", "2018", "2019", "2020"],
    selectedYear: new Date().getFullYear(),
    mandarinTourData: null,
    toursTrendData: null,
    evaluationPieData: null,
    officeData: null,
    purposeOfTourData: null,
    barOptions: null,
    pieOptions: null,
    lineOptions: null,
    tourKing: "Nigel",
    tourQueen: "Bargavi",
    totalTours: "100",
    activeAmbassadors: "50/60",
    period: {
      semesterStartDate: new Date().toISOString().substr(0, 10),
      currentDate: new Date().toISOString().substr(0, 10)
    }
  }),

  mounted() {
    this.loadData(this.selectedYear);
    this.fillEvaluationPieData();
    this.fillOfficeData();
    this.fillPurposeOfTourData();
    this.fillMandarinTourData();
    this.fillToursTrendData();
    this.fillBarOptions();
    this.fillPieOptions();
    this.fillLineOptions();
  },

  methods: {
    loadData(year) {
      return year;
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

    fillEvaluationPieData() {
      this.evaluationPieData = {
        labels: ["Pass", "Fail"],
        datasets: [
          {
            backgroundColor: ["#978c69", "#7a6c4b"],
            data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
      };
    },

    fillOfficeData() {
      this.officeData = {
        labels: [
          "OUAFA",
          "IO",
          "OCCM",
          "SIS",
          "SOL",
          "SOSS",
          "SOA",
          "SOB",
          "SOE",
          "OSL"
        ],
        datasets: [
          {
            label: "Number of Tours",
            backgroundColor: "#978c69",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt()
            ]
          }
        ]
      };
    },

    fillPurposeOfTourData() {
      this.purposeOfTourData = {
        labels: [
          "Donor Related",
          "Partnerships",
          "School facilities",
          "Ushering duty",
          "Entrepreneurship",
          "Learning pedagogy",
          "Others"
        ],
        datasets: [
          {
            label: "Types of Tours",
            backgroundColor: "#978c69",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt()
            ]
          }
        ]
      };
    },

    fillMandarinTourData() {
      this.mandarinTourData = {
        labels: ["Mandarin", "Non Mandarin"],
        datasets: [
          {
            backgroundColor: ["#978c69", "#7a6c4b"],
            data: [this.getRandomInt(), this.getRandomInt()]
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

    fillToursTrendData() {
      this.toursTrendData = {
        labels: ["2016", "2017", "2018", "2019", "2020"],
        datasets: [
          {
            label: "Number of Tours",
            backgroundColor: "#978c69",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt()
            ]
          }
        ]
      };
    },

    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    }
  }
};
</script>