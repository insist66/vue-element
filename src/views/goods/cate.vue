<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加分类按钮区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格区域模块 -->
    <el-table :data="cartList" border stripe style="width: 100%" >
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template v-slot="scope">
          <el-switch v-model="scope.row.cat_deleted"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template>
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
      
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartList: [], //商品分类数据列表
      queryInfo: { // 获取用户列表的参数对象
        type: 3,
        pagenum: 1, // 当前的页码
        pagesize: 5 // 每页显示的条数
      },
      total: 0, // 总数据条数
    }
  },

  created() {
    this.getCartList();
  },

  methods: {
    async getCartList() {
      const {data: res} = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      this.cartList = res.data.result;
      this.total = res.data.total;
      console.log(this.cartList);
    }
  }
}
</script>

<style>

</style>