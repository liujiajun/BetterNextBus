<template>
    <v-container>
        <v-tabs
                v-model="active_tab"
                background-color="transparent"
                show-arrows
        >
            <v-tabs-slider color="teal"></v-tabs-slider>
            <v-tab
                    v-for="service in $store.state.services"
                    :key="service.service_name"
                    @click="$store.commit('setAutocompleteSelected', service.service_name)"
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
        data() {
            return {
                active_tab: 0
            }
        },
        created() {
            let index = this.$store.state.services.findIndex(x => x.service_name === this.$route.params.service_name);
            if (index === undefined) this.active_tab = index;
        },
        watch: {
            "$store.state.service_selected": function (newVal) {
                let index = this.$store.state.services.findIndex(x => x.service_name === newVal);
                if (index === undefined) return;
                this.active_tab = index;
            }
        }
    }
</script>

<style scoped>

</style>