<template>
    <div>
        <v-btn
                icon
                v-on:click="$store.commit('toggleFavorite', name)">
            <v-icon
                    color="red lighten-1"
                    v-if="isFavorite(name)">mdi-heart
            </v-icon>
            <v-icon v-else>
                mdi-heart-outline
            </v-icon>
        </v-btn>
    </div>
</template>

<script>
    export default {
        name: "favorite-button",
        props: ["name"],
        methods: {
            isFavorite(name) {
                return this.$store.state.favorites.includes(name)
            }
        }
    }
</script>

<style scoped>

</style>