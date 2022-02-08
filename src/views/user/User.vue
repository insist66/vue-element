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
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserInfo()">
            <el-button slot="append" icon="el-icon-search" @click="getUserInfo()"></el-button>
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
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip class="item" effect="dark" content="分配角色" :enterable="false" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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

    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose">
      <span>这是一段信息</span>
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
      queryInfo: { // 获取用户列表的参数对象
        query: '',
        pagenum: 1, // 当前的页数
        pagesize: 2 // 当前每页显示多少条数据
      },
      total: 0, // 总条数
      userList: [], // 用户列表
      addDialogVisible: false // 控制添加用户弹框的显隐
    }
  },

  created() {
    // 获取用户列表
    this.getUserInfo();
  },

  methods: {
    // 获取用户列表
    async getUserInfo() {
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
      this.getUserInfo();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserInfo();
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

    handleClose() {

    }
  }
 }
</script>

<style scoped>
</style>