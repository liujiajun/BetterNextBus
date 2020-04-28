<template>
    <v-container
            class="pb-0"
            v-if="alert">
        <v-alert
                color="teal darken-3"
                dismissible
                text
                v-model="alert"
                class="mb-2"
        >
            <v-row align="center">
                <v-col class="grow">
                    <div class="body-2 font-weight-bold">Announcements from NextBus Official</div>
                    <div class="body-2" v-html="$store.state.announcements[0].text"></div>
                </v-col>
            </v-row>
        </v-alert>
    </v-container>
</template>

<script>
    export default {
        name: "announcement-box",
        data() {
            return {
                alert: false,
            };
        },
        watch: {
            "alert": function (newVal) {
                if (newVal === false) {
                    localStorage.setItem("closedAnnouncementId", this.$store.state.announcements[0].id);
                }
            }
        },
        async created() {
            await this.$store.dispatch("getAnnouncements");
            this.alert = localStorage.getItem("closedAnnouncementId") !== this.$store.state.announcements[0].id;
        }
    };
</script>

<style scoped>

</style>
