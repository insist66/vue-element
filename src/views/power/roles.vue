<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色按钮区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesClick">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 角色列表区域 -->
    <el-table :data="roleList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand"></el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="scope">
          <el-button size="mini" type="primary" class="el-icon-edit" @click="editClick(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" class="el-icon-delete" @click="removeClick(scope.row.id)">删除</el-button>
          <el-button size="mini" type="warning" class="el-icon-setting">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色弹框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
      :before-close="handleClose">
      <el-form ref="addFormRef" :model="addFromRole" :rules="addFromRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFromRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addFromRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
      :before-close="handleClose">
      <el-form ref="editFormRef" :model="editFromRole" :rules="editFromRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [], //角色列表数据
      addDialogVisible: false, // 控制添加角色列表弹框显隐
      editDialogVisible: false, // 控制修改角色弹框的显隐
      addFromRole: {
        roleName: '', // 角色名称
        roleDesc: '' // 角色描述
      },
      editFromRole: {}, // 查询到的用户角色对象
      addFromRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
      },
      editFromRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
      },
    }
  },

  created() {
    this.getRoleList();
  },

  methods: {
    // 获取角色列表
    async getRoleList() {
      const {data: res} = await this.$http.get('roles');
      if(res.meta.status !==200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data;
      // console.log(this.roleList);
    },

    // 点击按钮添加新用户
    addRoleUser() {
      this.$refs.addFormRef.validate( async valid => {
        if(!valid) return;
        const {data: res} = await this.$http.post('roles', this.addFromRole);
        console.log(res);
        if(res.meta.status !== 201) {
          return this.$message.error('添加角色失败');
        }
        this.$message.success('添加角色成功');
        this.getRoleList();
        this.addDialogVisible = false;
      })
    },

    // 监听添加用户对话框额关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },

    // 监听编辑用户对话框额关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },

    // 打开框框
    addRolesClick() {
      this.addDialogVisible = true;
    },

    editClick() {
      this.editDialogVisible = true;
    },

    // 关闭弹框
    handleClose() {
      this.addDialogVisible = false;
    },

    // 根据id删除对应的角色管理id
    async removeClick(id) {
      console.log(id);
       const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch( err => err)
        console.log(result);
        if(result !== 'confirm') {
          this.$message.info('已经取消了删除')
        }
        const {data: res} = await this.$http.delete('roles/'+ id);
        if(res.meta.status !==200 ) {
          this.$message.error('删除失败')
        }
        this.$message.success('该用户已经删除');
        this.getRoleList();
    }
  }
}
</script>

<style>

</style>