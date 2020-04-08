<template>
  <v-container>
    <v-flex>
      <v-card>
        <v-card-title>
          Attendance
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-row>
            <v-col>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                v-model="location"
                :items="Locations"
                clearable
                label="Locations"
                data-vv-name="location"
                item-text="name"
                item-value="code"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-model="filter"
                :items="Filter"
                clearable
                label="Filter"
                return-object
                data-vv-name="Filter"
                item-text="description"
                item-value="code"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label>
                Early
                <v-icon small color="primary">mdi-checkbox-blank-circle</v-icon>
              </label>
            </v-col>
            <v-col>
              <label>
                Late
                <v-icon small color="yellow">mdi-checkbox-blank-circle</v-icon>
              </label>
            </v-col>
            <v-col>
              <label>
                Missed
                <v-icon small color="error">mdi-checkbox-blank-circle</v-icon>
              </label>
            </v-col>
            <v-col>
              <label>
                Extra Hour 50%
                <v-icon small color="green">mdi-checkbox-blank-circle</v-icon>
              </label>
            </v-col>
            <v-col>
              <label>
                Extra Hour 100%
                <v-icon small color="green">mdi-checkbox-blank-circle</v-icon>
              </label>
            </v-col>
            <v-col>
              <v-btn small style="height:24px" color="primary" @click="createUser">Update</v-btn>
            </v-col>
            <v-col>
              <vue-excel-xlsx
                :data="data"
                :columns="columns"
                :filename="'attendance'"
                :sheetname="'clockTimePicker'"
              >
                <v-icon>mdi-file-document-outline</v-icon>Download
              </vue-excel-xlsx>
            </v-col>
          </v-row>
          <v-row>
            <v-flex>
              <v-data-table
                :headers="headers"
                :items="Items"
                :search="search"
                single-select
                :items-per-page="25"
                item-key="code"
                class="elevation-0"
                :loading="loading"
                loading-text="Loading products. Please wait"
              >
                <template v-slot:items="props">
                  <td>{{ props.Location.name }}</td>
                  <td>{{ props.date }}</td>
                  <td>{{ props.Employee.name }}</td>
                  <td>{{ props.phoneNumber }}</td>
                  <td>{{ props.type }}</td>
                  <td>{{ props.status }}</td>
                </template>
              </v-data-table>
            </v-flex>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
import axios from "axios";
import * as geolib from "geolib";
import getDistance from "geolib/es/getDistance";

export default {
  data: () => ({
    search: "",
    Items: [],
    Employees: [],
    Attendance: [],
    location: "",
    Locations: [],
    Status: [
      {
        code: "Active",
        description: "Active"
      },
      {
        code: "Deactived",
        description: "Deactived"
      },
      {
        code: "Inveted",
        description: "Inveted"
      }
    ],
    Filter: ["This Week", "This Month", "This Year", "All"],
    filter: "This Week",
    dialog: false,
    formTitle: "Employees Data",
    loading: false,
    headers: [
      { text: "Location", value: "Location.name" },
      { text: "Data", value: "date" },
      { text: "Employee", value: "Employee.name" },
      { text: "Phone Number", value: "phoneNumber" },
      { text: "Type", value: "type" },
      { text: "Time Status", value: "status" },
      { text: "Gelocation Status", value: "geoValidade" }
    ],
    columns: [
      { label: "Location", field: "location" },
      { label: "Data", field: "date" },
      { label: "Employee", field: "employee" },
      { label: "Phone Number", field: "phoneNumber" },
      { label: "Type", field: "type" },
      { label: "Time Status", field: "status" },
      { label: "Gelocation Status", field: "geoValidade" }
    ],
    data: []
  }),

  created() {
    //this.postData();
    this.initData();
  },
  watch: {
    location: function() {
      this.Items = this.Attendance.filter(
        p => this.location === "" || p.location === this.location
      );
      this.data = [];
      this.Items.forEach(function(item) {
        this.data.push({
          location: item.Location.name,
          date: item.date,
          employee: item.Employee.name,
          phoneNumber: item.phoneNumber,
          type: item.type,
          status: item.status,
          geoValidade: item.geoValidade
        });
      });
    }
  },

  async beforeMount() {
    try {
      this.Locations = [];
      this.Items = [];
      this.Employees = [];
      this.data = [];
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

      await this.$fireDb.ref("employee").once("value", function(snapshot) {
        let returnArr = [];
        snapshot.forEach(function(childSnapshot) {
          try {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            var item = {
              code: childKey,
              name: childData.name,
              status: childData.status
            };

            returnArr.push(item);

            self.Employees = returnArr;
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
              Employee: self.getEmployee(childData.employee),
              phoneNumber: childData.phoneNumber,
              type: childData.type,
              status: self.getStatus(childData),
              geoValidade: self.getGeoStatus(childData)
            };

            returnArr.push(item);

            self.data.push({
              location: item.Location.name,
              date: item.date,
              employee: item.Employee.name,
              phoneNumber: item.phoneNumber,
              type: item.type,
              status: item.status,
              geoValidade: item.geoValidade
            });

            self.Items = returnArr;
            self.Attendance = returnArr;
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

  methods: {
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
        var clockIn = Location.clockIn;

        var currentTime = this.$moment(clockIn + "a", "HH:mm a");
        var startTime = this.$moment({ h: hour, m: minute });

        var timediff = currentTime.diff(startTime, "minutes");
        var hourDiff = timediff / 60;

        if (timediff >= Location.gracePeriod * -1) {
          return "Early";
        }

        if (hourDiff < 0 && hourDiff * -1 > 8) {
          return "Missed";
        } else {
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

    async postData() {
      axios
        .post("https://mahotacrm.firebaseio.com/attendance.json", {
          period: "This Week",
          name: "Guimarães Mahota",
          monday: "Early",
          tuesday: "Early",
          wednesday: "Late",
          thursday: "Absent",
          friday: "",
          saturday: "",
          sunday: "",
          totalDayEarly: 2,
          totalDayLate: 1,
          totalAbsent: 1
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => console.log(error));
    },

    async getData() {},

    async initData() {
      this.loading = !this.loading;
      this.getData();
      this.loading = !this.loading;
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
  computed: {
    // etc...
  }
};
</script>
