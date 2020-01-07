<template>
    <v-card
            color="teal"
            dark>
        <v-list-item three-line>
            <v-list-item-content>
                <v-list-item-title class="headline">{{bus.name}}</v-list-item-title>
                <v-list-item-subtitle>
                    <span class="font-weight-bold">{{bus.arrival_time}}</span>
                    <span v-if="bus.arrival_time=='1'"> min</span>
                    <span v-if="bus.arrival_time!='1' && bus.arrival_time!='Arr' && bus.arrival_time!='-'"> mins </span>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                    <span class="font-weight-bold">{{bus.next_arrival_time}}</span>
                    <span v-if="bus.next_arrival_time=='1'"> min</span>
                    <span v-if="bus.next_arrival_time!='1' && bus.next_arrival_time!='Arr' && bus.next_arrival_time!='-'"> mins </span>
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <!--        <v-card-actions>-->
        <!--            <v-spacer></v-spacer>-->
        <!--            <v-btn-->
        <!--                    text-->
        <!--                    @click="show_maps"-->
        <!--            >-->
        <!--                LIVE MAP-->
        <!--                <v-icon right>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>-->
        <!--            </v-btn>-->
        <!--        </v-card-actions>-->
    </v-card>
</template>

<script>
    export default {
        name: "arrival-time-card",
        props: ['bus_info'],
        data() {
            return {
                bus: this.bus_info
            }
        }
    }
</script>

<style scoped>

</style>