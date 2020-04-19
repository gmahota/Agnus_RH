<template>
  <v-data-table
    item-key="firabase_key"
    :headers="headers"
    :items="employees"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-1" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

export default {
  layout: "default",
  data: () => ({
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "code"
      },
      { text: "Nome", value: "name" },
      { text: "Email", value: "email" },
      {text: 'Contacto', value: "phoneNumber"},
      { text: "Funcao", value: "JobTitle" },
      { text: "Localizacao", value: "location" },
      { text: "Actions", align: "end", value: "actions", sortable: false }
    ],
    
    employees: [],
    firbase_db_url: 'https://iclock-f3c15.firebaseio.com/'
  }),

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize('employees');
  },

  methods: {
    initialize(endpoint) {
      //axios.post('http://localhost:3000/api/test', { data: 'Authenticated'})
      //.then()
    },

    editItem(item) {
      this.$router.push(`employees/${item.name}`);
    },

    deleteItem(item) {
      const index = this.employees.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.employees.splice(index, 1);
    }
  }
};
</script>