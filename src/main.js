import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import netClient from "./network/index";
import Vant from 'vant';
import 'vant/lib/index.css';
//导入表格组件
import TreeTable from 'vue-table-with-tree-grid'

// 商品管理-商品添加 编辑文本信息
import VueQuillEditor from 'vue-quill-editor'
// 商品管理-商品添加 编辑文本信息对应的样式
//require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入进度条包的js和css（项目优化） 
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//进度条（项目优化） 在request拦截器中展示进度条
NProgress.start()

//请求拦截
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须return config
  return config
})
//进度条（项目优化） 在response拦截器中隐藏进度条
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//全局注册 table
Vue.component('tree-table', TreeTable)

//全局注册 VueQuillEditor
Vue.use(VueQuillEditor)

Vue.use(ElementUI);
Vue.use(Vant);

Vue.config.productionTip = false
Vue.prototype.$netClient = netClient;
//时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
