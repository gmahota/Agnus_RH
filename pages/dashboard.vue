<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout wrap>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="green"
          icon="mdi-store"
          title="Early"
          value
          v-model="Attendance._Early"
          small-value="%"
          sub-icon="mdi-calendar"
          sub-text="Last 24 Hours"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="orange"
          icon="mdi-content-copy"
          title="Late"
          value
          v-model="Attendance._Late"
          small-value="%"
          sub-icon="mdi-alert"
          sub-icon-color="error"
          sub-text="..."
          sub-text-color="text-primary"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="red"
          icon="mdi-information-outline"
          title="Absent"
          value
          v-model="Attendance._Absent"
          small-value="%"
          sub-icon="mdi-tag"
          sub-text="..."
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="info"
          icon="mdi-account"
          title="Time Pick"
          value="0"
          v-model="Attendance._Total"
          sub-icon="mdi-update"
          sub-text="Just Updated"
        />
      </v-flex>
      <v-flex md12 lg6>
        <material-card
          color="orange"
          title="Employee Stats"
          text="New employees on 13th March, 2020"
        >
          <v-data-table :headers="headers" :items="items" hide-actions>
            <template slot="headerCell" slot-scope="{ header }">
              <span class="font-weight-light text-warning text--darken-3" v-text="header.text" />
            </template>
            <template slot="items" slot-scope="{ index, item }">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td class="text-xs-right">{{ item.location }}</td>
              <td class="text-xs-right">{{ item.country }}</td>
              <td class="text-xs-right">{{ item.city }}</td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
      <v-flex md12 lg6>
        <material-card class="card-tabs" color="green">
          <v-flex slot="header">
            <v-tabs v-model="tabs" color="transparent" slider-color="white">
              <span class="subheading font-weight-light mr-3" style="align-self: center">Tasks:</span>
              <v-tab class="mr-3">
                <v-icon class="mr-2">mdi-bug</v-icon>Bugs
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2">mdi-code-tags</v-icon>Website
              </v-tab>
              <v-tab>
                <v-icon class="mr-2">mdi-cloud</v-icon>Server
              </v-tab>
            </v-tabs>
          </v-flex>

          <v-tabs-items v-model="tabs">
            <v-tab-item v-for="n in 3" :key="n">
              <v-list three-line>
                <v-list-tile @click="complete(0)">
                  <v-list-tile-action>
                    <v-checkbox :value="list[0]" color="green" />
                  </v-list-tile-action>
                  <v-list-tile-title>Sincronizar Filial de Xai-xai</v-list-tile-title>
                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <v-btn slot="activator" class="v-btn--simple" color="success" icon>
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip top content-class="top">
                      <v-btn slot="activator" class="v-btn--simple" color="danger" icon>
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
                <v-divider />
                <v-list-tile @click="complete(1)">
                  <v-list-tile-action>
                    <v-checkbox :value="list[1]" color="success" />
                  </v-list-tile-action>
                  <v-list-tile-title>Sincronizar Filial da Beira</v-list-tile-title>
                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <v-btn slot="activator" class="v-btn--simple" color="success" icon>
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip top content-class="top">
                      <v-btn slot="activator" class="v-btn--simple" color="danger" icon>
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
                <v-divider />
                <v-list-tile @click="complete(2)">
                  <v-list-tile-action>
                    <v-checkbox :value="list[2]" color="success" />
                  </v-list-tile-action>
                  <v-list-tile-title>Sincronizar Filial da Nampula</v-list-tile-title>
                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <v-btn slot="activator" class="v-btn--simple" color="success" icon>
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip top content-class="top">
                      <v-btn slot="activator" class="v-btn--simple" color="danger" icon>
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
              </v-list>
            </v-tab-item>
          </v-tabs-items>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import materialCard from "~/components/material/AppCard";
import materialChartCard from "~/components/material/AppChartCard";
import materialStatsCard from "~/components/material/AppStatsCard";

import axios from "axios";
import * as geolib from "geolib";
import getDistance from "geolib/es/getDistance";

