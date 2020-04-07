<template>
  <v-container fluid grid-list-xs>
    <list />
    <v-btn small fab floating color="success" @click="redirectToCreateEmployee()" top right absolute>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
        <v-flex xs12 md4></v-flex>
  </v-container>
</template>

<script>
import list from "@/components/rh/employees/List.vue";

export default {
  layout: "dashboard",
  data: () => ({}),

  components: {
    list
  },

  methods: {
      redirectToCreateEmployee() {
          this.$router.push('employees/new');
      }
  }
};
</script>