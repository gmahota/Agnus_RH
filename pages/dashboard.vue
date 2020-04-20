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

      <maps></maps>
    </v-layout>
  </v-container>
</template>

<script>
import materialStatsCard from "~/components/material/AppStatsCard";
import maps from "~/components/base/location/Maps";

import * as geolib from "geolib";
import getDistance from "geolib/es/getDistance";

export default {
  layout: "attendance",
  components: {
    materialStatsCard,
    maps
  },
  data() {
    return {
      processing: false,
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
      Items: [],
      Attendance: {
        Early: 0,
        _Early: "0",
        Late: 0,
        _Late: "0",
        Absent: 0,
        _Absent: "0",
        Total: 0,
        _Total: "0"
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

        await this.$fireDb
          .ref("attendance")
          .orderByChild("date")
          .startAt(this.$moment().format("YYYY-MM-DD"))
          .once("value", function(snapshot) {
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
                  Location: self.getLocation(childData.locationId),
                  phoneNumber: childData.phoneNumber,
                  type: childData.type,
                  status: self.getStatus(childData),
                  geoValidade: self.getGeoStatus(childData)
                };

                returnArr.push(item);
              } catch (e) {
                console.log(e);
              }
            });

            self.Attendance.Early =
              self.Attendance.Total > 0
                ? Math.round(
                    (self.Attendance.Early / self.Attendance.Total) * 100,
                    0
                  )
                : 0;
            self.Attendance.Late =
              self.Attendance.Total > 0
                ? Math.round(
                    (self.Attendance.Late / self.Attendance.Total) * 100,
                    0
                  )
                : 0;
            self.Attendance.Absent =
              self.Attendance.Total > 0
                ? Math.round(
                    (self.Attendance.Absent / self.Attendance.Total) * 100,
                    0
                  )
                : 0;

            self.Attendance._Early = self.Attendance.Early.toFixed(
              0
            ).toString();
            self.Attendance._Late = self.Attendance.Late.toFixed(0).toString();
            self.Attendance._Absent = 0;
            self.Attendance._Total = self.Attendance.Total.toFixed(
              0
            ).toString();

            self.Items = returnArr;
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

      var Location = this.getLocation(item.locationId);
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

      var Location = this.getLocation(item.locationId);

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
      return this.$moment(item).format("MM/DD/YYYY hh:mm a");
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

  mounted: function() {}
};
</script>
<style lang="scss" scoped>
.vue-map-container {
  height: 450px;
  max-width: 992px;
  width: 100%;
}
</style>
