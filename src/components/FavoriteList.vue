<template>
    <div id="favorite-list">
        <v-container class="pt-0 mt-0">
                <v-slide-y-transition
                        group
                        tag="v-row"
                >
                    <v-col
                            v-for="name in $store.state.favorites"
                            :key="name"
                            cols="12">
                        <favorite-card :stop_name="name"></favorite-card>
                    </v-col>
                </v-slide-y-transition>
        </v-container>
    </div>
</template>

<script>
    import FavoriteCard from "@/components/FavoriteCard";
    export default {
        name: "favorite-list",
        components: {FavoriteCard},
        mounted() {
            this.$store.commit("toggleFavorite", "")
        }
    }
</script>

<style scoped>

</style>