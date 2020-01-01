<template>
  <div class="home">
    <v-app>
      <div>
        <v-toolbar
                dark
                color="teal"
        >
          <template v-slot:extension>
            <v-tabs
            v-model="active_tab"
            fixed-tabs
            background-color="transparent">
              <v-tab 
              :to="{ name: 'bus-list', params: {
                bus_stop_name: selected_bus_stop_name,
                routes: routes
              } }"
              >
                <v-icon>mdi-bus-stop</v-icon>
              </v-tab>
              <v-tab to="/services">
                <v-icon>mdi-map-search-outline</v-icon>
              </v-tab>
            </v-tabs>
          </template>
          <v-toolbar-title class="title mr-6 hidden-sm-and-down">BetterNextBus</v-toolbar-title>
          <v-autocomplete
                  :items="bus_stops"
                  v-model="selected_bus_stop_name"
                  v-on:input="$router.push({ name: 'bus-list', params: {
                    bus_stop_name: selected_bus_stop_name,
                    routes: routes
                  }})"
                  prepend-icon="mdi-magnify"
                  label="Which bus stop are you at?"
                  flat
                  hide-details
                  hide-selected
                  auto-select-first
                  item-text="search_field"
                  item-value="name"
                  chips
                  class="mx-4"
                  solo-inverted
          >

            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  Search for a <strong>Bus Stop</strong>
                </v-list-item-title>
              </v-list-item>
            </template>

            <template v-slot:selection="{ attr, on, item, selected }">
              <v-chip
                      v-bind="attr"
                      :input-value="selected"
                      color="blue-grey"
                      class="white--text"
                      close
                      @click:close="selected_bus_stop_name=''"
              >
                <v-icon left>mdi-bus-stop</v-icon>
                <span v-text="item.short_name"></span>
              </v-chip>
            </template>

            <template v-slot:item="{ item }">
              <v-list-item-avatar
                      color="indigo"
                      class="headline font-weight-light white--text"
              >
                {{ item.name.charAt(0) }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.long_name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.short_name"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-bus-stop</v-icon>
              </v-list-item-action>
            </template>
          </v-autocomplete>
          <v-btn icon @click="updateBusStopsByDistance">
            <v-icon>mdi-crosshairs-gps</v-icon>
          </v-btn>
          <v-progress-linear
                  :active="loading"
                  :indeterminate="loading"
                  color="white"
                  absolute
                  bottom
          />
        </v-toolbar>
        <v-snackbar
                v-model="snackbar"
                color="error"
        >
          {{ snackbar_message }}
          <v-btn
                  color="white"
                  text
                  @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
      </div>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  import {RepositoryFactory} from "@/repository/reposiotry-factory";
  // import BusList from "@/components/BusList";
  // import ServiceList from "@/components/ServiceList";

  export default {
    name: 'App',
    components: {
      // BusList,
      // ServiceList,
    },
    mounted() {
      this.selected_bus_stop_name = this.$route.params.bus_stop_name
    },
    async created() {
      this.loading = true;
      try {
        this.bus_stops = await RepositoryFactory.get("busStops").get();
        this.routes = await RepositoryFactory.get("serviceDescriptions").get();
      } catch (e) {
        this.snackbar_message = "Timed out. Check Internet connection.";
        this.snackbar = true;
      } finally {
        this.loading = false
      }

      try {
        for (const route of this.routes) {
          route.check_points = await RepositoryFactory.get("checkPoints").get(route.service_name);
          route.pickup_points = await RepositoryFactory.get("pickupPoints").get(route.service_name);
        }
      } catch (e) {
        this.snackbar_message = "Timed out. Check Internet connection.";
        this.snackbar = true;
      }

    },
    methods: {
      setLoadingState(isLoading) {
        this.loading = isLoading
      },
      async getLocation() {
        return new Promise((resolve, reject) => {

          if (!("geolocation" in navigator)) {
            reject(new Error('Geolocation is not available.'));
          }
          navigator.geolocation.getCurrentPosition(pos => {

            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            });
          }, err => {
            reject(err);
          });

        });
      },
      async locate() {
        try {
          this.location = await this.getLocation();
        } catch (e) {
          if (e.code === e.PERMISSION_DENIED) {
            this.snackbar_message = "Permission denied. Try enabling location service."
          } else if (e.code === e.POSITION_UNAVAILABLE || e.code === e.TIMEOUT) {
            this.snackbar_message = "Geolocation not available at the moment. Try again later."
          } else {
            this.snackbar_message = "Unknown error when getting geolocation."
          }
          this.snackbar = true
          this.loading = false
        }
      },
      updateBusStopsByDistance: function () {
        this.setLoadingState(true);
        this.locate().then(() => {
          this.bus_stops.sort((stop1, stop2) => {
            function getDistance(lat1, lon1, lat2, lon2, unit) {
              if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
              } else {
                var radlat1 = Math.PI * lat1 / 180;
                var radlat2 = Math.PI * lat2 / 180;
                var theta = lon1 - lon2;
                var radtheta = Math.PI * theta / 180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                  dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180 / Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit == "K") {
                  dist = dist * 1.609344
                }
                if (unit == "N") {
                  dist = dist * 0.8684
                }
                return dist;
              }
            }

            var distance1 = getDistance(
                    Number(stop1.latitude),
                    Number(stop1.longitude),
                    this.location.latitude,
                    this.location.longitude,
                    "M"
            );
            var distance2 = getDistance(
                    Number(stop2.latitude),
                    Number(stop2.longitude),
                    this.location.latitude,
                    this.location.longitude,
                    "M"
            );

            if (distance1 > distance2) {
              return 1
            } else if (distance1 < distance2) {
              return -1
            } else {
              return 0
            }
          });
          this.setLoadingState(false)
          this.selected_bus_stop_name = this.bus_stops[0].name
        })
      }
    },
    data() {
      return {
        bus_stops: [],
        routes: [],
        selected_bus_stop_name: "",
        loading: false,
        location: null,
        snackbar: false,
        snackbar_message: "",
        active_tab: "/stops",
      }
    },
    watch: {
      "stop_name": function (new_val) {
        this.selected_bus_stop_name = new_val
      }
    }
  };
</script>

