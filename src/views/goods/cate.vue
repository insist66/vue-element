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
          <el-button type="primary" @click="addCartListClick">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格区域模块 -->
    <tree-table 
      :data="cartList" 
      :columns="columns" 
      show-index 
      border 
      :expand-type="false" index-text="#" :selection-type="false">
      <!-- 是否有效 -->
      <template v-slot:isok="scope" solt-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
        <i class="el-icon-error" style="color: red" v-else></i>
      </template>
      <!-- 排序 -->
      <template v-slot:order="scope">
        <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
        <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
        <el-tag v-else type="warning" size="mini">三级</el-tag>
      </template>
      <!-- 操作 -->.
      <template slot="opt" solt-scope="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick(scope.row)"></el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
      </template>
    </tree-table>

    <!-- 分页区域 -->
     <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 添加分类弹框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        :before-close="handleClose">
        <el-form :model="addCateRuleForm" :rules="addRules" ref="addCateRuleForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateRuleForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- option 用来指定数据源 -->
            <!-- props用来指定配置对象 -->
            <el-cascader
              v-model="seletedKeys"
              :options="parentCateList"
              :props="{ expandTrigger: 'hover',...cascaderProps}"
              @change="handleChange"
              clearable
              change-on-select>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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
        pagesize: 6// 每页显示的条数
      },
      total: 0, // 总数据条数
      addDialogVisible: false, // 控制添加分类弹框显隐
      addCateRuleForm: { // 添加分类的数据对象
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      parentCateList: [], // 父级分类的列表
      seletedKeys: [], // 选中的父级分类id数组
      cascaderProps: { // 指定级联选择器的配置对象
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      columns: [
        { 
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效', 
          type: 'template', // 表示将当前列定义为模板列
          template: 'isok', // 表示当前这一列使用模板名称
        },
        {
          label: '排序', 
          type: 'template', // 表示将当前列定义为模板列
          template: 'order' // 表示当前这一列使用模板名称
        },
        {
          label: '操作', 
          type: 'template', // 表示将当前列定义为模板列
          template: 'opt' // 表示当前这一列使用模板名称
        }
      ],
      // 分类名称的验证规则
      addRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getCartList();
  },

  methods: {
    // 商品分类数据列表
    async getCartList() {
      const {data: res} = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      this.cartList = res.data.result;
      this.total = res.data.total;
      // console.log(this.cartList);
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCartList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCartList();
    },

    // 添加分类点击事件
    addCartListClick() {
      this.getParentCateList();
      this.addDialogVisible = true;
    },

    // 点击关闭添加分类弹框
    handleClose() {
      this.addDialogVisible = false;
    },

    // 获取父级分类的数据列表
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories', {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data;
        console.log(this.parentCateList);
    },

    handleChange() {
      console.log(this.seletedKeys);
    }
  }
}
</script>

<style>

</style>