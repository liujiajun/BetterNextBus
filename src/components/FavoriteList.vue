<template>
    <div id="favorite-list">
        <v-container class="pt-0 mt-0">
            <v-row class="pt-0 mt-0">
                <v-col
                        v-for="name in $store.state.favorites"
                        :key="name"
                        cols="12">
                   <favorite-card :stop_name="name"></favorite-card>
                </v-col>
            </v-row>
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