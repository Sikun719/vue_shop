<template>
  <div class="home">
    <div class="button">
      <el-button type="info" @click="logout">退出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
      //退出登录 clear清除 返回登录页面
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/Login");
       this.$message.warning('退出登录成功');
    },
  },
};
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  background: white;
}
</style>