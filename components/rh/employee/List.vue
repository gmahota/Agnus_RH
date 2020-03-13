<template>
  <v-container grid-list-xs>
    <v-card>
      <v-card-title>
        Employees
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
                    item-text="description"
                    item-value="code"
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
              label="Location"
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
            :items-per-page="20"
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
              v-if="!location || item.location === location.code"
            >
              <td>{{ item.code }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.phoneNumber }}</td>
              <td>{{ item.location }}</td>
              <td>{{ item.status }}</td>
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
  </v-container>
</template>
<script>
export default {
  data: () => ({
    search: "",
    Employees: [
      {
        code: "C001",
        name: "Guimarães Mahota",
        email: "guimaraesmahota@gmail.com",
        phoneNumber: "+258849535156",
        location: "Sede",
        status: "Active"
      },
      {
        code: "C002",
        name: "Nelson Moiane",
        email: "nelson.moiane@gmail.com",
        phoneNumber: "+2582704988",
        location: "Posto2",
        status: "Active"
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
      { text: "Code", value: "code" },
      { text: "Name", value: "name" },
      { text: "Email Adrress", value: "email" },
      { text: "Phone Number", value: "phoneNumber" },
      { text: "Location", value: "location" },
      { text: "Status", value: "status" },
      { text: "Actions", value: "action", sortable: false }
    ]
  }),

  methods: {
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
      //this.products = await this.$store.dispatch("getDataAsync", "employees");
      this.loading = !this.loading;

      // this.product_types = await this.$store.dispatch(
      //   "getDataAsync",
      //   "products/types"
      // );
      // this.product_suppliers = await this.$store.dispatch(
      //   "getDataAsync",
      //   "products/suppliers"
      // );
      // this.product_statuses = await this.$store.dispatch(
      //   "getDataAsync",
      //   "products/statuses"
      // );
    }
  },

  created() {
    this.initData();
  }
};
</script>
