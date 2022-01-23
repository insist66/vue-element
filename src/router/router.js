import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login' // 默认的页面
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../views/login/Login.vue'),
      meta: {title: '登录'}
    },
    {
      path: '/home',
      component: () => import(/* webpackChunkName: "home" */ '../views/home/Home.vue'),
      meta: {title: '首页'},
      redirect: '/welcome', // 重定向到welcome页面
      children: [
        {
          path: '/welcome',
          component: () => import(/* webpackChunkName: "welcome" */ '../views/welcome/WelCome.vue'),
        },
        {
          path: '/users',
          component: () => import(/* webpackChunkName: "user" */ '../views/user/User.vue'),
        }
      ]
    },
  ]
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // form 代表从哪个路径跳转而来
  // next() 是一个函数 表示放行
  // next() 放行 next('/login') 强制跳转
  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})

export default router;