<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout wrap>
      <v-flex md12 lg12 row>
        <text>Localizações</text>
        <v-spacer></v-spacer>
        <v-btn text small color="primary" @click="addLocation">+ Nova Localização</v-btn>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex md4 sm4 lg4 v-for="loc in Locations" :key="loc.id">
        <v-card class="mx-auto">
          <v-card-title>
            <v-icon>mdi-map-marker</v-icon>
            <h6>{{loc.location.name}}</h6>
            <v-spacer></v-spacer>

            <v-menu bottom left>
              <template v-slot:activator="{ on }">
                <v-btn dark icon v-on="on">
                  <v-icon color="primary">more_vert</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="(item, i) in items" :key="i" @click="menuAction(item,loc)">
                    <v-list-item-icon>
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-card-title>

          <v-divider></v-divider>
          <v-list>
            <v-list-item-group>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Funcionarios</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  {{getCountEmployee(loc.id)}}
                  <!-- <v-icon >chat_bubble</v-icon> -->
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Clock-In</v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  {{loc.clockIn}}
                  <!-- 10 <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon> -->
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// Utilities
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    location: "",
    //Locations: [],
    items: [
      { id: 1, title: "Invite Employees", icon: "mdi-dialpad" },
      { id: 2, title: "Edit Locations", icon: "mdi-pencil" },
      { id: 3, title: "View Employees", icon: "mdi-account-multiple" },
      { id: 4, title: "Reports", icon: "mdi-playlist-check" },
      { id: 5, title: "Inactive", icon: "mdi-delete-forever" },
      { id: 6, title: "Delete", icon: "mdi-delete" }
    ]
  }),
  computed: {
    Locations() {
      return this.$store.state.location.Locations;
    }
    // ...mapState({
    //   Locations: state => state.location.Locations
    // })
  },
  async fetch() {
    await this.$store.dispatch("location/loadAllLocations");
  },
  methods: {
    async getLocation() {
      try {
        this.Locations = [];

        let self = this;

        for (var i = 0; i < this.Locations.length; i++) {
          var item = this.Locations[i];
          await self.getCount(item.id).then(resolve => {
            this.Locations[i].employees = resolve;
          });
          await self.getCountPickTime(item.id).then(resolve => {
            this.Locations[i].clockIn = resolve;
          });
        }
      } catch (e) {
        console.log(e);

        alert(
          "Ocorreu um erro durante a gravação da localização. Contacte os Administradores do Sistema!!"
        );
      }
    },
    addLocation() {
      this.$router.push(`/location/create`, () => this.$router.go(0));
      this.$forceUpdate();
    },
    async menuAction(item, loc) {
      switch (item.id) {
        case 1:
          this.$router.push(`/location/employees?location=` + loc.id);
          this.$forceUpdate();
          break;
        case 2:
          break;
        case 3:
          this.$router.push(`/location/employees?location=` + loc.id);
          this.$forceUpdate();
          break;
        case 4:
          this.$router.push(`/reports?location=` + loc.id);
          this.$forceUpdate();
          break;
        case 5:
          break;
        case 6:
          let locationRef = this.$fireDb.ref("location/" + loc.id);

          locationRef.remove();

          this.Locations.splice(this.Locations.indexOf(loc), 1);

          break;
      }
    },

    async getCountEmployee(locationId) {
      let count = 0;
      var employees = [];

      await this.Locations.forEach((value, index) => {
        this.$store.dispatch("location/getAllEmployee", {
          locationId: value.id,
          Employees: employees
        });
      });

      console.log(employees);

      return employees.length;
    },

    async getCountPickTime(locationId) {
      let count = 0;

      var ref = this.$fireDb.ref("attendance");

      var a = await ref
        .orderByChild("location")
        .equalTo(locationId)
        .once("value", function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            var date = new Date();
            console.log(date);
            if (
              // date.getDay() === childData.date.dayOfMonth &&
              // date.getMonth() === childData.date.monthValue &&
              // date.getFullYear() === childData.date.year &&
              childData.type === "Clock-In"
            ) {
              count++;
              console.log("0");
            }
          });
        });

      return count;
    },

    async getData() {}
  }
};
</script>
