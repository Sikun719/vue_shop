<template>
  <div class="Login">
    <div class="login_container">
      <div class="login_box">
        <!-- 头像 -->
        <div class="avatar_box">
          <img src="../../public/img/头像4.jpg" alt />
        </div>
        <!-- 登录表单 element-->
        <el-form
          status-icon
          ref="loginFormRef"
          label-width="0px"
          :rules="loginFormRules"
          class="login_form"
          :model="loginForm"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <!--prop 验证项  username与data一样-->
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <!--prop 验证项 password与data一样-->
            <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-s-goods"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin", //用户名
        password: "123456", //密码
      }, //这是登录表单的数据对象
      //表单的验证规则
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在3到10个字符之间",
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在6到15个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    //登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!true) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) {
          this.$message.error("登录失败！");
        } else {
          this.$message.success("登录成功！");
          // 1.将登陆成功之后的token保存到客户端的sessionStorage中
          // 1.1项目中除了登录之外的其他API接口，必须在登陆之后才能访问
          // 1.2token 只应在当前的网站打开期间生效，所以将token保存在sessionStorag中
          console.log(res);
          window.sessionStorage.setItem("token", res.data.token);
          // 2.通过编程式导航跳转到后台主页，路由地址是/home
          this.$router.push("/Home");
        }
      });
    },
  },
};
</script>

<style  scoped>
.Login {
  width: 100%;
  height: 100%;
}
.login_container {
  margin: 0;
  padding: 0;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid gainsboro;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: gainsboro;
}
.btns {
  display: flex;
  justify-content: space-around;
}
.login_form {
  position: absolute;
  bottom: 25px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>