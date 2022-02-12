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
      <el-table-column type="expand">
        <template v-slot="scope">
          <!-- <pre>{{scope.row}}</pre> -->
          <el-row 
            :class="['bd-bottom', index1 == 0 ? 'bd-top' : '','v-center']" 
            v-for="(item1, index1) in scope.row.children" 
            :key="item1.id">
            <!-- 渲染以及权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRolesClick(scope.row, item1.id)">
              {{item1.authName}}
              </el-tag>
            <i class="el-icon-caret-right"></i>
            </el-col>

            <!-- 渲染二级权限 -->
            <el-col :span="19">
              <el-row :class="[index2 == 0 ? '' : 'bd-top','v-center']" v-for="(item2, index2) in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag closable @close="removeRolesClick(scope.row, item2.id)" type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" @close="removeRolesClick(scope.row, item3.id)" closable v-for="(item3, index3) in item2.children" :key="index3">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="scope">
          <el-button size="mini" type="primary" class="el-icon-edit" @click="editClick(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" class="el-icon-delete" @click="removeClick(scope.row.id)">删除</el-button>
          <el-button size="mini" type="warning" class="el-icon-setting" @click="distributionRoleClick(scope.row)">分配权限</el-button>
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
        <el-form-item label="角色名称"  prop="roleName">
          <el-input v-model="editFromRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFromRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRightCloseClick"
      :before-close="handleClose">
      <el-tree 
        :data="setRoleList" 
        :props="treeProps" 
        ref="roleRef"
        show-checkbox 
        node-key="id" 
        :default-checked-keys="defkeys" 
        default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleDialogClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [], // 所有角色列表数据
      addDialogVisible: false, // 控制添加角色列表弹框显隐
      editDialogVisible: false, // 控制修改角色弹框的显隐
      setRoleDialogVisible: false, // 控制分配权限弹框的显隐
      setRoleList: [], // 所有权限列表数据
      addFromRole: {
        roleName: '', // 角色名称
        roleDesc: '' // 角色描述
      },
      editFromRole: {}, // 查询到的用户角色对象
      treeProps: { // 属性控件属性绑定对象
        children: 'children',
        label: 'authName'
      },
      defkeys: [], // 默认选中的id值数组
      roleId: '', // 当前即将分配权限的角色id
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

    // 获取修改角色弹框数据
    async editClick(id) {
      const { data: res } = await this.$http.get('roles/' + id);
      if(res.meta.status !== 200) {
        return this.$message.error('查询用户失败');
      }
      this.editFromRole = res.data;
      this.getRoleList();
      console.log(res);
      this.editDialogVisible = true;
    },

    // 修改角色并提交
     EditRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return;
        console.log(valid);
        const { data: res } = await this.$http.put('roles/' + this.editFromRole.roleId, {
          roleName: this.editFromRole.roleName,
          roleDesc: this.editFromRole.roleDesc
        })
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败');
        }
        this.$message.success('修改角色成功');
        this.getRoleList();
        this.editDialogVisible = false
      })
    },

    // 关闭弹框
    handleClose() {
      this.addDialogVisible = false;
      this.editDialogVisible = false;
      this.setRoleDialogVisible = false;
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
          return this.$message.info('已经取消了删除')
        }
        const {data: res} = await this.$http.delete('roles/'+ id);
        if(res.meta.status !==200 ) {
          this.$message.error('删除失败')
        }
        this.$message.success('该用户已经删除');
        this.getRoleList();
    },

    // 根据id删除用户角色
    async removeRolesClick(role,rightId) {
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
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      // this.getRoleList();
      role.children = res.data;
      this.$message.success('删除成功')
      console.log(res);
    },

    // 分配权限弹框的点击事件
    async distributionRoleClick(role) {
      this.roleId = role.id;
      const {data: res} = await this.$http.get('rights/tree');
      if(res.meta.status !== 200) {
        this.$message.error('获取分配角色列表失败')
      }
      this.setRoleList = res.data;
      // 递归过去三级节点的id
      this.getLeafKef(role, this.defkeys)
      this.setRoleDialogVisible = true;
    },
    
    // 通过递归的形式，获取角色下的所有三级权限的id，并保存到defKeys数组中
    getLeafKef(node, arr) {
      // 如果当前node节点不包含children，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => {
        this.getLeafKef(item, arr)
      });
    },

    // 监听分配权限对话框
    setRightCloseClick() {
      this.defkeys = []
    },

    // 点击为角色分配权限
    async roleDialogClick() {
      const keys = [
        ...this.$refs.roleRef.getCheckedKeys(),
        ...this.$refs.roleRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',');
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr});
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('添加权限失败');
      }
      this.$message.success('添加权限成功');
      this.getRoleList();
      this.setRoleDialogVisible = false;
    }

  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bd-bottom {
  border-bottom: 1px solid #eee;
}

.bd-top {
  border-top: 1px solid #eee;
}

.v-center {
  display: flex;
  align-items: center;
}
</style>