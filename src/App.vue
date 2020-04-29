<template>
    <div id="app">
        <v-app>
            <router-view/>
            <v-footer
                    :color="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-3'"
                    padless
            >
                <v-row
                        justify="center"
                        no-gutters

                >
                    <v-btn
                            @click="$router.push({
                    name: 'bus-list',
                    params: {bus_stop_name: $store.state.stop_selected}
                    })"
                            class="my-2"
                            color="teal"
                            text
                    >
                        Home
                    </v-btn>
                    <v-btn
                            class="my-2"
                            color="teal"
                            text
                            to="/settings"
                    >
                        Settings
                    </v-btn>
                    <v-btn
                            class="my-2"
                            color="teal"
                            text
                            to="/about"
                    >
                        About
                    </v-btn>
                    <v-col
                            class="py-4 pt-0 text-center teal--text caption"
                            cols="12"
                    >
                        <strong>NUSBuses</strong> <br>
                        <span class="withLove">Made with</span>
                        <svg class="heart" viewBox="0 0 200 200">
                            <g transform="translate(100 100)">
                                <path d="M92.71,7.27L92.71,7.27c-9.71-9.69-25.46-9.69-35.18,0L50,14.79l-7.54-7.52C32.75-2.42,17-2.42,7.29,7.27v0 c-9.71,9.69-9.71,25.41,0,35.1L50,85l42.71-42.63C102.43,32.68,102.43,16.96,92.71,7.27z" fill="tomato"
                                      transform="translate(-50 -50)"/>
                                <animateTransform
                                        additive="sum"
                                        attributeName="transform"
                                        dur="1.5s"
                                        repeatCount="indefinite"
                                        type="scale"
                                        values="1; 1.5; 1.25; 1.5; 1.5; 1;">
                                </animateTransform>
                            </g>
                        </svg>
                        by
                        <a :href="github_url" style="color: teal" target="_blank">
                            <strong>@BetterNextBus</strong>
                        </a>
                        <br>Copyright © 2019 - {{new Date().getFullYear()}}
                    </v-col>
                </v-row>
            </v-footer>
        </v-app>
    </div>
</template>

<script>
    import {GITHUB_URL} from "@/utils/config";

    export default {
        data() {
            return {
                github_url: GITHUB_URL
            };
        },
        mounted() {
            this.$store.commit("initializeSettings");
            if (this.$store.state.enable_analytics === true) {
                this.$ga.enable();
            } else {
                this.$ga.disable();
            }
            if (this.$store.state.enable_dark === 'true') {
                this.$vuetify.theme.dark = true;
            } else if (this.$store.state.enable_dark === 'false') {
                this.$vuetify.theme.dark = false;
            }
        },
        computed: {
            dark() {
                return this.$store.state.enable_dark;
            }
        },
        watch: {
            dark: function () {
                if (this.dark === 'true') {
                    this.$vuetify.theme.dark = true;
                } else if (this.dark === 'false') {
                    this.$vuetify.theme.dark = false;
                }
            }
        }
    };
</script>
<style>
    .heart {
        width: 24px;
        height: 24px;
    }

    .heart,
    .withLove {
        vertical-align: middle;
        display: inline-block;
    }
</style>
