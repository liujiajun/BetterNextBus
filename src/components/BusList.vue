<template>
    <div id="bus-list">
        <v-container
                class="pt-0 mt-0">
            <v-slide-y-transition
                    group
                    tag="v-row"
            >
                <v-col v-for="(service, i) in service_timings"
                       :key="i"
                       :cols="12"
                >
                    <v-card
                            color="teal"
                            dark
                            class="pt-0 mt-0"
                    >
                        <v-list-item two-line>
                            <v-list-item-avatar color="white" size="48">
                                <v-icon color="teal">mdi-bus</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-container class="pa-0">
                                    <v-row justify="space-between">
                                        <v-col cols="6">
                                            <v-list-item-title class="headline">{{service.service_name}}
                                            </v-list-item-title>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-list-item-title class="headline text-right">
                                                <span class="headline">{{service.arrival_time}}</span>
                                                <span v-if="service.arrival_time=='1'"> min</span>
                                                <span v-if="service.arrival_time!='1' && service.arrival_time!='Arr' && service.arrival_time!='-'"> mins </span>
                                            </v-list-item-title>
                                            <v-list-item-subtitle class="text-right">
                                                <span>{{service.next_arrival_time}}</span>
                                                <span v-if="service.next_arrival_time=='1'"> min</span>
                                                <span v-if="service.next_arrival_time!='1' && service.next_arrival_time!='Arr' && service.next_arrival_time!='-'"> mins </span>
                                            </v-list-item-subtitle>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-list-item-content>
                        </v-list-item>
                        <v-expand-transition>
                            <div v-if="service_timings[i].show_map">
                                <route-map :bus="service_timings[i].service_name" :stop="bus_stop_name"></route-map>
                            </div>
                        </v-expand-transition>
                        <v-card-actions class="teal darken-1 text--primary">
                            <v-btn
                                    icon
                                    @click="gotoService(service_timings[i].service_name)"
                            >
                                <v-icon color="white">mdi-map-search-outline</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                    color="white"
                                    text
                                    @click="showMap(i)"
                            >
                                LIVE MAP
                                <v-icon>{{ service_timings[i].show_map ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                </v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-slide-y-transition>
<!--            <v-row class="pt-0 mt-0">-->
<!--                <v-col v-for="(service, i) in service_timings"-->
<!--                       :key="i"-->
<!--                       :cols="12"-->
<!--                >-->
<!--                    <v-card-->
<!--                            color="teal"-->
<!--                            dark-->
<!--                            class="pt-0 mt-0"-->
<!--                    >-->
<!--                        <v-list-item two-line>-->
<!--                            <v-list-item-avatar color="white" size="48">-->
<!--                                <v-icon color="teal">mdi-bus</v-icon>-->
<!--                            </v-list-item-avatar>-->
<!--                            <v-list-item-content>-->
<!--                                <v-container class="pa-0">-->
<!--                                    <v-row justify="space-between">-->
<!--                                        <v-col cols="6">-->
<!--                                            <v-list-item-title class="headline">{{service.service_name}}-->
<!--                                            </v-list-item-title>-->
<!--                                        </v-col>-->
<!--                                        <v-col cols="6">-->
<!--                                            <v-list-item-title class="headline text-right">-->
<!--                                                <span class="headline">{{service.arrival_time}}</span>-->
<!--                                                <span v-if="service.arrival_time=='1'"> min</span>-->
<!--                                                <span v-if="service.arrival_time!='1' && service.arrival_time!='Arr' && service.arrival_time!='-'"> mins </span>-->
<!--                                            </v-list-item-title>-->
<!--                                            <v-list-item-subtitle class="text-right">-->
<!--                                                <span>{{service.next_arrival_time}}</span>-->
<!--                                                <span v-if="service.next_arrival_time=='1'"> min</span>-->
<!--                                                <span v-if="service.next_arrival_time!='1' && service.next_arrival_time!='Arr' && service.next_arrival_time!='-'"> mins </span>-->
<!--                                            </v-list-item-subtitle>-->
<!--                                        </v-col>-->
<!--                                    </v-row>-->
<!--                                </v-container>-->
<!--                            </v-list-item-content>-->
<!--                        </v-list-item>-->
<!--                        <v-expand-transition>-->
<!--                            <div v-if="service_timings[i].show_map">-->
<!--                                <route-map :bus="service_timings[i].service_name" :stop="bus_stop_name"></route-map>-->
<!--                            </div>-->
<!--                        </v-expand-transition>-->
<!--                        <v-card-actions class="teal darken-1 text&#45;&#45;primary">-->
<!--                            <v-btn-->
<!--                                    icon-->
<!--                                    @click="gotoService(service_timings[i].service_name)"-->
<!--                            >-->
<!--                                <v-icon color="white">mdi-map-search-outline</v-icon>-->
<!--                            </v-btn>-->
<!--                            <v-spacer></v-spacer>-->
<!--                            <v-btn-->
<!--                                    color="white"-->
<!--                                    text-->
<!--                                    @click="showMap(i)"-->
<!--                            >-->
<!--                                LIVE MAP-->
<!--                                <v-icon>{{ service_timings[i].show_map ? 'mdi-chevron-up' : 'mdi-chevron-down' }}-->
<!--                                </v-icon>-->
<!--                            </v-btn>-->
<!--                        </v-card-actions>-->
<!--                    </v-card>-->
<!--                </v-col>-->
<!--            </v-row>-->
        </v-container>
    </div>
</template>

<script>
    import {RepositoryFactory} from "@/repository/reposiotry-factory";
    import RouteMap from "@/components/RouteMap";

    require('promise.prototype.finally').shim();
    //AIzaSyBx7hn_RmpcwMh7yJVH2JFzo29Oj9EnKOU

    export default {
        name: 'bus-list',
        components: {RouteMap},
        props: {
            bus_stop_name: String,
        },
        async created() {
            this.timer = setInterval(() => {
                this.updateBusTiming(false)
            }, 30000);
            this.updateBusTiming(true)

        },
        data() {
            return {
                service_timings: [],
                timer: '',
            }
        },
        methods: {
            async updateBusTiming(refresh) {
                if (this.bus_stop_name === "" || this.bus_stop_name === null || this.bus_stop_name === undefined) return;

                if (refresh) {
                    this.$emit("onLoadingStateChange", true);
                    try {
                        this.service_timings = await RepositoryFactory.get("serviceTimingAtBusStop").get(this.bus_stop_name);
                    } finally {
                        this.$emit("onLoadingStateChange", false);
                    }
                }

                try {
                    let timings = await RepositoryFactory.get("serviceTimingAtBusStop").get(this.bus_stop_name);
                    timings.forEach(service => {
                        let found = this.service_timings.find(x => x.service_name === service.service_name);
                        if (found === undefined || found === null) return;
                        found.arrival_time = service.arrival_time;
                        found.next_arrival_time = service.next_arrival_time
                    });
                } catch (e) {
                    this.$emit("onLoadingStateChange", false)
                }

            },
            showMap(cardIndex) {
                for(let i=0; i<this.service_timings.length; i++) {
                    if (cardIndex === i) {
                        this.service_timings[cardIndex].show_map = !this.service_timings[cardIndex].show_map;
                    }
                    else {
                        this.service_timings[i].show_map = false;

                    }
                }
            },
            gotoService(name) {
                this.$router.push({
                    name: 'service-card',
                    params: {service_name: name}})
                    .catch(e => console.log(e))
            }
        },
        watch: {
            'bus_stop_name': async function () {
                this.updateBusTiming(true)
            }
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    };
</script>

