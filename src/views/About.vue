<template>
    <div class="about">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card
                            class="mx-auto"
                            color="transparent"
                            flat
                    >
                        <v-img
                                contain
                                height="250"
                                src="../assets/logo.svg"
                        >

                        </v-img>
                        <v-card-title class="headline font-weight-bold justify-center teal--text">NUSBuses
                        </v-card-title>
                        <v-card-subtitle class="text-center">Delightful shuttle bus tracker for the NUS community
                        </v-card-subtitle>
                        <div class="feedback">
                            <v-card-title class="subtitle justify-center teal--text">Give Us Feedback</v-card-title>
                            <v-card-text class="text-center">NUSBuses is in testing phase. We value your feedback
                                                             including bug report, feature request.
                                                             You can contact us through Github issues, email, or
                                                             Facebook.
                            </v-card-text>
                            <v-row justify="center">
                                <v-btn :href="github_url + '/issues'"
                                       fab
                                       large
                                       target="_blank"
                                       text
                                >
                                    <v-icon large>mdi-github-circle</v-icon>
                                </v-btn>
                                <v-btn :href="'mailto:' + email_decoded" fab large
                                       text
                                >
                                    <v-icon color="#D44638" large>mdi-email</v-icon>
                                </v-btn>

                                <v-btn :href="facebook_url"
                                       fab
                                       large
                                       target="_blank"
                                       text
                                >
                                    <v-icon color="#3b5998" large>mdi-facebook-box</v-icon>
                                </v-btn>

                            </v-row>
                        </div>
                        <div class="contribute">
                            <v-card-title class="subtitle justify-center teal--text">Contribute</v-card-title>
                            <v-card-text class="text-center">NUSBuses is a student-initiated, open-source project.
                                                             Contribute to NUSBuses now on GitHub!
                            </v-card-text>
                            <v-row justify="center">
                                <v-btn :href="github_url" color="black"
                                       fab
                                       large
                                       target="_blank"
                                       text
                                >
                                    <v-icon large>mdi-github-circle</v-icon>
                                </v-btn>
                            </v-row>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import {EMAIL_ENCODED, FACEBOOK_URL, GITHUB_URL} from "@/utils/config";

    export default {
        data() {
            return {
                github_url: GITHUB_URL,
                email_decoded: atob(EMAIL_ENCODED),
                facebook_url: FACEBOOK_URL
            };
        }
    };
</script>