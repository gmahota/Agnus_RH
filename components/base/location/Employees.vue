<template>
  <v-container>
    <v-flex>
      <v-row>
        <h3>You did it!</h3>
      </v-row>
      <v-row>
        <v-label color="primary">
          Now let's Add Employees to clock in and out of this location
          <v-btn @click="dialog = !dialog">
            <v-icon color="primary">mdi-plus-circle</v-icon>
          </v-btn>
        </v-label>
      </v-row>

      <v-row>
        <v-data-table
          :headers="headers"
          :items="Employees"
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
          <template slot="items" slot-scope="{ item }">
            <td>{{ item.code }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phoneNumber }}</td>
            <td>{{ item.jobTitle }}</td>
            <td>{{ item.notes }}</td>
            <td>{{ item.status }}</td>
            <td>
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </td>
          </template>

          <template v-slot:item.action>
            <v-icon @click="deleteItem" small color="error">mdi-delete</v-icon>
          </template>
        </v-data-table>

        <v-divider></v-divider>
      </v-row>
    </v-flex>

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
              <v-col>
                <v-text-field v-model="employeeModel.jobTitle" label="Job Title"></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  v-model="employeeModel.status"
                  :items="Status"
                  clearable
                  label="Status"
                  data-vv-name="employeeModel.status"
                  item-text="description"
                  item-value="code"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-textarea clearable v-model="employeeModel.notes" label="Notes"></v-textarea>
            </v-row>
          </v-flex>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveEmployee">Gravar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn color="primary" @click="finishSetup">Finish location setup</v-btn>

    <v-btn text>Cancel</v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      e1: 1,
      location: {
        gracePeriod: 0,
        name: ""
      },
      locationKey: "",
      currentLocation: { lat: -25.924, lng: 32.584 },
      searchAddressInput: "",

      center: { lat: -25.924, lng: 32.584 },
      mapTypeId: "terrain",
      markers: [],
      processing: false,

      dialog: false,
      formTitle: "Employees Data",
      loading: false,
      Employees: [],
      employeeModel: {
        code: "",
        name: "",
        email: "",
        phoneNumber: "",
        jobTitle: "",
        notes: "",
        location: null,
        status: null
      },
      headers: [
        { text: "Code", value: "code" },
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "phoneNumber" },
        { text: "Job Tilte", value: "jobTitle" },
        { text: "Notes ", value: "notes" },
        { text: "Status ", value: "status" },
        { text: "Actions", value: "action", sortable: false }
      ],
      Status: [
        { code: "Active", description: "Active" },
        { code: "Deactived", description: "Deactived" },
        { code: "Inveted", description: "Inveted" }
      ]
    };
  },
  async beforeMount(){
    this.locationKey = this.$route.query.location;
    this.employeeModel.location = this.locationKey;
    this.Employees = [];
    let self = this;

    await this.$fireDb.ref("employee").orderByChild("location").equalTo(currentQuery).once("value", function(snapshot) {
        let returnArr = [];
        snapshot.forEach(function(childSnapshot) {
          try {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            var item = {
              code: childKey,
              name: childData.name,
              email:childData.email,
              jobTitle:childData.jobTitle,
              location: childData.location,
              notes:childData.notes,
              phoneNumber:childData.phoneNumber,
              status: childData.status
            };

            returnArr.push(item);

            self.Employees = returnArr;
          } catch (e) {
            console.log(e);
          }
        });
      });
  },
  watch: {
    currentLocation: function() {
      this.location.position = this.currentLocation;
    }
  },
  methods: {
    setLocation: function(item) {
      this.markers = [];

      var position = {
        position: {
          lat: item.latLng.lat(),
          lng: item.latLng.lng()
        }
      };
      this.currentLocation = position.position;

      this.markers.push(position);
    },
    geolocation: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.markers = [];

        var position = {
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        };
        this.markers.push(position);
      });
    },
    searchLocation: function() {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { address: this.searchAddressInput },
        (results, status) => {
          if (status === "OK") {
            this.currentLocation.lat = results[0].geometry.location.lat();
            this.currentLocation.lng = results[0].geometry.location.lng();
          }
        }
      );
    },

    deleteItem(value) {
      this.Employees.splice(value);
    },

    editItem(value) {
      console.log(value);
      this.employeeModel = value;
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.employeeModel = {
        code: "",
        name: "",
        email: "",
        phoneNumber: "",
        jobTitle: "",
        notes: "",
        location: null,
        status: null
      };
    },

    async saveEmployee() {
      try {
        const dataRef = this.$fireDb.ref("employee");

        var newChildRef = dataRef.push();

        await newChildRef.set(this.employeeModel);

        this.Employees.push(this.employeeModel);
        this.close();
      } catch (e) {
        console.log(e);

        alert(
          "Ocorreu um erro durante a gravação da Fúncionario. Contacte os Administradores do Sistema!!"
        );
      }
    },

    async saveLocation() {
      this.processing = true;

      //Validation
      if (this.location.name === "") {
        alert("The location name is mandatory!");
        this.processing = false;
        return;
      }

      try {
        const locationRef = this.$fireDb.ref("location");

        var newChildRef = locationRef.push();

        this.locationKey = newChildRef.key;
        this.employeeModel.location = this.locationKey;

        await newChildRef.set(this.location);
        this.e1 = 2;
      } catch (e) {
        console.log(e);

        alert(
          "Ocorreu um erro durante a gravação da localização. Contacte os Administradores do Sistema!!"
        );
      }

      this.processing = false;
    },
    async updateLocation(e1) {
      this.processing = true;

      try {
        const locationRef = this.$fireDb
          .ref("location")
          .child(this.locationKey);

        await locationRef.update(this.location);
        this.e1 = e1;
      } catch (e) {
        console.log(e);
        alert(
          "Ocorreu um erro durante a actualização da localização. Contacte os Administradores do Sistema!!"
        );
      }

      this.processing = false;
    },

    async finishSetup() {
      console.log;
      var url = `/locations`;

      this.$router.push(url);
    }
  },
  mounted: function() {
    this.geolocation();
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      fullname: "user/getFullname"
    })
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.vue-map-container {
  height: 450px;
  max-width: 992px;
  width: 100%;
}
</style>
