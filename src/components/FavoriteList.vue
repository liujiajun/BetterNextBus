<template>
    <div id="favorite-list">
        <v-container
                v-if="favorites.length !== 0"
                class="pt-0 mt-0"
        >
            <draggable
                    v-model="favorites"
                    handle=".drag-handle"
            >
                <v-slide-y-transition
                        group
                >
                    <v-col
                            v-for="name in favorites"
                            :key="name"
                            cols="12">
                        <favorite-card :stop_name="name"></favorite-card>
                    </v-col>
                </v-slide-y-transition>
            </draggable>
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
    import draggable from 'vuedraggable'

    export default {
        name: "favorite-list",
        components: {
            FavoriteCard,
            draggable
        },
        mounted() {
            this.$store.commit("toggleFavorite", "")
        },
        computed: {
            favorites: {
                get() {
                    return this.$store.state.favorites
                },
                set(val) {
                    this.$store.commit("updateFavorites", val)
                }
            }
        }
    }
</script>

<style scoped>

</style>