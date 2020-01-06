<template>
    <div id="favorite-list">
        <v-container
                v-if="$store.state.favorites.length !== 0"
                class="pt-0 mt-0"
        >
                <v-slide-y-transition
                        group
                >
                    <v-col
                            v-for="name in $store.state.favorites"
                            :key="name"
                            cols="12">
                        <favorite-card :stop_name="name"></favorite-card>
                    </v-col>
                </v-slide-y-transition>
        </v-container>
        <v-container
                v-else
                class="text-center pa-10"
        >
            <div class="grey--text">Your favorite bus stops will be displayed here.</div>
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