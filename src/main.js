import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'

Vue.config.productionTip = true
Vue.prototype.$hostname = (Vue.config.productionTip) ? 'https://better-nextbus.appspot.com/' : 'http://127.0.0.1:5000/'


new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

