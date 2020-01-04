<template>
  <div id="app">
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
    <v-app>
      <router-view/>
      <v-footer
              color="grey lighten-3"
              padless
      >
        <v-row
                justify="center"
                no-gutters

        >
          <v-btn
                  color="teal"
                  text
                  to="/stops"
                  class="my-2"
          >
            Home
          </v-btn>
          <v-btn
                  color="teal"
                  text
                  to="/about"
                  class="my-2"
          >
            About
          </v-btn>
          <v-col
                  class="grey lighten-3 py-4 text-center teal--text caption"
                  cols="12"
          >
            Made with 💗 by @BetterNextBus. Copyright © 2019 - {{new Date().getFullYear()}}
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </div>
</template>

<style>

</style>
