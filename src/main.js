import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import VueAnalytics from "vue-analytics";

Vue.config.productionTip = true;
Vue.prototype.$hostname = (Vue.config.productionTip) ? "https://better-nextbus.appspot.com/" : "http://127.0.0.1:5000/";

// Configuration VueAnalytics
Vue.use(VueAnalytics, {
    id: "UA-155726050-1",
    router
});

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount("#app");

