<template>
  <!-- 一级菜单 -->
  <div :style="isShowMenu ? 'width: 50px' : 'width: 200px'">
    <!-- @open="handleOpen"
    @close="handleClose" -->
    <div class="top-buttom" @click="menuBtn">|||</div>
    <el-menu
      :router="true"
      :collapse-transition="false"
      :default-active="activePath"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      :unique-opened="true"
      :collapse="isShowMenu"
      active-text-color="#409bff">
      <el-submenu :index="item.id + ''" v-for="item in menus" :key="item.id">
      <!-- 一级菜单模板区域 -->
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item 
          v-for="subItem in item.children" 
          :key="subItem.id" 
          :index="'/' + subItem.path"
          @click="saveNavState('/' + subItem.path)">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ subItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    menus: {
      tyre: Array,
      // default: () => []
      default() {
        return []
      }
    },

    ShowMenu: {
      tyre: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      // 侧边栏一级菜单图标
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      isShowMenu: false, // 菜单栏的折叠 默认false
      // 被激活的链接地址
      activePath: ''
    }
  },

  // 页面初始化
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    // 控制左侧菜单是否折叠
    menuBtn() {
      this.isShowMenu = !this.isShowMenu;
    },

    // 点击二级菜单将激活的颜色存储起来
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  }
}
</script>

<style>
.iconfont {
  margin-right: 10px;
}

.el-menu {
  border: none;
}

.top-buttom {
  text-align: center;
  line-height: 24px;
  background: #4A5064;
  color: #fff;
  letter-spacing: 1px;
  cursor: pointer;
}
</style>