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
      <!-- 操作 -->
      <template v-slot:opt="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.cat_id)"></el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeClick(scope.row.cat_id)"></el-button>
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
        :before-close="handleClose"
        @closed="cateClose">
        <el-form :model="addCateForm" :rules="addRules" ref="addCateRef">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- option 用来指定数据源 -->
            <!-- props用来指定配置对象 -->
            <el-cascader
              v-model="seletedKeys"
              :options="parentCateList"
              :props="{ expandTrigger: 'hover',...cascaderProps,}"
              @change="parentCateChange"
              clearable
              >
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑分类弹框 -->
      <el-dialog
        title="修改分类"
        :visible.sync="editDialogVisible"
        width="50%"
        :before-close="handleClose">
        <el-form :model="editCateForm" :rules="editRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateInfo">确 定</el-button>
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
      editDialogVisible: false, // 编辑分类弹框显隐
      addCateForm: { // 添加分类的数据对象
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
      // 添加分类名称的验证规则
      addRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 修改分类名称的验证规则
      editRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      editCateForm: {} // 查询到的分类名称对象
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
      this.editDialogVisible = false;
    },

    // 获取父级分类的数据列表
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories', {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data;
        // console.log(this.parentCateList);
    },

    // 选择项发生变化触发这个函数
    parentCateChange() {
      console.log(this.seletedKeys);
      // 如果seletedKeys数组中的length大于0，证明选中了腹肌分类
      // 繁殖就没有选中任何分类
      if (this.seletedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.seletedKeys[this.seletedKeys.length - 1];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.seletedKeys.length;
        return
      }else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level= 0;
      }
    },

    // 点击按钮添加新的分类
    addCate() {
      // console.log(this.addCateForm);
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('categories', this.addCateForm);
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCartList();
        this.addDialogVisible = false;
      })
    },

    // 监听对话框的关闭事件 重置表单数据
    cateClose() {
      this.$refs.addCateRef.resetFields();
      this.seletedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level= 0;
    },

    // 获取修改分类对话框数据
    async showEditDialog(id) {
      const {data: res} = await this.$http.get('categories/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editCateForm = res.data;
      console.log(this.editCateForm);
      this.editDialogVisible = true;
    },
    //修改分类名称并提交
    editCateInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id,{
          cat_name: this.editCateForm.cat_name
        });
        console.log(res);
        if(res.meta.status !== 200) {
          return this.$message.error('修改分类名称失败')
        }
        this.$message.success('修改分类名称成功')
        this.getCartList();
        this.editDialogVisible = false;
      })
    },

    // 删除分类
    async removeClick(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      // console.log(confirmResult);
      if(confirmResult !== 'confirm') {
        return this.$message.info('用户取消了删除')
      }
      // console.log('已删除');
      const {data: res} = await this.$http.delete('categories/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功');
      this.getCartList();
    }
  }
}
</script>

<style>
.el-cascader {
  width: 100%;
}
</style>