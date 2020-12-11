<template>
 <v-container fill-height fluid grid-list-xl>
    <v-layout wrap>
      <v-flex md12 lg12 row>
        <text>Localizações</text>
        <v-spacer></v-spacer>
        <v-btn text small color="primary" @click="addLocation">+ Nova Localização</v-btn>
        <v-spacer></v-spacer>

        <nuxt-child />

        <v-flex md4 sm4 lg4 v-for="loc in Locations" :key="loc.id">

        </v-flex>
      </v-flex>
    </v-layout>
    </v-container>
</template>

<script>
// Utilities
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  head: {
    title: "List Off Locations"
  },
  computed: {
    ...mapState({
      Locations: state => state.location.Locations
    })
  },
  async fetch() {
    await this.$store.dispatch("location/loadAllLocations");

    await this.Locations.forEach((value, index) => {
      this.$store.dispatch("location/getAllEmployee",{ locationId:value.id });
    });

  },
};
</script>

<style lang="scss" scoped>
</style>
