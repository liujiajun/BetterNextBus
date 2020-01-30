<template>
    <div>
        <v-card class="transparent" flat>
            <v-list-item>
                <v-list-item-title>First bus</v-list-item-title>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-list-item-title class="text-right font-weight-bold" v-on="on">{{firstBusToday}}
                        </v-list-item-title>
                    </template>
                    <ServiceInfoTooltip :serviceName="serviceName"/>
                </v-tooltip>
            </v-list-item>
            <v-list-item>
                <v-list-item-title>Last bus</v-list-item-title>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-list-item-title class="text-right font-weight-bold" v-on="on">{{lastBusToday}}
                        </v-list-item-title>
                    </template>
                    <ServiceInfoTooltip :serviceName="serviceName"/>
                </v-tooltip>
            </v-list-item>
            <v-list-item>
                <v-list-item-title class="caption text-right grey--text">Pro-tip: tap the times for more info.</v-list-item-title>
            </v-list-item>
        </v-card>
    </div>
</template>

<script>
    import {getTodayType} from "@/utils/date";
    import ServiceInfoTooltip from "@/components/ServiceInfoTooltip";

    export default {
        name: "ServiceInfoBox",
        components: {ServiceInfoTooltip},
        props: {
            serviceName: String
        },
        computed: {
            firstBusToday: function () {
                return this.$store.state.time_and_frequency[this.serviceName][getTodayType()]["first"];
            },
            lastBusToday: function () {
                return this.$store.state.time_and_frequency[this.serviceName][getTodayType()]["last"];
            },
            // fullDescription: function () {
            //
            // }
        }
    };
</script>

<style scoped>

</style>