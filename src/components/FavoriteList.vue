<template>
    <div id="favorite-list">
        <v-container
                class="pt-0 mt-0"
                v-if="favorites.length !== 0"
        >
            <draggable
                    @end="moving=false"
                    @start="moving=true"
                    handle=".drag-handle"
                    v-model="favorites"
            >

                <v-slide-y-transition
                        group
                >
                    <v-col
                            :key="name"
                            cols="12"
                            v-for="name in favorites">
                        <favorite-card :moving="moving" :stop_name="name"></favorite-card>
                    </v-col>
                </v-slide-y-transition>
            </draggable>
        </v-container>
        <v-container
                class="text-center pa-10"
                v-else
        >
            <div class="grey--text">Your favorite bus stops will be displayed here.</div>
        </v-container>
    </div>
</template>

<script>
    import FavoriteCard from "@/components/FavoriteCard";
    import draggable from "vuedraggable";

    export default {
        name: "favorite-list",
        components: {
            FavoriteCard,
            draggable
        },
        data() {
            return {
                moving: false
            };
        },
        mounted() {
            this.$store.commit("toggleFavorite", "");
        },
        computed: {
            favorites: {
                get() {
                    return this.$store.state.favorites;
                },
                set(val) {
                    this.$store.commit("updateFavorites", val);
                }
            }
        }
    };
</script>

<style scoped>

</style>