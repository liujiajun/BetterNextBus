<template>
  <div class="about">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card
                  flat
                  color="transparent"
                  class="mx-auto"
          >
            <v-img
                    contain="true"
                    height="250"
                    src="../assets/logo.svg"
            >

            </v-img>
            <v-card-title class="headline font-weight-bold justify-center teal--text">NUSBuses</v-card-title>
            <v-card-subtitle class="text-center">Delightful shuttle bus tracker for the NUS community</v-card-subtitle>
            <div class="feedback">
              <v-card-title class="subtitle justify-center teal--text">Give Us Feedback</v-card-title>
              <v-card-text class="text-center">NUSBuses is in testing phase. We value your feedback including bug report, feature request.
                You can contact us through Github issues or email.
              </v-card-text>
              <v-row justify="center">
                <v-btn text large fab
                       :href="github_url + '/issues'"
                >
                  <v-icon large>mdi-github-circle</v-icon>
                </v-btn>
                <v-btn text large fab
                       :href="'mailto:' + email_decoded"
                >
                  <v-icon large>mdi-email</v-icon>
                </v-btn>
              </v-row>
            </div>
            <div class="contribute">
              <v-card-title class="subtitle justify-center teal--text">Contribute</v-card-title>
              <v-card-text class="text-center">NUSBuses is a student-initiated, open-source project.
                Contribute to NUSBuses now on GitHub!
              </v-card-text>
              <v-row justify="center">
                <v-btn text large fab color="black"
                       :href="github_url"
                       target="_blank"
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
  import {GITHUB_URL, EMAIL_ENCODED} from '@/utils/config'
  export default {
    data() {
      return {
        github_url: GITHUB_URL,
        email_decoded: atob(EMAIL_ENCODED)
      }
    }
  }
</script>