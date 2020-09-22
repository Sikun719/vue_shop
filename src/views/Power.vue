<template>
  <div class="Power">
    <!-- 权限管理-角色列表 -->
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <!-- 添加角色按钮区域 -->
        <el-col>
          <el-button class="btn" type="primary" @click="addDialogVisble = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 查看信息 -->
            <!-- <pre>
              {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="284px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
            >删除</el-button>
            <!-- 分配权限按钮 -->
            <el-button
              @click="showSetRightDialog(scope.row)"
              size="mini"
              type="warning"
              icon="el-icon-setting"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisble" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRoules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 这是树形控件 -->
      <el-tree
        :data="rightslist"
        default-expand-all
        :props="treeProps"
        :default-checked-keys="defKeys"
        show-checkbox
        node-key="id"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      addDialogVisble: false, //控制对话框的显示和隐藏
      addForm: {
        roleName: "", //角色名称
        roleDesc: "", //角色描述
      },
      //添加表单的验证规则对象
      addFormRoules: {
        //   角色验证规则
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 6,
            message: "长度在2~6个字符之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 2,
            max: 18,
            message: "长度在2~18个字符之间",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false, //控制修改角色对话框的显示与隐藏
      editForm: {}, //查询到的角色信息对象
      editFormRules: {
        //   角色验证规则
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 6,
            message: "长度在2~6个字符之间",
            trigger: "blur",
          },
        ],
        //   角色描述规则
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 2,
            max: 18,
            message: "长度在2~18个字符之间",
            trigger: "blur",
          },
        ],
      },
      //控制分配权限的对话框的显示与隐藏
      setRightDialogVisible: false,
      rightslist: [], //所有权限的数据
      //树形控件的绑定对象
      treeProps: {
        label: "authName", //接口数据参数
        children: "children", //接口数据参数
      },
      defKeys: [], //默认选中的节点ID值数组
      roleId: "", //当前即将分配角色的ID
    };
  },
  created() {
    this.getRolesList(); //函数方法 下面调用
  },
  methods: {
    //获取所有角色的列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取角色列表失败");
      } else {
        this.rolelist = res.data;
      }
    },
    //监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields(); //重置表单
    },
    // 点击按钮，添加新角色  添加
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加角色的网络请求
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加角色失败！");
        }
        this.$message.success("添加角色成功！");
        // 隐藏添加角色的对话框
        this.addDialogVisble = false;
        // 重新获取角色列表数据
        this.getRolesList();
      });
    },
    //展示编辑角色的对话框
    async showEditDialog(id) {
      //点击显示对话框
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status != 200) {
        this.$message.error("查询角色信息失败");
      } else {
        console.log(res.data.roleId);
        this.editForm = res.data;
      }
    },
    //监听修改角色对话框的关闭事件（当再次点击修改验证消息会消失）
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改角色信息并且提交  修改
    editUserInfo() {
      // 预校验 flase不通过 true通过
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填写正确的角色信息");
        } else {
          //请求后台接口修改角色信息数据
          const { data: res } = await this.$http.put(
            "roles/" + this.editForm.roleId,
            {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc,
            }
          );
          if (res.meta.status !== 200) {
            this.$message.error("角色信息更新失败");
          } else {
            //关闭对话框
            this.editDialogVisible = false;
            //刷新数据列表
            this.getRolesList();
            //提示修改成功
            this.$message.success("更新角色信息成功");
          }
        }
      });
    },
    //根据Id删除对应的角色信息    删除
    async removeUserById(id) {
      //弹框提示是否删除数据
      const confirmResult = await this.$confirm("是否删除当前角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => {
        return err;
      });
      //如果角色确认删除 则返回值为字符串 confirm
      //如果角色取消了删除 则返回值的字符串为 cancel
      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        this.$message.info("已取消删除");
      } else {
        const { data: res } = await this.$http.delete("roles/" + id);
        if (res.meta.status !== 200) {
          console.log(res);
          this.$message.error("删除角色信息失败");
        } else {
          //刷新数据列表
          this.getRolesList();
          this.$message.success("删除角色信息成功");
        }
      }
    },
    // 根据id删除对应的权限  删除权限
    async removeRightById(role, rightId) {
      //弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将会删除当前权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (confirmResult !== "confirm") {
        this.$message.info("取消了删除");
      } else {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status !== 200) {
          this.$message.error("删除权限失败");
        } else {
          //重新赋值权限 （不写页面会合上）
          role.children = res.data;
          this.$message.success("删除用户权限成功");
        }
      }
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      //下面用到的 （点击为用户分配权限  "..."展开运算符）
      this.roleId = role.id;
      //显示对话框
      this.setRightDialogVisible = true;
      //获取所有权限的数据 (接口)
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        this.$message.error("获取权限失败");
      } else {
        //把获取到的权限数据保存到data中
        console.log(this.rightslist);
        this.rightslist = res.data;

        //递归获取三级节点的ID
        this.getLeafKeys(role, this.defKeys);
      }
    },
    //通过递归得形式 获取角色所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    //点击为用户分配权限  "..."展开运算符
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // console.log(keys) 打印id
      const idStr = keys.join(","); //转换成以逗号隔开的字符串
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error("分配角色失败");
      } else {
        this.$message.success("分配角色成功");
        //刷新列表数据
        this.getRolesList();
        this.setRightDialogVisible = false;
      }
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid white;
}
.bdbottom {
  border-bottom: 1px solid white;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>