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
              @click="
              $router.push({
                name: 'bus-list',
                params: {bus_stop_name: $store.state.stop_selected}})"
              >
                <v-icon>mdi-bus-stop</v-icon>
              </v-tab>
              <v-tab
              @click="$router.push({
                name: 'service-card',
                params: {service_name: $store.state.service_selected}})"
              >
                <v-icon>mdi-map-search-outline</v-icon>
              </v-tab>
              <v-tab
                            @click="$router.push({name: 'favorite-list'})"
                    >
                        <v-icon>
                            mdi-heart-outline
                        </v-icon>
                    </v-tab>
            </v-tabs>
          </template>
          <v-toolbar-title class="title mr-6 hidden-sm-and-down">BetterNextBus</v-toolbar-title>
          <v-autocomplete
                  :items="autocomplete_items"
                  v-model="$store.state.autocomplete_selected"
                  v-on:input="selectFromAutocomplete"
                  label="Enter bus stop or service"
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
                  Search for a <strong>Bus stop</strong> or <strong>Bus service</strong>
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
                      @click:close="$store.commit('setAutocompleteSelected', '')"
              >
                <v-icon left>mdi-bus-stop</v-icon>
                <span v-text="item.type === 'stop' ? item.sub_title : item.title"></span>
              </v-chip>
            </template>

            <template v-slot:item="{ item }">
              <v-list-item-avatar
                      v-if="item.type==='stop'"
                      color="indigo"
                      class="headline font-weight-light white--text"
              >
                {{ item.name.charAt(0) }}
              </v-list-item-avatar>
              <v-list-item-avatar
                      v-if="item.type==='service'"
                      color="orange"
                      class="font-weight-light white--text"
              >
                {{ item.name.length > 4 ? item.name.charAt(0) : item.name }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
                <v-list-item-subtitle v-text="item.sub_title"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon
                        v-if="$store.state.favorites.includes(item.name)"
                        color="red lighten-1"
                >
                  mdi-heart
                </v-icon>
                <v-icon v-else-if="item.type==='stop'">
                  mdi-bus-stop
                </v-icon>
                <v-icon v-else>
                  mdi-bus
                </v-icon>
              </v-list-item-action>
            </template>
          </v-autocomplete>
          <favorite-button
                  :name="$store.state.autocomplete_selected"
                  v-if="autocomplete_items.find(x => x.name === $store.state.autocomplete_selected) !== undefined &&
                  autocomplete_items.find(x => x.name === $store.state.autocomplete_selected).type === 'stop'"
          ></favorite-button>
          <v-btn icon
                 :loading="locating"
                 :disabled="locating"
                 @click="updateBusStopsByDistance">
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
      <announcement-box></announcement-box>
      <keep-alive>
        <router-view @onLoadingStateChange="setLoadingState"></router-view>
      </keep-alive>
      <v-container
              v-if="$route.path==='/'"
              class="text-center pa-10"
      >
        <div class="grey--text">To start, select a bus stop or service.</div>
      </v-container>
    </v-app>
  </div>
</template>

<script>
  import AnnouncementBox from "@/components/AnnouncementBox";
  import FavoriteButton from "@/components/FavoriteButton";

  export default {
    name: 'App',
    components: {
      FavoriteButton,
      AnnouncementBox
    },
    mounted() {
    },
    async created() {
      this.loading = true;
      try {
        await this.$store.dispatch("getStops");
        await this.$store.dispatch('getServices');
      } catch (e) {
        this.snackbar_message = "Timed out. Check Internet connection.";
        this.snackbar = true;
      } finally {
        this.loading = false
      }

      this.$store.commit("toggleFavorite", "");
      this.$store.commit("sortStopsFavoriteFirst");

      if (this.$route.params.bus_stop_name !== undefined) {
        this.$store.commit('setAutocompleteSelected', this.$route.params.bus_stop_name);
      } else if (this.$route.params.service_name !== undefined) {
        this.$store.commit('setAutocompleteSelected', this.$route.params.service_name);
      }

      try {
        for (const service of this.$store.state.services) {
          await this.$store.dispatch("getPickupPoints", service.service_name);
          await this.$store.dispatch("getCheckPoints", service.service_name);
        }
        console.log("Finished loading checkpoints and pick-up points.")
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
          let location = await this.getLocation();
          this.$store.commit("setCurrentLocation", location)
        } catch (e) {
          if (e.code === e.PERMISSION_DENIED) {
            this.snackbar_message = "Permission denied. Try enabling location service."
          } else if (e.code === e.POSITION_UNAVAILABLE || e.code === e.TIMEOUT) {
            console.log(e)
            this.snackbar_message = "Geolocation not available at the moment. Try again later."
          } else {
            this.snackbar_message = "Unknown error when getting geolocation."
          }
          this.snackbar = true;
          this.locating = false;
        }
      },
      updateBusStopsByDistance: function () {
        this.locating = true;
        this.locate().then(() => {
          this.$store.commit("sortStops", this.$store.state.current_location);
          this.locating = false;
          this.$router.push({
            name: 'bus-list',
            params: {bus_stop_name: this.$store.state.stops[0].name}})
                  .catch(e => console.log(e))
        })
      },
      selectFromAutocomplete() {
        let found = this.autocomplete_items
                .find(x => x.name === this.$store.state.autocomplete_selected);
        if (found.type === 'stop') {
          this.$router.push({
            name: 'bus-list',
            params: {bus_stop_name: this.$store.state.autocomplete_selected}})
                  .catch(e => console.log(e))
        } else {
          this.$router.push({
            name: 'service-card',
            params: {service_name: this.$store.state.autocomplete_selected}})
                  .catch(e => console.log(e))
        }
      },
      isFavorite: function (name) {
        return this.$store.state.favorites.includes(name)
      }
    },
    data() {
      return {
        loading: false,
        locating: false,
        location: null,
        snackbar: false,
        snackbar_message: "",
      }
    },
    watch: {
      "$route.path": function () {
        if (this.$route.path.startsWith("/stops")) {
          this.$store.commit('setAutocompleteSelected', this.$route.params.bus_stop_name);
          this.$store.commit("setStopSelected", this.$route.params.bus_stop_name);
        } else if (this.$route.path.startsWith("/services")) {
          this.$store.commit('setAutocompleteSelected', this.$route.params.service_name);
          this.$store.commit("setServiceSelected", this.$route.params.service_name);
        }
      }
    },
    computed: {
      autocomplete_items: function () {
        let res = [];
        for (const stop of this.$store.state.stops) {
          res.push({
            type: 'stop',
            search_field: stop.search_field,
            name: stop.name,
            title: stop.long_name,
            sub_title: stop.short_name
          })
        }

        for (const service of this.$store.state.services) {
          res.push({
            type: 'service',
            search_field: service.service_name + service.description,
            name: service.service_name,
            title: service.service_name,
            sub_title: service.description
          })
        }

        return res
      },
      active_tab: {
        get: function () {
          if (this.$route.path.startsWith("/stops")) return 0;
          else if (this.$route.path.startsWith("/services")) return 1;
          else if (this.$route.path.startsWith("/favorites")) return 2;
          return 0;
        },
        set: function () {

        }
      }
    }
  };
</script>

