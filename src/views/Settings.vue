<template>
    <div class="settings">
        <v-card flat>
            <v-card-title class="headline font-weight-bold teal--text">Settings</v-card-title>
            <v-divider></v-divider>
            <v-card flat>
                <v-card-title class="title teal--text">Dark mode</v-card-title>
                <v-card-text>
                    Dark mode creates an experience ideal for the dark.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn-toggle color="teal" group mandatory v-model="dark">
                        <v-btn height="40" value="true" width="85">
                            On
                        </v-btn>
                        <v-btn height="40" value="false" width="85">
                            Off
                        </v-btn>
<!--                        <v-btn height="40" value="auto" width="85">-->
<!--                            Auto-->
<!--                        </v-btn>-->
                    </v-btn-toggle>
                </v-card-actions>
            </v-card>
            <v-card flat>
                <v-card-title class="title teal--text">Privacy</v-card-title>
                <v-card-text>We take your privacy seriously.
                             To provide you a better experience,
                             we collect anonymous, aggregated usage information using
                             Google Analytics.
                             We do not share your information with anybody.
                             You can opt-out anytime.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn-toggle color="teal" group mandatory v-model="analytics">
                        <v-btn height="40" value="allow" width="85">
                            I'm in
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
            },
            dark: {
                get: function () {
                    return this.$store.state.enable_dark;
                },
                set: function (val) {
                    console.log(val);
                    if (val === "true") {
                        this.$store.commit("enableDark", 'true');
                    } else if (val === "false") {
                        this.$store.commit("enableDark", 'false');
                    } else {
                        this.$store.commit("enableDark", 'auto');
                    }
                }
            }
        }
    };
</script>
