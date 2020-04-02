<template>
<v-layout>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>

      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-icon color="primary" @click="dialog = !dialog">add</v-icon>
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-flex column>
              <v-row>
                <v-col>
                  <v-text-field v-model="employeeModel.code" label="Code"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="employeeModel.name" label="Name"></v-text-field>
                </v-col>
              </v-row>
              <v-row></v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="employeeModel.email" label="Email"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="employeeModel.phoneNumber" label="Phone Number"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-spacer></v-spacer>
                <v-select
                  v-model="employeeModel.location"
                  :items="Location"
                  clearable
                  label="Location"
                  return-object
                  v-validate="'required'"
                  data-vv-name="employeeModel.type"
                  required
                  item-text="ID"
                ></v-select>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <v-select
                    v-model="employeeModel.status"
                    :items="Status"
                    clearable
                    label="Status"
                    return-object
                    v-validate="'required'"
                    data-vv-name="employeeModel.status"
                    required
                    item-text="description"
                    item-value="code"
                  ></v-select>
                </v-col>
              </v-row>
            </v-flex>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="save">Gravar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-row>
        <v-col>
          <v-select
            v-model="location"
            :items="Location"
            clearable
            label="Localização"
            return-object
            v-validate="'required'"
            data-vv-name="location"
            item-text="description"
            item-value="code"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="Employees"
          :search="search"
          single-select
          :items-per-page="25"
          item-key="code"
          class="elevation-0"
          :loading="loading"
          loading-text="Loading products. Please wait"
        >
          <template slot="headerCell" slot-scope="{ header }">
            <span class="subheading font-weight-light text--darken-3" v-text="header.text" />
          </template>
          <template
            slot="items"
            slot-scope="{ item }"
            v-if="!location || item.Localização === location.nome"
          >
            <td>{{ item.ID }}</td>
            <td>{{ item.Nome }}</td>
            <td>{{ item.Telefone }}</td>
            <td>{{ item.Localização }}</td>
            <td>{{ item.Posição }}</td>
            <td>{{ item.Observação }}</td>

            <td class="text-xs-right">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </td>
          </template>
        </v-data-table>

        <v-divider></v-divider>
      </v-row>
    </v-card-text>
  </v-card>
  </v-layout>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    search: "",
    Employees: [],
    employeeModel: {
      code: "",
      name: "",
      phoneNumber: "",
      location: null,
      status: null
    },
    Location: [
      {
        code: "Sede",
        description: "Sede - Maputo"
      },
      {
        code: "Posto2",
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
    product_suppliers: [],

    dialog: false,
    formTitle: "Employees Data",
    loading: false,
    headers: [
      { text: "Codigo", value: "ID" },
      { text: "Nome", value: "Nome" },
      { text: "Telefone", value: "Telefone" },
      { text: "Localização", value: "Localização" },
      { text: "Posição", value: "Posição" },
      { text: "Observação ", value: "Observação" },
      { text: "Actions", value: "action", sortable: false }
    ]
  }),

  methods: {
    async getData() {
      axios
        .get("https://mahotacrm.firebaseio.com/funcionarios.json")
        .then(response => {
          this.Employees = response.data;
          console.log('The employee struture is: ', response.data[0]);
        })
        .catch(error => console.log(error));

      axios
        .get("https://mahotacrm.firebaseio.com/localizacoes.json")
        .then(response => {
          this.Location = response.data;
        })
        .catch(error => console.log(error));
    },

    async putData(data) {
      await axios
        .put(`https://mahotacrm.firebaseio.com/funcionarios/${this.Employees.length}.json`, data)
        .then(response => {
          console.log('The newrly created data is: ', response);
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
      let post_employee = {
        "Data de Início": '',
        "Data de Término": '',
        "Colocação": '',
        ID: this.employeeModel.code,
        Nome: this.employeeModel.name,
        email: this.employeeModel.email,
        phoneNumber: this.employeeModel.phoneNumber,
        "Localização": this.employeeModel.location.code,
        status: this.employeeModel.status.code,
        Nr: 1,
        OBS: '',
        "Observação": '',
        "Posição": '',
        Posto: '',
        "Salário Base Mensal": '',
        Telefone: '',
        "Tipo Salario": ''
      };

      this.putData(post_employee);
      this.Employees.push(post_employee);
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
