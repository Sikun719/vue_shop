<template>
  <div class="home">
    <!-- 登录后的主页面 -->
    <el-container class="home_container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img class="img1" src="../../public/img/头像4.jpg" alt />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="danger" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧面栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 动态绑定布尔值定义宽度 -->
          <!-- 点击展开收缩 -->
          <div class="toggle_button" @click="toggleCollapse">|||</div>
          <!-- 侧面栏菜单区域 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <!-- 一级菜单                                          unique-opened可以展开多个菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id" unique-opened>
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 动态绑定图标的id -->
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="savNavState('/' + subItem.path)"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menulist: [], //左侧菜单数据
      //icon图标分别为不同的图标
      iconsObj: {
        125: "el-icon-s-custom",
        103: "el-icon-s-goods",
        101: "el-icon-s-cooperation",
        102: "el-icon-s-order",
        145: "el-icon-s-data",
      },
      isCollapse: false, //是否折叠菜单
      activePath: "", // 被激活的链接地址,
    };
  },
  created() {
    this.getMenuList(); //下面调用
    this.activePath = window.sessionStorage.getItem("activePath");//赋值
  },
  methods: {
    //点击按钮,切换菜单的折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //退出登录 clear清除 返回登录页面
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/Login");
      this.$message.warning("退出登录成功");
    },
    //获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        this.$message.reeor(res.meta.msg);
      } else {
        this.menulist = res.data;
      }
    },
    //保存链接的激活状态 存放在sessionStorage中
    savNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath
    },
  },
};
</script>

<style scoped>
.home {
  width: 100%;
}
.home_container {
  height: 969px;
}
.img1 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding-top: 5px;
}
.el-header {
  background-color: rgb(55, 60, 64);
  display: flex;
  justify-content: space-between;
  align-items: center; /* 上下居中 */
}
.el-header span {
  color: white;
  position: relative;
  top: -20px;
  left: 15px;
  font-weight: 600;
  font-family: 等线;
  font-size: 17px;
}
.el-aside {
  background: #333744;
}
.el-main {
  background: ghostwhite;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
.toggle_button {
  background: #4a5064;
  font-size: 12px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.1rem; /* div内部元素间隔 */
  cursor: pointer;
}
</style>