<template>
    <div>
        <div v-if="this.$store.state.time_and_frequency[this.serviceName]['weekday']['first'] != 'No data'">
            <v-row>
                <v-col>
                    Weekdays: {{this.$store.state.time_and_frequency[this.serviceName]["weekday"]["first"]}} -
                    {{this.$store.state.time_and_frequency[this.serviceName]["weekday"]["last"]}}
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    Saturdays: {{this.$store.state.time_and_frequency[this.serviceName]["sat"]["first"]}} -
                    {{this.$store.state.time_and_frequency[this.serviceName]["sat"]["last"]}}
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    Sundays & Public Holidays: {{this.$store.state.time_and_frequency[this.serviceName]["sun-and-ph"]["first"]}} -
                    {{this.$store.state.time_and_frequency[this.serviceName]["sun-and-ph"]["last"]}}
                </v-col>
            </v-row>
        </div>
        <div v-else>
            Data not available
        </div>
    </div>
</template>

<script>
    export default {
        name: "ServiceInfoTooltip",
        props: {
            serviceName: String
        }
    };
</script>

<style scoped>

</style>