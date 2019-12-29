<template>
    <v-app>
        <div>
            <v-toolbar
                    dark
                    color="teal"
            >
                <v-toolbar-title class="title mr-6 hidden-sm-and-down">Better NextBus</v-toolbar-title>
                <v-autocomplete
                        :items="bus_stops"
                        v-model="selected_bus_stop_name"
                        prepend-icon="mdi-magnify"
                        label="Which bus stop are you at?"
                        flat
                        hide-details
                        hide-selected
                        auto-select-first
                        item-text="search_field"
                        item-value="name"
                        chips
                        clearable
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
                                v-on="on"
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

        <bus-list
                :bus_stop_name="selected_bus_stop_name"
                :routes="routes"
                @onLoadingStateChange="setLoadingState"
        />

    </v-app>
</template>

<script>
    import axios from "axios"
    import BusList from "@/components/BusList";

    export default {
        name: 'App',
        components: {
            BusList
        },
        async created() {
            //Get bus stops
            this.loading = true
            axios.get(this.$hostname + "BusStops")
                .then((response) => response.data["BusStopsResult"]["busstops"].forEach(
                    stop => {
                        this.bus_stops.push({
                            name: stop["name"],
                            caption: stop["caption"],
                            short_name: stop["ShortName"],
                            long_name: stop["LongName"],
                            search_field: stop["ShortName"] + stop["LongName"],
                            latitude: stop["latitude"],
                            longitude: stop["longitude"]
                        })
                    })
                )
                .then(() => this.loading = false)
                .catch(e => {
                    this.loading = false
                    this.snackbar_message = "Timed out. Check Internet connection."
                    this.snackbar = true
                    // eslint-disable-next-line no-console
                    console.log(e)
            });


            let res = await axios.get(this.$hostname + "ServiceDescription")

            res.data["ServiceDescriptionResult"]["ServiceDescription"].forEach(route => {
                this.routes.push({
                    name: route["Route"],
                    description: route["RouteDescription"],
                    checkpoints: [],
                    pickupPoints: []
                })
            })

            this.routes.forEach(route => {
                //Get checkpoints for route drawing
                axios.get(this.$hostname + "CheckPoint?route_code=" + route.name)
                    .then(checkPointRes => {
                        checkPointRes.data["CheckPointResult"]["CheckPoint"].forEach(point => {
                            route.checkpoints.push({lat: point["latitude"], lng: point["longitude"]})
                        });
                    })

                //Get pickup bus stops
                axios.get(this.$hostname + "PickupPoint?route_code=" + route.name)
                    .then(pkPointRes => {
                        pkPointRes.data["PickupPointResult"]["pickuppoint"].forEach(point => {
                            route.pickupPoints.push({
                                lat: point["lat"],
                                lng: point["lng"],
                                name: point["busstopcode"]})
                        });
                    })
            })

            // //Get routes
            // axios.get("https://nnextbus.nus.edu.sg/ServiceDescription",
            //     {
            //         auth: {
            //             username: "NUSnextbus",
            //             password: "13dL?zY,3feWR^\"T"
            //         }
            //     })
            //     .then(response => response.data["ServiceDescriptionResult"]["ServiceDescription"].forEach(route => {
            //         //Get checkpoints
            //         axios.get("https://nnextbus.nus.edu.sg/CheckPoint?route_code=" + route["Route"],
            //             {auth: {username: "NUSnextbus", password: "13dL?zY,3feWR^\"T"}})
            //             .then(checkPointRes => {
            //                 let _checkpoints = [];
            //                 checkPointRes.data["CheckPointResult"]["CheckPoint"].forEach(point => {
            //                     _checkpoints.push({lat: point["latitude"], lng: point["longitude"]})
            //                 });
            //                 this.routes.push({
            //                     name: route["Route"],
            //                     description: route["RouteDescription"],
            //                     checkpoints: _checkpoints
            //                 })
            //             })
            //
            //         //Get pickup points
            //
            //     }
            //         )
            //     )


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
                    // eslint-disable-next-line no-console
                    console.log(e)
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
                snackbar_message: ""
            }
        }
    };
</script>
