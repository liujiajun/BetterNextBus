import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import VueAnalytics from "vue-analytics";
import {GOOGLE_ANALYTICS_ID, HOST_URL} from "./utils/config";

Vue.config.productionTip = true;
Vue.prototype.$hostname = (Vue.config.productionTip) ? HOST_URL : "http://127.0.0.1:5000/";

Vue.use(VueAnalytics, {
    id: GOOGLE_ANALYTICS_ID,
    router
});

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount("#app");

