<template>
  <v-container fluid grid-list-xs>
    <list />
  </v-container>
</template>

<script>
import List from "@/components/users/List.vue";

export default {
  layout: "dashboard",
  data: () => ({}),

  components: {
    List
  },

  methods: {
      redirectToCreateEmployee() {
          this.$router.push('employees/new');
      }
  }
};
</script>