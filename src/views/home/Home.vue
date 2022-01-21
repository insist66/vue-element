<template>
  <div>
    <el-button type="info" @click="signOut">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },

  methods: {
    // 退出到登录页面
    signOut() {
      window.sessionStorage.clear();
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>