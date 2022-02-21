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

      <!-- 表格区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数列表 -->
          <el-table :data="manyTableData" style="width: 100%" border stripe> 
            <el-table-column type="expand"></el-table-column>
            <!-- 参数名称 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTableData" style="width: 100%" border stripe> 
            <el-table-column type="expand"></el-table-column>
            <!-- 属性名称 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加' + textTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="addDialogClose">
      <el-form :model="addRuleForm" :rules="addRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="addRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
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
      activeName: 'many', // 默认激活为动态参数
      manyTableData: [], // 动态参数数组
      onlyTableData: [], // 静态参数数组
      addDialogVisible: false, // 控制添加参数弹框显隐
      addRuleForm: { // 添加属性参数的数据对象
        attr_name: ''
      },
      // 添加动态参数静态属性的字段校验
      addRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
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
    },

    textTitle() {
      if(this.activeName == 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
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
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      
      // 判断是静态参数还是动态参数 分别赋值
      if(this.activeName == 'many') {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addRuleForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加属性失败')
        }
        this.$message.success('添加属性成功');
        this.getParamsData();
        this.addDialogVisible = false;
      })
    },

    // 只允许选择三级分类
    handleChange() {
      this.getParamsData();
    },

    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },

    // 监听添加用户对话框额关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },

    // 关闭弹框
    handleClose() {
      this.addDialogVisible = false;
    }
  }
}
</script>

<style>
.cat-opt {
  margin: 15px 0;
}
</style>