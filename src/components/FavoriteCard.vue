<template>
    <div>
        <v-card
                color="teal"
                dark
        >
            <v-card-title class="title pt-2">
                {{stop.short_name}}
                <favorite-button :name="stop_name"></favorite-button>
                <v-spacer></v-spacer>
                <v-btn class="drag-handle" icon>
                    <v-icon>mdi-drag-horizontal</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-subtitle class="caption pb-1 mb-1">{{stop.long_name}}</v-card-subtitle>
            <v-container
                    class="text-center"
                    v-if="loading">
                <v-progress-circular
                        indeterminate
                        size="48"
                >
                </v-progress-circular>
            </v-container>
            <v-list
                    class="pt-1 pb-0"
                    color="teal darken-1"
                    dark
                    v-else-if="!moving"
            >
                <v-list-item
                        :key="service.service_name"
                        v-for="service in service_timings"
                >
                    <v-row>
                        <v-col cols="4">{{service.service_name}}</v-col>
                        <v-col class="text-center" cols="4">
                            <span class="font-weight-bold">{{service.arrival_time}}</span>
                            <span class="caption" v-if="service.arrival_time==='1'"> min</span>
                            <span class="caption"
                                  v-if="service.arrival_time!=='1' && service.arrival_time!=='Arr' && service.arrival_time!=='-'"> mins </span>
                        </v-col>
                        <v-col class="text-center" cols="4">
                            <span class="font-weight-bold">{{service.next_arrival_time}}</span>
                            <span class="caption" v-if="service.next_arrival_time==='1'"> min</span>
                            <span class="caption"
                                  v-if="service.next_arrival_time!=='1' && service.next_arrival_time!=='Arr' && service.next_arrival_time!=='-'"> mins </span>
                        </v-col>
                    </v-row>

                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script>
    import {RepositoryFactory} from "@/repository/reposiotry-factory";
    import FavoriteButton from "@/components/FavoriteButton";

    export default {
        name: "favorite-card",
        components: {FavoriteButton},
        props: ["stop_name", "moving"],
        data() {
            return {
                service_timings: [],
                timer: "",
                loading: true
            };
        },
        method: {
            async updateServiceTiming() {
                let timings = await RepositoryFactory.get("serviceTimingAtBusStop").get(this.stop_name);
                timings.forEach(service => {
                    let found = this.service_timings.find(x => x.service_name === service.service_name);
                    if (found === undefined || found === null) return;
                    found.arrival_time = service.arrival_time;
                    found.next_arrival_time = service.next_arrival_time;
                });
            }
        },
        computed: {
            stop: function () {
                let found = this.$store.state.stops.find(x => x.name === this.stop_name);
                if (found !== undefined)
                    return found;
                return {long_name: ""};
            }
        },
        async mounted() {
            this.timer = setInterval(this.updateServiceTiming, 30000);
            this.service_timings = await RepositoryFactory.get("serviceTimingAtBusStop").get(this.stop_name);
            this.loading = false;
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    };
</script>

<style scoped>

</style>