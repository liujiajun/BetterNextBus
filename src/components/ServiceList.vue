<template>
    <v-container class="pt-0">
        <v-tabs
                background-color="transparent"
                show-arrows
                v-model="active_tab"
        >
            <v-tabs-slider color="teal"></v-tabs-slider>
            <v-tab
                    :key="service.service_name"
                    @click="selectTab(service.service_name)"
                    v-for="service in $store.state.services"
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
                    params: {service_name: name}
                })
                    .catch(e => console.log(e))
            }
        },
        computed: {
            active_tab: {
                get: function () {
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