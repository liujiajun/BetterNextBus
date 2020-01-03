<template>
    <v-tabs
            fixed-tabs
            background-color="transparent"
            show-arrows
    >
        <v-tabs-slider color="teal"></v-tabs-slider>

        <v-tab
                v-model="active_tab"
                v-for="route in routes"
                :key="route.service_name"
        >
            {{route.service_name}}
        </v-tab>
    </v-tabs>
</template>

<script>
    export default {
        name: "service-list",
        props: ["service_name", "routes"],
        data() {
            return {
                active_tab: 5
            }
        }
        // computed: {
        //     active_tab: function () {
        //         if (this.routes === undefined) {
        //             return 0
        //         }
        //         for (let i=0; i<this.routes.length; i++) {
        //             if (this.service_name === this.routes[i].service_name) {
        //                 return i;
        //             }
        //         }
        //         return 0;
        //     }
        // }
    }
</script>

<style scoped>

</style>