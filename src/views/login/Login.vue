<template>
  <div class="container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form class="login_form" :model="loginFrom" ref="loginFromRef" :rules="loginFromRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginFrom.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据绑定对象
      loginFrom: {
        username: 'admin', // 用户名
        password: '123456' // 用户密码
      },
      // 表单的验证规则对象
      loginFromRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },

  methods: {
    // 重置表单为空
    resetLoginForm() {
      this.$refs.loginFromRef.resetFields();
    },
    // 登录的点击方法
    login() {
      this.$refs.loginFromRef.validate(async valid => {
        // console.log(valid);
        if(!valid) return;
        const { data: res } = await this.$http.post('login', this.loginFrom);
        if(res.meta.status !== 200) {
          return this.$message.error('登录失败');
        }
        this.$message.success('登录成功');
        // 1 将成功之后的token 保存到客户端的sessionStorage 中
        //  1.1 项目中除了登录之外的API接口，必须在登录之后才能访问
        //  1.2 token 只应在当前网站打开生效 所以token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token);
        this.$router.push("/home");
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {                                           
  height: 100%;
  background: #2b4b6b;
}

.login_box {
  height: 300px;
  width: 450px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 100px;
    width: 100px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  padding: 20px;
  width: 100%;;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: center;
}
</style>