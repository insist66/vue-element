import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login' // 默认的页面
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "home" */ '../views/login/Login.vue'),
      meta: {title: '登录'}
    },
    {
      path: '/home',
      component: () => import(/* webpackChunkName: "home" */ '../views/home/Home.vue'),
      meta: {title: '首页'}
    },
  ]
})