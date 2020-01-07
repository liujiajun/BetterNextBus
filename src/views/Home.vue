<template>
    <div class="home">
        <v-app>
            <div>
                <v-toolbar
                        color="teal"
                        dark
                >
                    <template v-slot:extension>
                        <v-tabs
                                background-color="transparent"
                                fixed-tabs
                                v-model="active_tab">

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
                            auto-select-first
                            chips
                            class="mx-4"
                            flat
                            hide-details
                            hide-selected
                            item-text="search_field"
                            item-value="name"
                            label="Enter bus stop or service"
                            solo-inverted
                            v-model="$store.state.autocomplete_selected"
                            v-on:input="selectFromAutocomplete"
                    >

                        <template v-slot:no-data>
                            <v-list-item>
                                <v-list-item-title>
                                    Search for a <strong>Bus stop</strong> or <strong>Bus service</strong>
                                </v-list-item-title>
                            </v-list-item>
                        </template>

                        <template v-slot:selection="{ attr, item, selected }">
                            <v-chip
                                    :input-value="selected"
                                    @click:close="$store.commit('setAutocompleteSelected', '')"
                                    class="white--text"
                                    close
                                    color="blue-grey"
                                    v-bind="attr"
                            >
                                <v-icon left>mdi-bus-stop</v-icon>
                                <span v-text="item.type === 'stop' ? item.sub_title : item.title"></span>
                            </v-chip>
                        </template>

                        <template v-slot:item="{ item }">
                            <v-list-item-avatar
                                    class="headline font-weight-light white--text"
                                    color="indigo"
                                    v-if="item.type==='stop'"
                            >
                                {{ item.name.charAt(0) }}
                            </v-list-item-avatar>
                            <v-list-item-avatar
                                    class="font-weight-light white--text"
                                    color="orange"
                                    v-if="item.type==='service'"
                            >
                                {{ item.name.length > 4 ? item.name.charAt(0) : item.name }}
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.title"></v-list-item-title>
                                <v-list-item-subtitle v-text="item.sub_title"></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-icon
                                        color="red lighten-1"
                                        v-if="$store.state.favorites.includes(item.name)"
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
                    <v-btn :disabled="locating"
                           :loading="locating"
                           @click="updateBusStopsByDistance"
                           icon>
                        <v-icon>mdi-crosshairs-gps</v-icon>
                    </v-btn>
                    <v-progress-linear
                            :active="loading"
                            :indeterminate="loading"
                            absolute
                            bottom
                            color="white"
                    />
                </v-toolbar>
                <v-snackbar
                        color="error"
                        v-model="snackbar"
                >
                    {{ snackbar_message }}
                    <v-btn
                            @click="snackbar = false"
                            color="white"
                            text
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
                    class="text-center pa-10"
                    v-if="$route.path==='/'"
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
        name: "App",
        components: {
            FavoriteButton,
            AnnouncementBox
        },
        mounted() {
        },
        async created() {
            this.loading = true;
            if (this.$route.params.bus_stop_name !== undefined) {
                this.$store.commit("setAutocompleteSelected", this.$route.params.bus_stop_name);
            } else if (this.$route.params.service_name !== undefined) {
                this.$store.commit("setAutocompleteSelected", this.$route.params.service_name);
            }

            this.$store.dispatch("getStops")
                .then(() => {
                    this.$store.commit("toggleFavorite", "");
                    this.$store.commit("sortStops", this.$store.state.current_location);
                })
                .catch(() => {
                    this.snackbar_message = "Timed out. Check Internet connection.";
                    this.snackbar = true;
                })
                .finally(() => {
                    this.loading = false;
                });

            this.$store.dispatch("getServices").catch(() => {
                this.snackbar_message = "Failed to fetch bus services. Check Internet connection.";
                this.snackbar = true;
            });

        },
        methods: {
            setLoadingState(isLoading) {
                this.loading = isLoading;
            },
            async getLocation() {
                return new Promise((resolve, reject) => {

                    if (!("geolocation" in navigator)) {
                        reject(new Error("Geolocation is not available."));
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
                    this.$store.commit("setCurrentLocation", location);
                } catch (e) {
                    if (e.code === e.PERMISSION_DENIED) {
                        this.snackbar_message = "Permission denied. Try enabling location service.";
                    } else if (e.code === e.POSITION_UNAVAILABLE || e.code === e.TIMEOUT) {
                        console.log(e);
                        this.snackbar_message = "Geolocation not available at the moment. Try again later.";
                    } else {
                        this.snackbar_message = "Unknown error when getting geolocation.";
                    }
                    this.snackbar = true;
                    this.locating = false;
                }
            },
            updateBusStopsByDistance: function () {
                this.locating = true;
                this.locate().then(() => {
                    this.locating = false;
                    this.$router.push({
                        name: "bus-list",
                        params: {bus_stop_name: this.$store.state.stops[0].name}
                    })
                        .catch(e => console.log(e));
                });
            },
            selectFromAutocomplete() {
                let found = this.autocomplete_items
                    .find(x => x.name === this.$store.state.autocomplete_selected);
                if (found.type === "stop") {
                    this.$router.push({
                        name: "bus-list",
                        params: {bus_stop_name: this.$store.state.autocomplete_selected}
                    })
                        .catch(e => console.log(e));
                } else {
                    this.$router.push({
                        name: "service-card",
                        params: {service_name: this.$store.state.autocomplete_selected}
                    })
                        .catch(e => console.log(e));
                }
            },
            isFavorite: function (name) {
                return this.$store.state.favorites.includes(name);
            }
        },
        data() {
            return {
                loading: false,
                locating: false,
                location: null,
                snackbar: false,
                snackbar_message: "",
            };
        },
        watch: {
            "$route.path": function () {
                if (this.$route.path.startsWith("/stops")) {
                    this.$store.commit("setAutocompleteSelected", this.$route.params.bus_stop_name);
                    this.$store.commit("setStopSelected", this.$route.params.bus_stop_name);
                } else if (this.$route.path.startsWith("/services")) {
                    this.$store.commit("setAutocompleteSelected", this.$route.params.service_name);
                    this.$store.commit("setServiceSelected", this.$route.params.service_name);
                }
            },
            "$store.state.favorites": function () {
                this.$store.commit("sortStops", this.$store.state.current_location);
            },
            "$store.state.current_location": function (newVal) {
                this.$store.commit("sortStops", newVal);
            }
        },
        computed: {
            autocomplete_items: function () {
                let res = [];
                for (const stop of this.$store.state.stops) {
                    res.push({
                        type: "stop",
                        search_field: stop.search_field,
                        name: stop.name,
                        title: stop.long_name,
                        sub_title: stop.short_name
                    });
                }

                for (const service of this.$store.state.services) {
                    res.push({
                        type: "service",
                        search_field: service.service_name + service.description,
                        name: service.service_name,
                        title: service.service_name,
                        sub_title: service.description
                    });
                }

                return res;
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

