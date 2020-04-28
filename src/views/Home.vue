<template>
    <div class="home">
        <v-app>
            <v-app-bar
                    app
                    color="teal"
                    dark
                    hide-on-scroll
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
                <auto-complete-box/>
                <favorite-button
                        :name="$store.state.autocomplete_selected"
                        v-if="$store.state.autocomplete_selected === $store.state.stop_selected"
                />
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
            </v-app-bar>
            <v-content class="fill-height">
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
                <keep-alive>
                    <router-view @onLoadingStateChange="setLoadingState"/>
                </keep-alive>
                <v-container
                        class="text-center pa-10"
                        v-if="$route.path==='/'"
                >
                    <v-img
                            contain
                            height="250"
                            src="../assets/logo.svg"
                    >
                    </v-img>
                    <div class="title justify-center teal--text">Welcome to NUSBuses!</div>
                    <div class="subtitle grey--text">To start, select a bus stop or service.</div>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>

<script>
    import FavoriteButton from "@/components/FavoriteButton";
    import AutoCompleteBox from "@/components/AutoCompleteBox";

    export default {
        name: "App",
        components: {
            AutoCompleteBox,
            FavoriteButton,
        },
        mounted() {
        },
        async created() {
            this.loading = true;
            if (this.$route.params.bus_stop_name !== undefined) {
                this.loading = true;
                this.$store.commit("setAutocompleteSelected", this.$route.params.bus_stop_name);
                this.$store.commit("setStopSelected", this.$route.params.bus_stop_name);
            } else if (this.$route.params.service_name !== undefined) {
                this.$store.commit("setAutocompleteSelected", this.$route.params.service_name);
                this.$store.commit("setServiceSelected", this.$route.params.service_name);
            }

            this.$store.dispatch("getStops")
                .then(() => {
                    this.$store.commit("toggleFavorite", "");
                    this.$store.commit("sortStops", this.$store.state.current_location);
                })
                .catch((e) => {
                    console.log(e);
                    this.snackbar_message = "Timed out. Check Internet connection.";
                    this.snackbar = true;
                })
                .finally(() => {
                    this.loading = false;
                });

            this.$store.dispatch("getServices").catch((e) => {
                console.log(e);
                this.snackbar_message = "Failed to fetch service routes and pick-up points. Check Internet connection.";
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