export default {
  layout: "dashboard",
  middleware: "authentication",
  components: {
    materialCard,
    materialChartCard,
    materialStatsCard
  },
  data() {
    return {
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]]
        },
        options: {
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]]
        },
        options: {
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De"
          ],
          series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      },
      headers: [
        {
          sortable: false,
          text: "ID",
          value: "id"
        },
        {
          sortable: false,
          text: "Name",
          value: "name"
        },
        {
          sortable: false,
          text: "Localition",
          value: "location",
          align: "right"
        },
        {
          sortable: false,
          text: "Country",
          value: "country",
          align: "right"
        },
        {
          sortable: false,
          text: "City",
          value: "city",
          align: "right"
        }
      ],
      items: [
        {
          name: "Dakota Rice",
          country: "Mozambique",
          city: "Sofala",
          location: "Sofala - Localizao 1",
          salary: "$35,738"
        },
        {
          name: "Minerva Hooper",
          country: "Mozambique",
          city: "Nampula",
          location: "Nampula",
          salary: "$23,738"
        },
        {
          name: "Sage Rodriguez",
          country: "Mozambique",
          city: "Xai-xai",
          location: "Xai-xai",
          salary: "$56,142"
        },
        {
          name: "Philip Chanley",
          country: "Mozambique",
          city: "Maputo",
          location: "Maputo - Sede",
          salary: "$38,735"
        },
        {
          name: "Doris Greene",
          country: "Malawi",
          city: "Matola - Filial 1",
          location: "Matola",
          salary: "$63,542"
        }
      ],
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      },
      Employees: [],
      Employees: [],
      Items: [],
      Attendance: {
        Early: 0,
        _Early: "0",
        Late: 0,
        _Late:"0",
        Absent: 0,
        _Absent:"0",
        Total: 0,
        _Total:"0"
      }
    };
  },
  methods: {
    async initData() {
      try {
        this.Locations = [];
        this.Employees = [];
        this.Items = [];

        let self = this;

        await this.$fireDb.ref("location").once("value", function(snapshot) {
        let returnArr = [];
        snapshot.forEach(function(childSnapshot) {
          try {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            var item = {
              code: childKey,
              name: childData.name,
              clockIn: childData.clockIn,
              clockOut: childData.clockOut,
              gracePeriod: childData.gracePeriod,
              position: childData.position
            };

            returnArr.push(item);

            self.Locations = returnArr;
          } catch (e) {
            console.log(e);
          }
        });
      });

        await this.$fireDb.ref("attendance").once("value", function(snapshot) {
          let returnArr = [];
          snapshot.forEach(function(childSnapshot) {
            try {
              var childKey = childSnapshot.key;
              var childData = childSnapshot.val();

              var item = {
                code: childKey,
                name: childData.name,
                date: self.getDate(childData.date),
                location: childData.location,
                Location: self.getLocation(childData.location),
                //Employee: self.getEmployee(childData.employee),
                phoneNumber: childData.phoneNumber,
                type: childData.type,
                status: self.getStatus(childData),
                geoValidade: self.getGeoStatus(childData)
              };

              returnArr.push(item);

              self.Attendance.Early =
                self.Attendance.Total/ self.Attendance.Early  ;
              self.Attendance.Late =
                self.Attendance.Total/ self.Attendance.Late  ;
              self.Attendance.Absent = self.Attendance.Total/ self.Attendance.Absent  ;

              self.Attendance._Early = self.Attendance.Early.toFixed(0).toString();
              self.Attendance._Late = self.Attendance.Late.toFixed(0).toString();
              self.Attendance._Absent = 0;//self.Attendance.Absent.toString();
              self.Attendance._Total = self.Attendance.Total.toFixed(0).toString();

              self.Items = returnArr;
            } catch (e) {
              console.log(e);
            }
          });
        });

        await this.$fireDb.ref("employee").once("value", function(snapshot) {
          let returnArr = [];
          snapshot.forEach(function(childSnapshot) {
            try {
              var childKey = childSnapshot.key;
              var childData = childSnapshot.val();
              var item = {
                code: childKey,
                name: childData.name,
                email: childData.email,
                jobTitle: childData.jobTitle,
                location: childData.location,
                notes: childData.notes,
                phoneNumber: childData.phoneNumber,
                status: childData.status
              };

              returnArr.push(item);

              self.Employees = returnArr;
            } catch (e) {
              console.log(e);
            }
          });
        });
      } catch (e) {
        console.log(e);

        alert(
          "Ocorreu um erro durante a gravação da localização. Contacte os Administradores do Sistema!!"
        );
      }
    },
    complete(index) {
      this.list[index] = !this.list[index];
    },
    getLocation(item) {
      try {
        return this.Locations.find(p => p.code === item);
      } catch {}
    },
    getEmployee(item) {
      try {
        return this.Employees.find(p => p.code === item);
      } catch {}
    },

    getStatus(item) {
      //Extra Hour 100% Extra Hour 50% Missed Delay Early

      var Location = this.getLocation(item.location);
      var hour = item.date.hour;
      var minute = item.date.minute;

      if (item.type === "Clock-In") {
        this.Attendance.Total++;
        var clockIn = Location.clockIn;

        var currentTime = this.$moment(clockIn + "a", "HH:mm a");
        var startTime = this.$moment({ h: hour, m: minute });

        var timediff = currentTime.diff(startTime, "minutes");
        var hourDiff = timediff / 60;

        if (timediff >= Location.gracePeriod * -1) {
          this.Attendance.Early++;
          return "Early";
        }

        if (hourDiff < 0 && hourDiff * -1 > 8) {
          this.Attendance.Absent++;
          return "Missed";
        } else {
          this.Attendance.Late++;
          return "Late";
        }
      }

      if (item.type === "Clock-Out") {
        var clockOut = Location.clockOut;

        var currentTime = this.$moment(clockOut + "a", "HH:mm a");
        var startTime = this.$moment({ h: hour, m: minute });

        var timediff = currentTime.diff(startTime, "minutes");
        var hourDiff = timediff / 60;

        if (timediff >= Location.gracePeriod * -1) {
          return "Early";
        }

        if (hourDiff < 0 && hourDiff * -1 < 3) {
          return "Extra Hour 50%";
        } else {
          return "Extra Hour 100%";
        }
      }
    },

    getGeoStatus(item) {
      //Extra Hour 100% Extra Hour 50% Missed Delay Early

      var Location = this.getLocation(item.location);

      var distance = getDistance(
        { latitude: Location.position.lat, longitude: Location.position.lng },
        { latitude: item.latitude, longitude: item.longitude }
      );

      distance = geolib.convertDistance(distance, "km");

      if (distance > 2) {
        return "Wrong Location";
      } else {
        return "Good Location";
      }
    },

    slipt(item, i) {
      return item.split(" ")[i];
    },
    getColor(item) {
      switch (item) {
        case "Early":
          return "primary";
        case "Cedo":
          return "primary";
        case "Late":
          return "error";
        case "Atrazado":
          return "error";
        case "Absent":
          return "danger";
        case "Faltou":
          return "danger";
      }
    },
    getDate(item) {
      var value = new Date(
        item.year,
        item.monthValue,
        item.dayOfMonth,
        item.hour,
        item.minute,
        item.second,
        997
      ).toISOString();

      return this.$moment(String(value)).format("MM/DD/YYYY hh:mm a");
    },

    getFuncionario(item) {},

    async createUser() {
      try {
        console.log("Foo");
        await this.$fireAuth.createUserWithEmailAndPassword(
          "foo@foo.foo",
          "test"
        );
      } catch (e) {
        handleError(e);
      }
    }
  },
  created() {
    this.initData();
  },

  mounted() {
    this.$nextTick(() => {
      /*this.dailySalesChart.options = {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        };
        this.dataCompletedTasksChart.options = {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        };*/
    });
  }
};
</script>
