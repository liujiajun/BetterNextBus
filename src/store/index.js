import Vue from 'vue'
import Vuex from 'vuex'
import {RepositoryFactory} from "../repository/reposiotry-factory"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: "rory",
    busStops: null,
    routes: null
  },
  mutations: {
    getStops(state, stops) {
      state.busStops = stops
    },
    getRoutes(state, routes) {
      state.routes = routes
    },
  },
  actions: {
    getStops({commit}) {
      RepositoryFactory.get("busStops").get().then(res => {
        commit("getStops", res)
      })
    },
    getRoutes({commit}) {
      RepositoryFactory.get("serviceDescriptions").get().then(res => {
        commit("getRoutes", res)
      })
    },
  },
  modules: {
  }
})
