<template>
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
            label="Pesquisa"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            v-model="location"
            :items="Location"
            clearable
            label="Localização"
            return-object
            v-validate="'required'"
            data-vv-name="location"
            item-text="nome"
            item-value="ID"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            v-model="period"
            :items="Period"
            clearable
            label="Periodo"
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
            Cedo:
            <v-icon small color="primary">mdi-checkbox-blank-circle</v-icon>
          </label>
          <label>
            Atrazado:
            <v-icon small color="error">mdi-checkbox-blank-circle</v-icon>
          </label>
          <label>
            Faltou:
            <v-icon small color="danger">mdi-checkbox-blank-circle</v-icon>
          </label>
        </v-col>
        <v-col>
          <v-btn small style="height:24px" color="primary" @click="createUser">Download</v-btn>
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
          <template slot="items" slot-scope="{ item }">
            <td>{{ item.Localizacao }}</td>
            <td>{{ getDate(item.date)}}

            </td>
            <td>
              {{ item.funcionario }}
            </td>
            <td>
               {{ item.telefone }}
            </td>
            <td>
               {{ item.tipo }}
            </td>

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
    Period: ["Esta Semana", ""],
    period: "Esta Semana",
    dialog: false,
    formTitle: "Employees Data",
    loading: false,
    headers: [
      { text: "Localizacao", value: "localizacao" },
      { text: "Data", value: "date" },
      { text: "Funcionario", value: "funcionario" },
      { text: "Telefone", value: "telefone" },
      { text: "Tipo", value: "tipo" }
    ]
  }),

  created() {
    //this.postData();
    this.initData();
  },

  methods: {
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

    async getData() {
      axios
        .get("https://mahotacrm.firebaseio.com/attendance.json")
        .then(response => {
          this.items = [];
          for (const key in response.data) {
            this.items.push({ ...response.data[key], id: key });

          }
        })
        .catch(error => console.log(error));

      axios
        .get("https://mahotacrm.firebaseio.com/localizacoes.json")
        .then(response => {
          this.Location = [];
          this.Location = response.data;

          // for (const key in response.data) {
          //   this.Employees.push({ ...response.data[key] , id: key})
          // }
        })
        .catch(error => console.log(error));
    },

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
      return new Date(2020, item.month, item.date, item.hours, item.minutes, item.seconds,997).toUTCString()
     },
     getFuncionario(item){

     },

     async createUser() {
      try {
        console.log("Foo")
        await this.$fireAuth.createUserWithEmailAndPassword(
          'foo@foo.foo',
          'test'
        )
      } catch (e) {
        handleError(e)
      }
    }


  }
};
</script>
