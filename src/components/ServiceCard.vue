<template>
    <div id="service-card">
        <v-card class="transparent" flat>
            <v-list class="transparent" dense>
                <v-list-item
                        v-for="(pickupPoint, i) in service.pickup_points"
                        :key="i"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-bus-stop</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{getStop(pickupPoint.name).long_name}}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: "service-card",
        methods: {
            getStop(name) {
                if (this.$store.state.stops.find(x => x.name === name) === undefined) {
                    console.log("Undefined " + name)
                    return name
                }
                return this.$store.state.stops.find(x => x.name === name)
            }
        },
        computed: {
            service: function () {
                return this.$store.state.services.find(x => x.service_name === this.$store.state.service_selected)
            }
        }
    }
</script>

<style scoped>

</style>