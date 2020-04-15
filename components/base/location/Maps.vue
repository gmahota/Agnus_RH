<template>
  <v-container>
    <v-row>
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
            :title ="m.infoText"
            :label ="m.infoText"
            @click="center=m.position"
          />
        </gmap-map>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      currentLocation: { lat: -25.924, lng: 32.584 },
      searchAddressInput: "",
      location: {
        gracePeriod: 0,
        name: ""
      },
      center: { lat: -25.924, lng: 32.584 },
      mapTypeId: "terrain",
      markers: [],
      Locations: [],
      processing: false
    };
  },
  methods: {
    setLocation: function(item) {
      var position = {
        position: {
          lat: item.latLng.lat(),
          lng: item.latLng.lng()
        }
      };
      this.currentLocation = position.position;
    },

    geolocation: function() {
      try {
        navigator.geolocation.getCurrentPosition(position => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
      } catch (e) {}
    },
    searchLocation: function() {
      try {
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
      } catch (e) {}
    },
    async initData() {
      try {
        this.Locations = [];

        this.markers = [];

        let self = this;

        await this.$fireDb.ref("location").once("value", function(snapshot) {
          let returnArr = [];
          snapshot.forEach(function(childSnapshot) {
            try {
              var childKey = childSnapshot.key;
              var childData = childSnapshot.val();

              var item = {
                code: childKey,
                name: childData.name,
                clockIn: childData.clockIn,
                clockOut: childData.clockOut,
                gracePeriod: childData.gracePeriod,
                position: childData.position
              };

              returnArr.push(item);

              var position = {
                position: {
                  lat: item.position.lat,
                  lng: item.position.lng
                },
                infoText:item.name
              };
              self.markers.push(position);

              self.Locations = returnArr;
            } catch (e) {
              console.log(e);
            }
          });
        });
      } catch (e) {
        console.log(e);

        alert(
          "Ocorreu um erro durante a gravação da localização. Contacte os Administradores do Sistema!!"
        );
      }
    },

    slipt(item, i) {
      return item.split(" ")[i];
    },
    getDate(item) {
      var value = new Date(
        item.year,
        item.monthValue,
        item.dayOfMonth,
        item.hour,
        item.minute,
        item.second,
        997
      ).toISOString();

      return this.$moment(String(value)).format("MM/DD/YYYY hh:mm a");
    }
  },
  created() {
    this.initData();
  },

  mounted: function() {
    this.$gmapDefaultResizeBus;
    this.geolocation();
  }
};
</script>
<style lang="scss" scoped>
.vue-map-container {
  height: 450px;
  max-width: 992px;
  width: 100%;
}
</style>
