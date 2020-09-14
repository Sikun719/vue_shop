import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import netClient from "./network/index";
import Vant from 'vant';
import 'vant/lib/index.css';

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI);
Vue.use(Vant);

Vue.config.productionTip = false
Vue.prototype.$netClient = netClient;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
