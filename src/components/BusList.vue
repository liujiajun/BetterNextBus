<template>
    <div id="bus-list">
        <v-container class="pt-0 mt-3">
            <announcement-box class=""/>
            <v-slide-y-transition
                    class="mt-3"
                    group
            >
                <v-col :cols="12"
                       :key="i"
                       v-for="(service, i) in service_timings"
                >
                    <v-skeleton-loader
                            :loading="loading_new"
                            height="148"
                            type="list-item-avatar-three-line"
                    >
                        <v-card
                                class="pt-0 mt-0"
                                :color="$vuetify.theme.dark ? 'grey darken-3' : 'teal'"
                                dark
                        >
                            <v-list-item two-line>
                                <v-list-item-avatar color="white" size="48">
                                    <v-icon :color="$vuetify.theme.dark ? 'teal' : 'teal'">mdi-bus</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-container class="pa-0">
                                        <v-row justify="space-between">
                                            <v-col cols="6">
                                                <v-list-item-title class="headline">
                                                    {{getTitle(service.service_name)}}
                                                </v-list-item-title>
                                                <v-list-item-subtitle v-if="hasSubtitle(service.service_name)">
                                                    {{getSubtitle(service.service_name)}}
                                                </v-list-item-subtitle>

                                            </v-col>
                                            <v-col cols="6">
                                                <v-list-item-title class="headline text-right">
                                                    <span class="headline">{{service.arrival_time}}</span>
                                                    <span v-if="service.arrival_time==='1'"> min</span>
                                                    <span v-if="service.arrival_time!=='1' && service.arrival_time!=='Arr' && service.arrival_time!=='-'"> mins </span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="text-right">
                                                    <span>{{service.next_arrival_time}}</span>
                                                    <span v-if="service.next_arrival_time==='1'"> min</span>
                                                    <span v-if="service.next_arrival_time!=='1' && service.next_arrival_time!=='Arr' && service.next_arrival_time!=='-'"> mins </span>
                                                </v-list-item-subtitle>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-list-item-content>
                            </v-list-item>
                            <v-expand-transition>
                                <div v-if="service_timings[i].show_map">
                                    <route-map :bus="getTitle(service_timings[i].service_name)"
                                               :stop="bus_stop_name">
                                    </route-map>
                                </div>
                            </v-expand-transition>
                            <v-card-actions
                                    :class="$vuetify.theme.dark ? 'grey darken-1 text--primary' : 'teal darken-1 text--primary'"
                            >
                                <v-btn
                                        @click="gotoService(getTitle(service_timings[i].service_name))"
                                        icon
                                >
                                    <v-icon color="white">mdi-map-search-outline</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                        @click="showMap(i)"
                                        color="white"
                                        text
                                >
                                    LIVE MAP
                                    <v-icon>
                                        {{ service_timings[i].show_map ? "mdi-chevron-up" : "mdi-chevron-down" }}
                                    </v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-skeleton-loader>
                </v-col>
            </v-slide-y-transition>
            <div class="text-center caption grey--text" v-if="last_update!=null">Updated {{since_last_update}} {{since_last_update === 1 ? 'second' : 'seconds'}} ago</div>
        </v-container>
    </div>
</template>

<script>
    import {RepositoryFactory} from "@/repository/reposiotry-factory";
    import RouteMap from "@/components/RouteMap";
    import AnnouncementBox from "@/components/AnnouncementBox";

    require("promise.prototype.finally").shim();

    export default {
        name: "bus-list",
        components: {
            RouteMap,
            AnnouncementBox
        },
        props: {
            bus_stop_name: String,
        },
        async created() {
            this.timer = setInterval(() => {
                this.updateBusTiming(false);
            }, 15000);
            setInterval(this.updateSinceLastUpdate, 500);
            this.updateBusTiming(true);
        },
        data() {
            return {
                service_timings: [],
                timer: null,
                last_update: null,
                since_last_update: null,
                loading_new: true
            };
        },
        methods: {
            updateSinceLastUpdate() {
                this.since_last_update = Math.ceil(((new Date()).getTime() - this.last_update) / 1000);
            },
            async updateBusTiming(refresh) {
                if (this.bus_stop_name === "" || this.bus_stop_name === null || this.bus_stop_name === undefined) return;
                if (refresh) {
                    this.$emit("onLoadingStateChange", true);
                    try {
                        this.service_timings = await RepositoryFactory.get("serviceTimingAtBusStop").get(this.bus_stop_name);
                    } catch (e) {
                        this.$store.commit("setErrorMessage", "Timed out. Check Internet connection.");
                        this.$store.commit("toggleError", true);
                    }finally {
                        this.$emit("onLoadingStateChange", false);
                        this.loading_new = false;
                    }
                }

                try {
                    let timings = await RepositoryFactory.get("serviceTimingAtBusStop").get(this.bus_stop_name);
                    timings.forEach(service => {
                        let found = this.service_timings.find(x => x.service_name === service.service_name);
                        if (found === undefined || found === null) return;
                        found.arrival_time = service.arrival_time;
                        found.next_arrival_time = service.next_arrival_time;
                        this.last_update = new Date().getTime();
                    });
                } catch (e) {
                    this.$emit("onLoadingStateChange", false);
                }

            },
            showMap(cardIndex) {
                for (let i = 0; i < this.service_timings.length; i++) {
                    if (cardIndex === i) {
                        this.service_timings[cardIndex].show_map = !this.service_timings[cardIndex].show_map;
                    } else {
                        this.service_timings[i].show_map = false;

                    }
                }
            },
            gotoService(name) {
                this.$router.push({
                    name: "service-card",
                    params: {service_name: name}
                })
                    .catch(e => console.log(e));
            },
            hasSubtitle(name) {
                return name.includes("(");
            },
            getSubtitle(name) {
                return name.substring(name.indexOf("(") + 1, name.length - 1);
            },
            getTitle(name) {
                if (name.includes("(")) {
                    return name.substring(0, name.indexOf("("));
                }
                return name;
            }
        },
        watch: {
            "bus_stop_name": async function () {
                this.updateBusTiming(true);
                this.loading_new = true;
            }
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    };
</script>

