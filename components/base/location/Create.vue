<template>
  <v-stepper alt-labels v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1" editable>Name Location</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2" editable>
        Set
        <Address></Address>
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 3" step="3" editable>Time Clock Setup</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="4" editable>Add Employees</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-12" height="200px">
          <v-card-text>
            <v-container>
              <v-row>
                <h2>Hi {{fullname}} , let's set up your location.</h2>
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
        </v-card>

        <v-btn color="primary" @click="e1 = 2">Continuar</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" height="800px">
          <v-container>
            <v-row>
              <h2>Next, let's know where your location is.</h2>
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
        </v-card>

        <v-btn color="primary" @click="e1 = 3">Continue</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="primary" @click="e1 = 1">Continue</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      e1: 1,
      location: {},

      currentLocation: { lat: -25.924, lng: 32.584 },
      searchAddressInput: "",

      center: { lat: -25.924, lng: 32.584 },
      mapTypeId: "terrain",
      markers: [
        // { position: { lat: -0.48585, lng: 117.1466 } },
        // { position: { lat: -6.9127778, lng: 107.6205556 } }
      ]
    };
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
            lng:  position.coords.longitude
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
