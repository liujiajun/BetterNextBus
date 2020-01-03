<template>
    <div :id="mapName">
        <v-container fluid class="route-map">

        </v-container>
    </div>
</template>

<script>
    import gmapsInit from '@/utils/gmaps';
    // import axios from "axios"
    import {RepositoryFactory} from "@/repository/reposiotry-factory";

    require('promise.prototype.finally').shim();

    export default {
        name: "route-map",
        props: ['bus', 'stop'],
        data() {
            return {
                mapName: this.stop + "-" + this.bus,
                stop_name: this.stop,
                bus_name: this.bus,
                bus_live_locations: [],
                live_location_markers: {},
                gmap: null,
                google: null,
                timer: null
            }
        },
        methods: {
            getRoute(busName) {
                this.$store.state.services.forEach(route => {
                    if (route.service_name === busName) {
                        // eslint-disable-next-line no-console
                        console.log(route)
                        return route
                    }
                })
            },
            async updateBusLiveLocations() {
                if (this.bus_name === "") return;
                let res = await RepositoryFactory.get("activeBus").get(this.bus_name);
                for (let key in res) {
                    let bus = res[key];
                    if (this.live_location_markers[bus["vehplate"]] === undefined) {
                        // eslint-disable-next-line no-console
                        console.log('initial' + bus["lat"] + " " + bus["lng"]);
                        this.live_location_markers[bus["vehplate"]] = new this.google.maps.Marker({
                            position: new this.google.maps.LatLng(bus["lat"], bus["lng"]),
                            icon: {
                                url: require("@/assets/busmarker_red.png"),
                                anchor: new this.google.maps.Point(18, 18)
                            }
                        });
                        this.live_location_markers[bus["vehplate"]].setMap(this.gmap)
                    } else {
                        // eslint-disable-next-line no-console
                        console.log('updating' + bus["lat"] + " " + bus["lng"]);
                        let marker = this.live_location_markers[bus["vehplate"]];
                        marker.setPosition(new this.google.maps.LatLng(bus["lat"], bus["lng"]))
                    }
                }
            }
        },
        async mounted() {
            try {
                this.google = await gmapsInit();
                const element = document.getElementById(this.mapName).getElementsByClassName("route-map")[0]
                const options = {
                    zoom: 17,
                    center: new this.google.maps.LatLng(1.29199190036396,103.78027611345),
                    disableDefaultUI: true,
                    fullscreenControl: true
                }

                this.gmap = new this.google.maps.Map(element, options);

                //Draw routes and pick up points
                this.$store.state.services.forEach(route => {
                    if (route.service_name === this.bus_name) {
                        let routePath = new this.google.maps.Polyline({
                            path: route.check_points,
                            geodesic: true,
                            strokeColor: 'teal',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });

                        routePath.setMap(this.gmap);

                        route.pickup_points.forEach(point => {
                            if (point.name === this.stop_name) {
                                this.gmap.setCenter(point)
                            }
                            var marker = new this.google.maps.Marker({
                                position: point,
                                label:{text: point.name, color: "white", fontSize: "8px"},
                            });
                            marker.setMap(this.gmap)
                        })
                    }
                });

                this.timer = setInterval(this.updateBusLiveLocations, 5000)
                this.updateBusLiveLocations()
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log(e)
            }
        },
        beforeDestroy () {
            clearInterval(this.timer)
        }
    }
</script>

<style scoped>
    .route-map {
        height: 300px;
        background: gray;
    }
</style>