<template>
<v-layout>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>

      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-icon color="primary" @click="dialog = !dialog">add</v-icon>
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
          :items="users"
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
            <td>{{ item.Nome }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phoneNumber }}</td>
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
  </v-layout>
</template>
<script>

export default {
  data: () => ({
    search: "",
    users: [], 
    loading: false,
    headers: [
      { text: "Nome", value: "name" },
      { text: "Email", value: "email" },
      { text: "Celular", value: "phoneNumber" },
      { text: "Estado", value: "status" },
    ]
  }),

  methods: {
    createAuthUser(userToCreate) {
        this.$fireAuth.createUserWithEmailAndPassword(userToCreate.email, userToCreate.password)
        .then((credentials) => 
        { return credentials.user })
        .catch((err) => {
            console.log('Error while creating the user: ', err);    
        });
    },

    deleteItem(value) {},
    editItem(value) {},
  },

  async created() {

    }
};
</script>
