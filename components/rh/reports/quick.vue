<template>
  <v-container grid-list-xs>
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
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="location"
              :items="Location"
              clearable
              label="Location"
              return-object
              v-validate="'required'"
              data-vv-name="employeeModel.type"
              item-text="description"
              item-value="code"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="period"
              :items="Period"
              clearable
              label="Period"
              return-object
              v-validate="'required'"
              data-vv-name="Period"
              item-text="description"
              item-value="code"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <label>
              Early:
              <v-icon small color="primary">mdi-checkbox-blank-circle</v-icon>
            </label>
            <label>
              Late:
              <v-icon small color="error">mdi-checkbox-blank-circle</v-icon>
            </label>
            <label>
              Absent:
              <v-icon small color="danger">mdi-checkbox-blank-circle</v-icon>
            </label>
          </v-col>
          <v-col>
            <v-btn small style="height:24px" color="primary">Download</v-btn>
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
                <v-icon small
                  :color="getColor(item.monday)"
                  v-if="!item.monday ==''"
                >mdi-checkbox-blank-circle</v-icon>
              </td>
              <td>
                <v-icon small
                  :color="getColor(item.tuesday)"
                  v-if="!item.tuesday ==''"
                >mdi-checkbox-blank-circle</v-icon>
              </td>
              <td>
                <v-icon small
                  :color="getColor(item.wednesday)"
                  v-if="!item.wednesday ==''"
                >mdi-checkbox-blank-circle</v-icon>
              </td>
              <td>
                <v-icon small
                  :color="getColor(item.thursday)"
                  v-if="!item.thursday ==''"
                >mdi-checkbox-blank-circle</v-icon>
              </td>
              <td>
                <v-icon small
                  :color="getColor(item.friday)"
                  v-if="!item.friday ==''"
                >mdi-checkbox-blank-circle</v-icon>
              </td>
              <td>
                <v-icon small
                  :color="getColor(item.saturday)"
                  v-if="!item.saturday ==''"
                >mdi-checkbox-blank-circle</v-icon>
              </td>
              <td>
                <v-icon small
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
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    search: "",
    items: [
      {
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
      },
      {
        period: "This Week",
        name: "Nelson Moaine",
        monday: "Absent",
        tuesday: "Late",
        wednesday: "Late",
        thursday: "Early",
        friday: "",
        saturday: "",
        sunday: "",
        totalDayEarly: 1,
        totalDayLate: 2,
        totalAbsent: 1
      }
    ],
    employeeModel: {
      code: "",
      name: "",
      phoneNumber: "",
      location: null,
      status: null
    },
    location: "",
    Location: [
      {
        code: "Maputo",
        description: "Sede - Maputo"
      },
      {
        code: "Maputo2",
        description: "Posto 2 - Maputo"
      }
    ],
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
    Period: ["This Week", ""],
    period: "This Week",
    dialog: false,
    formTitle: "Employees Data",
    loading: false,
    headers: [
      { text: "Employ Name", value: "name" },
      { text: "Monday 9/3/2020", value: "monday" },
      { text: "Tuesday 10/3/2020", value: "tuesday" },
      { text: "Wednesday 11/3/2020", value: "wednesday" },
      { text: "Thursday 12/3/2020", value: "thursday" },
      { text: "Friday 13/3/2020", value: "friday" },
      { text: "Saturday 14/3/2020", value: "saturday" },
      { text: "Sunday 15/3/2020", value: "sunday" },
      { text: "TotalDays Early", value: "totalEarly" },
      { text: "TotalDays Late", value: "totalLate" },
      { text: "TotalDays Absent", value: "totalAbsent" }
    ]
  }),

  created() {
    //this.postData();
    this.getData();

    
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

    async getData() {
      axios
        .get("https://mahotacrm.firebaseio.com/tests.json")
        .then(response => { 
          for (const key in response.data) {
            this.items.push({ ...response.data[key] , id: key})
          }
        })
        .catch(error => console.log(error));
    },

    getColor(item) {
      switch (item) {
        case "Early":
          return "primary";
        case "Late":
          return "error";
        case "Absent":
          return "danger";
      }
    }
  }
};
</script>
