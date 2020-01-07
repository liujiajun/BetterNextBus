<template>
    <div id="service-card">
        <v-card class="transparent" flat>
            <v-timeline
                    dense
            >
                <v-timeline-item
                        :color="(i===0 || i===service.pickup_points.length-1) ? 'orange' : 'blue'"
                        :key="i"
                        small
                        v-for="(pickupPoint, i) in service.pickup_points"
                >
                    <v-row class="pt-1">
                        <v-col>
                            <div>
                                {{getStop(pickupPoint.name).short_name}}
                                <v-chip
                                        class="white--text ml-0"
                                        color="green darken-2"
                                        label
                                        small
                                        v-if="getStop(pickupPoint.name).name===nearest_stop_name"
                                >
                                    Nearest
                                </v-chip>
                            </div>
                            <div class="caption">{{getStop(pickupPoint.name).long_name}}</div>
                        </v-col>
                        <v-col class="pr-2 mr-2" cols="1">
                            <favorite-button :name="pickupPoint.name"></favorite-button>
                        </v-col>
                        <v-col class="pr-1 mr-3" cols="2">
                            <v-btn
                                    @click="gotoStop(pickupPoint.name)"
                                    icon
                            >
                                <v-icon>mdi-bus-stop</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>

                </v-timeline-item>
            </v-timeline>
        </v-card>
    </div>
</template>

<script>
    import FavoriteButton from "@/components/FavoriteButton";

    export default {
        name: "service-card",
        components: {FavoriteButton},
        methods: {
            getStop(name) {
                if (this.$store.state.stops.find(x => x.name === name) === undefined)
                    console.log(this.$store.state.stops.find(x => x.name === name) + " " + name);
                return this.$store.state.stops.find(x => x.name === name);
            },
            gotoStop(name) {
                this.$router.push({
                    name: "bus-list",
                    params: {bus_stop_name: name}
                })
                    .catch(e => console.log(e));
            }
        },
        computed: {
            service: function () {
                return this.$store.state.services.find(x => x.service_name === this.$store.state.service_selected);
            },
            nearest_stop_name: function () {
                if (this.$store.state.current_location === null) return "";
                for (const stop of this.$store.state.stops) {
                    for (const pk of this.service.pickup_points) {
                        if (stop.name === pk.name) return stop.name;
                    }
                }
                return "";
            }
        }
    };
</script>

<style scoped>

</style>