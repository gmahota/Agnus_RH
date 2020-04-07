<template>
  <v-stepper alt-labels v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1" editable>Name Location</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2" editable>Set Address</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 3" step="3" editable>Time Clock Setup</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 4" step="4" editable>Add Employees</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-flex>
          <v-card-text>
            <v-container>
              <v-row>
                <h3>Hi {{fullname}} , let's set up your location.</h3>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <v-text-field
                    v-model="location.name"
                    label="Enter location name here e.g. Maputo Post 1"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-flex>

        <v-btn color="primary" @click="saveLocation" :loading="processing">Continuar</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-flex>
          <v-container>
            <v-row>
              <h3>Next, let's know where your location is.</h3>
              <v-col cols="12" sm="12" md="6">
                <v-label color="primary">Your location type</v-label>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-label color="primary">My employees will clock in and out from...</v-label>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-radio-group v-model="location.type" row>
                <v-radio label="A Specific address" value="address"></v-radio>
                <v-radio label="Anywhere in a State/Province" value="state"></v-radio>
                <v-radio label="Anywhere in a country" value="country"></v-radio>
              </v-radio-group>-->
              <v-btn @click="geolocation" color="primary">
                <v-icon>mdi-map-marker</v-icon>
              </v-btn>
              <v-text-field
                prepend-icon="mdi-file-document-outline"
                v-model="searchAddressInput"
                v-on:change="searchLocation()"
                label="Address (city,place)"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-flex md12>
                <gmap-map
                  :center="{lat:currentLocation.lat, lng:currentLocation.lng}"
                  :zoom="17"
                  :options="{disableDefaultUI:true}"
                  :map-type-id="mapTypeId"
                  @click="setLocation"
                >
                  <GmapMarker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    :clickable="true"
                    :draggable="true"
                    @click="center=m.position"
                  />
                </gmap-map>
              </v-flex>
            </v-row>
          </v-container>
        </v-flex>

        <v-btn color="primary" @click="updateLocation(3)">Continue</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-container>
          <v-flex>
            <v-row>
              <h3>Now, set a daily resumption and closing time for employees in this location.</h3>
            </v-row>
            <v-row>
              <v-label color="primary">My employees will clock-in and out at...</v-label>
            </v-row>

            <v-row>
              <v-col md4 sm4 lg3>
                <v-label color="primary">Clock-in time</v-label>
                <v-time-picker v-model="location.clockIn" color="green lighten-1"></v-time-picker>
              </v-col>
              <v-col md4 sm4 lg3>
                <v-label color="primary">Clock-out time</v-label>
                <v-time-picker v-model="location.clockOut" color="green lighten-1"></v-time-picker>
              </v-col>
              <v-col md4 sm4 lg3>
                <v-label color="primary">Grace period</v-label>
                <v-text-field type="number" min="0" v-model="location.gracePeriod"></v-text-field>
              </v-col>
            </v-row>
          </v-flex>
        </v-container>
        <v-btn color="primary" @click="updateLocation(4)">Continue</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="4">
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
                <v-btn color="blue darken-1" text @click="save">Gravar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
        <v-btn color="primary" @click="finishSetup">Finish location setup</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
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
  watch: {
    currentLocation: function() {
      console.log(this.currentLocation);
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

    async save() {
      this.Employees.push(this.employeeModel);

      this.close();
    },

    async saveLocation() {
      this.processing = true;

      if (this.location.name === "") {
        this.processing = false;
        alert("The location name is mandatory!");

        return;
      }

      try {
        const locationRef = this.$fireDb.ref("location");

        var newChildRef = locationRef.push();
        this.locationKey = newChildRef.key;

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
      console.log
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
