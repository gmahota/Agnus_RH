<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img :src="image" height="100%">
      <v-layout class="fill-height" tag="v-list" column>
        <v-list dense>
          <v-list-item color="white">
            <v-list-item-icon>
              <v-icon color="pink">mdi-star</v-icon>
              <!-- <v-img :src="logo" height="34" contain /> -->
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Ko Attendance</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />

        <v-list dense>
          <v-list-item v-if="responsive">
            <v-text-field class="purple-input search-input" label="Search..." color="purple" />
          </v-list-item>
          <v-list-item
            v-for="(link, i) in links"
            :key="i"
            :to="link.to"
            :active-class="color"
            class="v-list-item"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="link.text" />
          </v-list-item>
        </v-list>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      logo: "/vuetifylogo.png",
      links: [
        {
          to: "/dashboard",
          icon: "mdi-view-dashboard",
          text: "Dashboard"
        },
        // {
        //   to: "/employees",
        //   icon: "mdi-account-multiple",
        //   text: "Employees"
        // },
        {
          to: "/reports/attendance",
          icon: "mdi-clipboard-outline",
          text: "Attendance"
        },
        // {
        //   to: "/reports/quick",
        //   icon: "mdi-file-document-outline",
        //   text: "Quick Reports"
        // },

        {
          to: "/locations",
          icon: "mdi-file-document-outline",
          text: "Localizações"
        }

        // {
        //   to: '/admins',
        //   icon: 'mdi-account-multiple',
        //   text: 'Admins'
        // },
        // {
        //   to: '/user-profile',
        //   icon: 'mdi-account',
        //   text: 'User Profile'
        // },
        // {
        //   to: '/table-list',
        //   icon: 'mdi-clipboard-outline',
        //   text: 'Table List'
        // },
        // {
        //   to: '/typography',
        //   icon: 'mdi-format-font',
        //   text: 'Typography'
        // },
        // {
        //   to: '/icons',
        //   icon: 'mdi-chart-bubble',
        //   text: 'Icons'
        // },
        // {
        //   to: '/maps',
        //   icon: 'mdi-map-marker',
        //   text: 'Maps'
        // },
        // {
        //   to: '/notifications',
        //   icon: 'mdi-bell',
        //   text: 'Notifications'
        // }
      ],
      responsive: true
    };
  },
  computed: {
    ...mapGetters({
      image: "app/getImage",
      color: "app/getColor",
      drawer: "app/getDrawer"
    }),

    inputValue: {
      get() {
        return this.drawer;
      },
      set(val) {
        this.setDrawer(val);
      }
    }
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },
  methods: {
    ...mapActions({
      setDrawer: "app/setDrawer"
    }),

    onResponsiveInverted() {
      this.responsive = window.innerWidth < 991;
    }
  }
};
</script>

<style lang="scss">
#app-drawer {
  &.v-navigation-drawer .v-list {
    background: rgba(27, 27, 27, 0.4);
    padding: 0;
  }

  .v-divider {
    margin: 0;
  }

  .v-list__tile {
    border-radius: 4px;

    &--buy {
      margin-top: auto;
      margin-bottom: 17px;
    }

    &__title {
      color: #ffffff;
    }
  }

  .v-image__image--contain {
    top: 9px;
    height: 60%;
  }

  .search-input {
    margin-bottom: 30px !important;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
