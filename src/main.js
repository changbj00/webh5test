// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design';
import qs from 'qs'
import 'view-design/dist/styles/iview.css';
import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.23.202:8092'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true
axios.defaults.transformRequest = data => qs.stringify(data)

Vue.use(ViewUI);
Vue.config.productionTip = false
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
