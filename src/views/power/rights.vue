<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图区域 -->
    <el-card>
      111
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [], // 权限管理列表数据
    }
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list');
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限管理列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList);
    }
  }
}
</script>

<style>

</style>