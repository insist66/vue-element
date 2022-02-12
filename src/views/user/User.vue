<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 获取用户列表 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column  type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" ></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <!-- {{ scope.row }} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" style="text-align: center" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip class="item" effect="dark" content="分配角色" :enterable="false" placement="top">
              <el-button type="warning" @click="roleClick(scope.row)" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户弹框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
      :before-close="handleClose">
      <el-form ref="addFormRef" :model="addForm" :rules="addFromRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹框 -->
    <el-dialog
      title="修改用户"
      @close="editDialogClose"
      :visible.sync="EditDialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form ref="editFormRef" :model="editForm" :rules="editFromRules" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的弹框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      :before-close="handleClose">
      <div>
        <p>当前的用户：{{uesrInfo.username}}</p>
        <p>当前的角色：{{uesrInfo.role_name}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      const emailReg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

      if (emailReg.test(value)) {
        return callback()
      }
      return callback(new Error('邮箱格式错误'))
    }
    return {
      queryInfo: { // 获取用户列表的参数对象
        query: '',
        pagenum: 1, // 当前的页数
        pagesize: 5 // 当前每页显示多少条数据
      },
      total: 0, // 总条数
      userList: [], // 用户列表
      addDialogVisible: false, // 控制添加用户弹框的显隐
      EditDialogVisible: false, // 控制修改弹框的显隐
      setRoleDialogVisible: false, // 控制角色分配弹框的显隐
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {}, // 查询到的用户信息对象
      uesrInfo: '', // 需要被分配角色的用户信息
      rolesList: [], // 所有角色的数据列表
      // 添加用户的验证规则
      addFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { validator: checkMobile, trigger: 'blur' }
        ],
      },
      // 修改用户的验证规则
      editFromRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { validator: checkMobile, trigger: 'blur' }
        ],
      },
    }
  },

  created() {
    // 获取用户列表
    this.getUserList();
  },

  methods: {
    // 获取用户列表
    async getUserList() {
      const {data: res} = await this.$http.get('users', {
        params: this.queryInfo
      })
      if(res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败');
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(res);
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    // 查询用户列表关键字
    async userStateChange(userInfo) {
      // console.log(userInfo);
      const { data:res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      if(res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error('更新用户状态失败');
      }
      this.$message.success('更新用户状态成功')
    },

    // 监听添加用户对话框额关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },

    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate( async valid => {
        console.log(valid);
        if(!valid) return;
        // 发起添加用户的网络请求
        const {data: res} = await this.$http.post('users', this.addForm);
        if(res.meta.status !== 201) {
          return this.$message.error('添加用户失败');
        }
        this.$message.success('添加用户成功');
        this.addDialogVisible = false;
        this.getUserList();
      })
    },

    // 获取修改用户对话框数据
    async showEditDialog(id) {
      const { data:res } = await this.$http.get('users/' + id);
      console.log(res);
      if(res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data;
      this.EditDialogVisible = true;
    },

    // 修改用户信息并提交
    EditUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if(!valid) return;
        // 发起数据请求
        const {data: res} = await this.$http.put('users/'+ this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })

        if(res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.$message.success('修改用户成功')
        this.getUserList();
        this.EditDialogVisible = false;
      })
    },
    
    // 监听对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },


    // 关闭弹框
    handleClose() {
      this.addDialogVisible = false;
      this.EditDialogVisible = false;
    },

    // 根据id删除对应的用户id
    async removeUserById(id) {
       // 询问用户是否删除用户
      const confirmRusult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '永久删除该用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRusult)
      // 用户点击了删除,则返回字符串 confirm
      // 用户取消了删除,则返回字符串 cancel
      if (confirmRusult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      this.$http.delete('users/' + id).then(res => {
        const { data: response } = res
        console.log(response)
        if (response.meta.status !== 200) {
          return this.$message.error('该用户删除失败')
        }
        this.$message.success('该用户已经删除')
        this.getUserList()
      })
    },
    
    // 点击分配用户角色
    async roleClick(uesrInfo) {
      this.uesrInfo = uesrInfo;
      const {data: res} = await this.$http.get('roles')
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error('获取用户角色失败')
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
      this.setRoleDialogVisible = true;
    }
  }
 }
</script>

<style scoped>
</style>