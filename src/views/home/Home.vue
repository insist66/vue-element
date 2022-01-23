<template>
  <el-container class="home-container">
    <!-- 页面头部 -->
    <el-header>
      <div class="el-left-head">
        <img src="../../assets/dog.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="signOut">退出</el-button>
    </el-header>
    <!-- 页面主体内容区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu :menus="menuList"></el-menu>
      </el-aside>
      <!-- 右边内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
</el-container>
</template>

<script>
import elMenu from '@/components/el-menu.vue';
export default {
  components: {
    elMenu
  },
  data() {
    return {
      menuList: [], // 左侧菜单数据
    }
  },

  created() {
    // 左侧侧边栏数据
    this.getMenuList();
  },

  methods: {
    // 退出到登录页面
    signOut() {
      window.sessionStorage.clear();
      this.$router.push('/login')
    },

    // 左侧侧边栏数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus');
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      // console.log(res);
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  background: #373d41;
  color: #fff;
  font-size: 15px;
}

.el-left-head {
  display: flex;
  align-items: center;
}

.el-left-head img {
  height: 50px;
  border-radius: 50%
}

.el-left-head span {
  margin-left: 15px;
}

.el-aside {
  background: #333744;
}

.el-main {
  background: #eaedf1;
}
</style>