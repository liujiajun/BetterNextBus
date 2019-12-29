<template>
  <div id="bus-list">
    <v-container fluid>
      <v-row dense>
        <v-col v-for="(bus, i) in buses"
               :key="i"
               :cols="12"
        >
          <v-card
                  color="teal"
                  dark>
            <v-list-item two-line>
              <v-list-item-avatar color="white" size="48">
                <v-icon color="teal">mdi-bus</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-container class="pa-0">
                  <v-row justify="space-between">
                    <v-col cols="7">
                      <v-list-item-title class="headline">{{bus.name}}</v-list-item-title>
                    </v-col>
                    <v-col cols="5">
                      <v-list-item-title class="headline">
                        <span class="headline">{{bus.arrival_time}}</span>
                        <span v-if="bus.arrival_time=='1'"> min</span>
                        <span v-if="bus.arrival_time!='1' && bus.arrival_time!='Arr' && bus.arrival_time!='-'"> mins </span>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <span>{{bus.next_arrival_time}}</span>
                        <span v-if="bus.next_arrival_time=='1'"> min</span>
                        <span v-if="bus.next_arrival_time!='1' && bus.next_arrival_time!='Arr' && bus.next_arrival_time!='-'"> mins </span>
                      </v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-container>
<!--                <v-list-item-title class="headline">{{bus.name}}</v-list-item-title>-->
                <!--                <v-list-item-subtitle>-->
<!--                  <span class="headline">{{bus.arrival_time}}</span>-->
<!--                  <span v-if="bus.arrival_time=='1'"> min</span>-->
<!--                  <span v-if="bus.arrival_time!='1' && bus.arrival_time!='Arr' && bus.arrival_time!='-'"> mins </span>-->
<!--                </v-list-item-subtitle>-->
<!--                <v-list-item-subtitle>-->
<!--                  <span class="headline">{{bus.next_arrival_time}}</span>-->
<!--                  <span v-if="bus.next_arrival_time=='1'"> min</span>-->
<!--                  <span v-if="bus.next_arrival_time!='1' && bus.next_arrival_time!='Arr' && bus.next_arrival_time!='-'"> mins </span>-->
<!--                </v-list-item-subtitle>-->
              </v-list-item-content>
            </v-list-item>
            <v-expand-transition>
              <div v-if="buses[i].show_map">
                <route-map :routes="routes" :bus="buses[i].name" :stop="bus_stop_name"></route-map>
              </div>
            </v-expand-transition>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                      text
                      @click="showMap(i)"
              >
                LIVE MAP
                <v-icon>{{ buses[i].show_map ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import axios from "axios"
  import RouteMap from "@/components/RouteMap";
  require('promise.prototype.finally').shim();
  //AIzaSyBx7hn_RmpcwMh7yJVH2JFzo29Oj9EnKOU

  export default {
    name: 'bus-list',
    // eslint-disable-next-line vue/no-unused-components
    components: {RouteMap},
    props: {
      bus_stop_name: String,
      routes: Array
    },
    created() {
      this.timer = setInterval(this.updateBusTiming, 30000)
    },
    data() {
      return {
        buses: [],
        timer: '',
        bus_routes: this.routes
      }
    },
    methods: {
      updateBusTiming() {
        if (this.bus_stop_name === "" || this.bus_stop_name == null) return

        axios.get(this.$hostname + "ShuttleService?busstopname=" + this.bus_stop_name)
                .then(response => {
                  response.data["ShuttleServiceResult"]["shuttles"].forEach(
                          element => {
                            for (let i = 0; i<this.buses.length; i++) {
                              if (this.buses[i].name === element["name"]) {
                                this.buses[i].arrival_time = element["arrivalTime"]
                                this.buses[i].next_arrival_time = element["nextArrivalTime"]
                              }
                            }
                          }
                  )
                })
      },
      showMap(cardIndex) {
        this.buses[cardIndex].show_map = !this.buses[cardIndex].show_map
      }
    },
    computed: {

    },
    watch: {
      'bus_stop_name':function (newVal) {
        this.$emit("onLoadingStateChange", true)
        axios.get(this.$hostname + "ShuttleService?busstopname=" + newVal)
                .then(response => {
                  this.buses = [];
                  response.data["ShuttleServiceResult"]["shuttles"].forEach(
                          element => {
                            this.buses.push({
                              name: element["name"],
                              arrival_time: element["arrivalTime"],
                              next_arrival_time: element["nextArrivalTime"],
                              show_map: false
                            })
                          }
                  )
                })
                .finally(() => {
                  this.$emit("onLoadingStateChange", false)
                })
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    }
  };
</script>

<style>

</style>
