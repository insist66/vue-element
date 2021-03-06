import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/router';
import TreeTable from 'vue-table-with-tree-grid';

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css';

import axios from 'axios';
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 通过axios请求响应拦截器添加token，保证拥有获取数据的权限
// axios请求拦截
axios.interceptors.request.use(config => {
  // 为请求对象，添加token验证的Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config);
  return config;
})

Vue.prototype.$http = axios;

Vue.component('tree-table', TreeTable);

Vue.config.productionTip = false; // 阻止显示生产模式的消息。
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
