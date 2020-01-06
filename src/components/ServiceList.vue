<template>
    <v-container class="pt-0">
        <v-tabs
                v-model="active_tab"
                background-color="transparent"
        >
            <v-tabs-slider color="teal"></v-tabs-slider>
            <v-tab
                    v-for="service in $store.state.services"
                    :key="service.service_name"
                    @click="selectTab(service.service_name)"
            >
                {{service.service_name}}
            </v-tab>
        </v-tabs>
        <router-view></router-view>
    </v-container>
</template>

<script>
    export default {
        name: "service-list",
        methods: {
            selectTab(name) {
                this.$router.push({
                    name: 'service-card',
                    params: {service_name: name}})
                    .catch(e => console.log(e))
            }
        },
        computed: {
            active_tab: {
                get: function() {
                    let index = this.$store.state.services.findIndex(x => x.service_name === this.$route.params.service_name);
                    if (index === undefined) return 0;
                    return index
                },
                set: function () {

                }
            }
        }
    }
</script>

<style scoped>

</style>