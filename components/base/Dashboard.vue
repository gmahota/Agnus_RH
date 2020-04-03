<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout wrap>
      <v-flex md3
        sm4
        lg4 v-for="item in Locations" :key="item.code">
        <v-card  class="mx-auto">
          <v-card-title>
            <v-icon>mdi-map-marker</v-icon>
            <h6>{{item.nome}}</h6>

            <v-icon color="primary">more_vert</v-icon>
          </v-card-title>
´
          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Funcionarios</v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon>
            </v-list-item-icon>

            <v-divider></v-divider>

            <v-list-item-content>
              <v-list-item-title>Clock-In</v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    location: "",
    Locations: []
  }),

  methods: {
    async getData() {
      axios
        .get("https://mahotacrm.firebaseio.com/localizacoes.json")
        .then(response => {
          this.Locations = response.data;
          console.log(this.Locations);
        })
        .catch(error => console.log(error));
    },

    detailsItem(value) {
      this.Employees.splice(value);
    },

    editItem(value) {
      this.employeeModel = value;
      this.dialog = true;
      //this.$router.push(`/inventory/products/${value.code}`);
    },

    deleteItem(value) {},

    close() {
      this.dialog = false;

      //Reset form
      // this.employeeModel = {
      //   code: "",
      //   name: "",
      //   phoneNumber: "",
      //   location: null,
      //   status: null
      // };
    },

    async save() {
      let created_employee = {
        code: this.employeeModel.code,
        name: this.employeeModel.name,
        email: this.employeeModel.email,
        phoneNumber: this.employeeModel.phoneNumber,
        location: this.employeeModel.location.code,
        status: this.employeeModel.status.code
      };

      // let created_employee = await this.$store.dispatch("postDataAsync", {
      //   api_resourse: "employees",
      //   post_data
      // });

      //console.log(created_employee);

      this.Employees.push(created_employee);
      console.log(this.Employees);
      this.close();
    },

    async initData() {
      this.loading = !this.loading;
      this.getData();
      this.loading = !this.loading;
    }
  },

  created() {
    this.initData();
  }
};
</script>
