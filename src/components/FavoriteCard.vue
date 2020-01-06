<template>
    <div>
        <v-card
                color="teal"
                dark
        >
            <v-card-title class="title pt-2">
                {{stop.long_name}}
                <v-spacer></v-spacer>
                <favorite-button :name="stop_name"></favorite-button>
            </v-card-title>
            <v-card-subtitle class="caption pb-1 mb-1">{{stop.short_name}}</v-card-subtitle>
            <v-container
                    v-if="loading"
                    class="text-center">
                <v-progress-circular
                        indeterminate
                        size="48"
                >
                </v-progress-circular>
            </v-container>
            <v-list
                    v-else
                    class="pt-1 pb-0"
                    color="teal darken-1"
                    dark
            >
                <v-list-item
                        v-for="service in service_timings"
                        :key="service.service_name"
                >
                    <v-row>
                        <v-col cols="4">{{service.service_name}}</v-col>
                        <v-col cols="4" class="text-center">
                            <span class="font-weight-bold">{{service.arrival_time}}</span>
                            <span class="caption" v-if="service.arrival_time==='1'"> min</span>
                            <span class="caption" v-if="service.arrival_time!=='1' && service.arrival_time!=='Arr' && service.arrival_time!=='-'"> mins </span>
                        </v-col>
                        <v-col cols="4" class="text-center">
                            <span class="font-weight-bold">{{service.next_arrival_time}}</span>
                            <span class="caption" v-if="service.next_arrival_time==='1'"> min</span>
                            <span class="caption" v-if="service.next_arrival_time!=='1' && service.next_arrival_time!=='Arr' && service.next_arrival_time!=='-'"> mins </span>
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
        props: ["stop_name"],
        data() {
            return {
                service_timings: [],
                timer: '',
                loading: true
            }
        },
        method: {
            async updateServiceTiming() {
                let timings = await RepositoryFactory.get("serviceTimingAtBusStop").get(this.stop_name);
                timings.forEach(service => {
                    let found = this.service_timings.find(x => x.service_name === service.service_name);
                    if (found === undefined || found === null) return;
                    found.arrival_time = service.arrival_time;
                    found.next_arrival_time = service.next_arrival_time
                });
            }
        },
        computed: {
            stop: function () {
                return this.$store.state.stops.find(x => x.name === this.stop_name)
            }
        },
        async mounted() {
            this.timer = setInterval(() => {
                this.updateServiceTiming()
            }, 30000);
            this.service_timings = await RepositoryFactory.get("serviceTimingAtBusStop").get(this.stop_name);
            this.loading = false;
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>

<style scoped>

</style>