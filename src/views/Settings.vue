<template>
    <div class="settings">
        <v-card flat>
            <v-card-title class="headline font-weight-bold teal--text">Settings</v-card-title>
            <v-divider></v-divider>
            <v-card flat>
                <v-card-title class="title teal--text">Privacy</v-card-title>
                <v-card-text>We collect anonymous, aggregated usage information using Google Analytics.
                             You can opt-out anytime.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn-toggle color="teal" group mandatory v-model="analytics">
                        <v-btn height="40" value="allow" width="85">
                            Allow
                        </v-btn>
                        <v-btn height="40" value="opt-out" width="85">
                            Opt-out
                        </v-btn>
                    </v-btn-toggle>
                </v-card-actions>
            </v-card>
        </v-card>
    </div>
</template>

<script>

    export default {
        data() {
            return {};
        },
        computed: {
            analytics: {
                get: function () {
                    return this.$store.state.enable_analytics === true ? "allow" : "opt-out";
                },
                set: function (val) {
                    if (val === "allow") {
                        this.$store.commit("enableAnalytics", true);
                    } else {
                        this.$store.commit("enableAnalytics", false);
                    }
                }
            }
        }
    };
</script>