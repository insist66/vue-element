<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row>
        <el-col>
          <div class="cat-opt">选择商品分类：
            <el-cascader
              v-model="seletedKeys"
              :options="cateList"
              :props="{ expandTrigger: 'hover', ...cascaderProps}"
              @change="handleChange">
            </el-cascader>
          </div>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">静态参数</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [], // 分类参数列表
      cascaderProps: { // 指定级联选择器的配置对象
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      seletedKeys: [],
      activeName: 'many', // 
    }
  },

  created() {
    this.getCateList();
  },

  computed: {
    // 如果按钮需要被禁用 则返回true 否则返回false
    isBtnDisabled() {
      if (this.seletedKeys.length !== 3) {
        return true
      }
      return false
    },

    // 获取分类id
    cateId() {
      if (this.seletedKeys.length === 3) {
        return this.seletedKeys[2]
      }
      return null
    }
  },

  methods: {
    // 商品分类列表
    async getCateList() {
      const {data: res} = await this.$http.get('categories');
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data;
      console.log(this.cateList);
    },

    // 获取参数的列表数据
    async getParamsData() {
      console.log(this.seletedKeys);
      if (this.seletedKeys.length !== 3) {
        this.seletedKeys = []
        return
      }
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {sel: this.activeName}
      })
      if(res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      console.log(res);
    },

    // 只允许选择三级分类
    handleChange() {
      this.getParamsData();
    },

    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    }
  }
}
</script>

<style>
.cat-opt {
  margin: 15px 0;
}
</style>