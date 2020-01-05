<template>
    <div id="service-card">
        <v-card class="transparent" flat>
            <!--            <v-list class="transparent" dense>-->
            <!--                <v-list-item-->
            <!--                        v-for="(pickupPoint, i) in service.pickup_points"-->
            <!--                        :key="i"-->
            <!--                >-->
            <!--                    <v-list-item-avatar-->
            <!--                            color="indigo"-->
            <!--                            class="font-weight-light white&#45;&#45;text"-->
            <!--                            size="32"-->
            <!--                    >-->
            <!--                        {{ pickupPoint.name.charAt(0) }}-->
            <!--                    </v-list-item-avatar>-->
            <!--                    <v-list-item-content>-->
            <!--                        <v-list-item-title>-->
            <!--                            {{getStop(pickupPoint.name).long_name}}-->
            <!--                        </v-list-item-title>-->
            <!--                    </v-list-item-content>-->
            <!--                    <v-list-item-action>-->
            <!--                        <v-btn-->
            <!--                                icon-->
            <!--                                color="teal"-->
            <!--                                @click="gotoStop(pickupPoint.name)"-->
            <!--                        >-->
            <!--                            <v-icon>mdi-bus-stop</v-icon>-->
            <!--                        </v-btn>-->
            <!--                    </v-list-item-action>-->
            <!--                </v-list-item>-->
            <!--            </v-list>-->
            <v-timeline
                    dense
            >
                <v-timeline-item
                        v-for="(pickupPoint, i) in service.pickup_points"
                        :key="i"
                        small
                        :color="(i===0 || i===service.pickup_points.length-1) ? 'orange' : 'blue'"
                >
                    <v-row class="pt-1">
                        <v-col>
                            <div>
                                {{getStop(pickupPoint.name).short_name}}
                                <v-chip
                                        v-if="getStop(pickupPoint.name).name===nearest_stop_name"
                                        class="white--text ml-0"
                                        color="green darken-2"
                                        label
                                        small
                                >
                                    Nearest
                                </v-chip>
                            </div>
                            <div class="caption">{{getStop(pickupPoint.name).long_name}}</div>
                        </v-col>
                        <v-col cols="3">
                            <v-btn
                                    icon
                                    color="teal"
                                    @click="gotoStop(pickupPoint.name)"
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
    export default {
        name: "service-card",
        methods: {
            getStop(name) {
                return this.$store.state.stops.find(x => x.name === name)
            },
            gotoStop(name) {
                this.$router.push({
                    name: 'bus-list',
                    params: {bus_stop_name: name}
                })
                    .catch(e => console.log(e))
            }
        },
        computed: {
            service: function () {
                return this.$store.state.services.find(x => x.service_name === this.$store.state.service_selected)
            },
            nearest_stop_name: function () {
                if (this.$store.state.current_location === null) return "";
                for (const stop of this.$store.state.stops) {
                    for (const pk of this.service.pickup_points) {
                        if (stop.name === pk.name) return stop.name
                    }
                }
                return "";
            }
        }
    }
</script>

<style scoped>

</style>