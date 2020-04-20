<template>
  <v-card>
    <v-card-title>
      Quick Reports
      <v-spacer></v-spacer>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-row>
        <v-col>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Pesquisa"
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
            v-model="period"
            :items="Period"
            clearable
            label="Periodo"
            return-object
            data-vv-name="Period"
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
          <v-btn small style="height:24px" color="primary" @click="calculate">Update</v-btn>
        </v-col>
        <v-col>
          <vue-excel-xlsx
            :data="items"
            :columns="columns"
            :filename="'ReportTime'"
            :sheetname="period"
          >
            <v-icon>mdi-file-document-outline</v-icon>Download
          </vue-excel-xlsx>
        </v-col>
      </v-row>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          single-select
          :items-per-page="20"
          item-key="code"
          class="elevation-0"
          :loading="loading"
          loading-text="Loading products. Please wait"
        >
          <template slot="headerCell" slot-scope="{ header }">
            <tr>
              <th>
                <span
                  class="subheading font-weight-light text--darken-3"
                  v-text="slipt(header.text,0)"
                />
              </th>
            </tr>
            <tr>
              <th>
                <span
                  class="subheading font-weight-light text--darken-3"
                  v-text="slipt(header.text,1)"
                />
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="{ item }">
            <td>{{ item.name }}</td>
            <td>
              <v-icon
                small
                :color="getColor(item.monday)"
                v-if="!item.monday ==''"
              >mdi-checkbox-blank-circle</v-icon>
            </td>
            <td>
              <v-icon
                small
                :color="getColor(item.tuesday)"
                v-if="!item.tuesday ==''"
              >mdi-checkbox-blank-circle</v-icon>
            </td>
            <td>
              <v-icon
                small
                :color="getColor(item.wednesday)"
                v-if="!item.wednesday ==''"
              >mdi-checkbox-blank-circle</v-icon>
            </td>
            <td>
              <v-icon
                small
                :color="getColor(item.thursday)"
                v-if="!item.thursday ==''"
              >mdi-checkbox-blank-circle</v-icon>
            </td>
            <td>
              <v-icon
                small
                :color="getColor(item.friday)"
                v-if="!item.friday ==''"
              >mdi-checkbox-blank-circle</v-icon>
            </td>
            <td>
              <v-icon
                small
                :color="getColor(item.saturday)"
                v-if="!item.saturday ==''"
              >mdi-checkbox-blank-circle</v-icon>
            </td>
            <td>
              <v-icon
                small
                :color="getColor(item.sunday)"
                v-if="!item.sunday ==''"
              >mdi-checkbox-blank-circle</v-icon>
            </td>
            <td>{{ item.totalDayEarly }}</td>
            <td>{{ item.totalDayLate }}</td>
            <td>{{ item.totalAbsent }}</td>
          </template>
        </v-data-table>

        <v-divider></v-divider>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    search: "",
    items: [
      // {
      //   period: "This Week",
      //   name: "Guimarães Mahota",
      //   monday: "Early",
      //   tuesday: "Early",
      //   wednesday: "Late",
      //   thursday: "Absent",
      //   friday: "",
      //   saturday: "",
      //   sunday: "",
      //   totalDayEarly: 2,
      //   totalDayLate: 1,
      //   totalAbsent: 1
      // },
      // {
      //   period: "This Week",
      //   name: "Nelson Moaine",
      //   monday: "Absent",
      //   tuesday: "Late",
      //   wednesday: "Late",
      //   thursday: "Early",
      //   friday: "",
      //   saturday: "",
      //   sunday: "",
      //   totalDayEarly: 1,
      //   totalDayLate: 2,
      //   totalAbsent: 1
      // }
    ],
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
    Period: ["Week", ""],
    period: "Week",
    dialog: false,
    formTitle: "Employees Data",
    loading: false,

    defaultWeekdays: [],
    days: [],
    headers: [],
    columns: []
  }),

  created() {
    //this.postData();
    this.initData();
  },

  async beforeMount() {
    this.loading = !this.loading;
    try {
      this.Locations = [];
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
    } catch (e) {
      console.log(e);

      alert(
        "Ocorreu um erro durante a gravação da localização. Contacte os Administradores do Sistema!!"
      );
    }
    this.loading = !this.loading;
  },

  methods: {
    slipt(item, i) {
      return item.split(" ")[i];
    },

    async postData() {
      axios
        .post("https://mahotacrm.firebaseio.com/tests.json", {
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

    async getData(period) {
      try {
        let self = this;

        this.defaultWeekdays= [];

        switch (period) {
          case "Week":
            var currentDate = self.$moment();

            var weekStart = currentDate.clone().startOf("isoweek");

            var days = [];

            for (var i = 0; i <= 6; i++) {
              this.defaultWeekdays.push(
                self.$moment(weekStart)
                  .add(i, "days")
                  );


            }

            // this.defaultWeekdays = Array.apply(null, Array(7)).map(function(
            //   _,
            //   i
            // ) {
            //   return self
            //     .$moment(i, "e")
            //     .startOf("week")
            //     .isoWeekday(i + 1);
            // });

            this.days = this.defaultWeekdays;

            this.headers = [
              { text: "Employ Name", value: "name" },
              {
                text: this.defaultWeekdays[0].format("ddd MM/DD/YYYY"),
                value: "segunda"
              },
              {
                text: this.defaultWeekdays[1].format("ddd MM/DD/YYYY"),
                value: "terça"
              },
              {
                text: this.defaultWeekdays[2].format("ddd MM/DD/YYYY"),
                value: "quarta"
              },
              {
                text: this.defaultWeekdays[3].format("ddd MM/DD/YYYY"),
                value: "quinta"
              },
              {
                text: this.defaultWeekdays[4].format("ddd MM/DD/YYYY"),
                value: "sexta"
              },
              {
                text: this.defaultWeekdays[5].format("ddd MM/DD/YYYY"),
                value: "sabado"
              },
              {
                text: this.defaultWeekdays[6].format("ddd MM/DD/YYYY"),
                value: "domingo"
              },
              { text: "TotalDays Early", value: "totalEarly" },
              { text: "TotalDays Late", value: "totalLate" },
              { text: "TotalDays Absent", value: "totalAbsent" },
              { text: "TotalDays H50", value: "totalH50" },
              { text: "TotalDays H100", value: "totalH100" }
            ];

            this.columns = [
              { label: "Employ Name", field: "name" },
              {
                label: this.defaultWeekdays[0].format("MM/DD/YYYY"),
                field: "segunda"
              },
              {
                label: this.defaultWeekdays[1].format("MM/DD/YYYY"),
                field: "terça"
              },
              {
                label: this.defaultWeekdays[2].format("MM/DD/YYYY"),
                field: "quarta"
              },
              {
                label: this.defaultWeekdays[3].format("MM/DD/YYYY"),
                field: "quinta"
              },
              {
                label: this.defaultWeekdays[4].format("MM/DD/YYYY"),
                field: "sexta"
              },
              {
                label: this.defaultWeekdays[5].format("MM/DD/YYYY"),
                field: "sabado"
              },
              {
                label: this.defaultWeekdays[6].format("ddd MM/DD/YYYY"),
                field: "domingo"
              },
              { label: "TotalDays Early", field: "totalEarly" },
              { label: "TotalDays Late", field: "totalLate" },
              { label: "TotalDays Absent", field: "totalAbsent" },
              { label: "TotalDays H50", field: "totalH50" },
              { label: "TotalDays H100", field: "totalH100" }
            ];

            this.getEmployeeWeekData();

            break;
        }
      } catch (e) {
        console.log(e);
      }
    },

    async getEmployeeWeekData() {
      let self = this;
      this.items = [];

      await this.$fireDb
        .ref("employee")
        .orderByChild("location")
        .equalTo(self.location)
        .once("value", function(snapshot) {
          let returnArr = [];
          snapshot.forEach(function(childSnapshot) {
            try {
              var childKey = childSnapshot.key;
              var childData = childSnapshot.val();

              var item = {
                period: self.period,
                name: "Guimarães Mahota",
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null,
                totalDayEarly: 0,
                totalDayLate: 0,
                totalAbsent: 0,
                totalH50: 0,
                totalH100: 0,

                code: childKey,
                name: childData.name,
                status: childData.status,
                Employee: {
                  id: childKey,
                  data: childData
                }
              };

              returnArr.push(item);
            } catch (e) {
              console.log(e);
            }
          });

          self.items = returnArr;

          self.calculateTimeClock();
        });
    },

    async calculateTimeClock() {
      let self = this;

      this.items.forEach(function(item) {
        try {
          item.monday = self.getTimeClock(item.Employee.id, self.days[0]);
          item.tuesday = self.getTimeClock(item.Employee.id, self.days[1]);
          item.wednesday = self.getTimeClock(item.Employee.id, self.days[2]);
          item.thursday = self.getTimeClock(item.Employee.id, self.days[3]);
          item.friday = self.getTimeClock(item.Employee.id, self.days[4]);
          item.saturday = self.getTimeClock(item.Employee.id, self.days[5]);
          item.sunday = self.getTimeClock(item.Employee.id, self.days[6]);
          item.wednesday = self.getTimeClock(item.Employee.id, self.days[7]);
        } catch (e) {
          console.log(e);
        }
      });
    },

    async getTimeClock(employee, date) {
      try {
        await this.$fireDb
          .ref("attendance")
          .orderByChild("date")
          .startAt(this.$moment(date).format("YYYY-MM-DD"))
          .once("value", function(snapshot) {
            let returnArr = [];
            snapshot.forEach(function(childSnapshot) {
              try {
                console.log(childSnapshot.val());
                // var childKey = childSnapshot.key;
                // var childData = childSnapshot.val();

                // var item = {
                //   period: self.period,
                //   name: "Guimarães Mahota",
                //   monday: null,
                //   tuesday: null,
                //   wednesday: null,
                //   thursday: null,
                //   friday: null,
                //   saturday: null,
                //   sunday: null,
                //   totalDayEarly: 0,
                //   totalDayLate: 0,
                //   totalAbsent: 0,
                //   totalH50: 0,
                //   totalH100: 0,

                //   code: childKey,
                //   name: childData.name,
                //   status: childData.status,
                //   Employee: {
                //     id: childKey,
                //     data: childData
                //   }
                // };

                returnArr.push(item);
              } catch (e) {
                console.log(e);
              }
            });

            self.items = returnArr;
          });
      } catch (e) {
        console.log(e);
      }
    },

    async initData() {
      this.loading = !this.loading;

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

    async calculate() {
      this.getData(this.period);
    }
  }
};
</script>
