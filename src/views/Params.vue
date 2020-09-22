
<template>
  <div class="params">
    <!--  商品管理-分类参数 -->
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部的警告区域 -->
      <el-alert title="注意：只允许设置第三级分类设置相关参数！" show-icon type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedCateKeys"
            :options="catList"
            @change="handleChange"
            :props="cateProps"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            class="btn"
            @click="addDialogVisble = true"
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  @close="handleClose(i,scope.row)"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button
            @click="addDialogVisble = true"
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
          >添加属性</el-button>
          <!-- 动态静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  @close="handleClose(i,scope.row)"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisble"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisble"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catList: [], //商品分类列表
      //级联选择框的配置对象
      cateProps: {
        value: "cat_id", //指定选中的值(cat_id接口参数)
        label: "cat_name", //指定看到的值(cat_name接口参数)
        children: "children", //指定父子节点嵌套属性(children接口参数)
      },
      selectedCateKeys: [], //级联选择框双向绑定的数组
      activeName: "many", //被激活的标签名称
      manyTableData: [], //动态参数的数据
      onlyTableData: [], //静态属性的数据
      addDialogVisble: false, //控制添加对话框的显示与隐藏
      //添加参数的表单数据对象
      addFrom: {
        attr_name: "",
      },
      //添加表单的验证规则对象
      addFromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editDialogVisble: false, //控制对话框的显示与隐藏
      //   修改的表单数据对象
      editFrom: {},
      //   修改表单的验证规则对象
      editFromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  //   计算属性
  computed: {
    //如果按钮需要被禁用 则返回true 否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    //当前选中的三级分类ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      } else {
        return null;
      }
    },
    //动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  created() {
    this.getCateList(); // 下面调用
  },
  methods: {
    // 获取所有的商品列表 （接口）
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表失败");
      } else {
        this.catList = res.data;
        // console.log(this.catList);
      }
    },
    // 级联选择框中项发生变化 会触发这个函数
    handleChange() {
      this.getParamsData(); //调用getParamsData
    },

    // 获取参数的列表数据
    async getParamsData() {
      console.log(this.selectedCateKeys);
      // 如果不等于3 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        //清空数组
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      } else {
        //   证明选中的是三级分类
        // console.log(this.selectedCateKeys);
        // 根据所选的分类ID和当前所处的面板，获取对应的参数(接口)
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: this.activeName,
            },
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("获取参数列表失败");
        }
        //for循环 tag标签
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          //控制文本框的显示与隐藏
          item.inputVisible = false;
          // 文本框中输入的值
          item.inputValue = "";
        });
        console.log(res.data);

        if (this.activeName === "many") {
          this.manyTableData = res.data;
        } else {
          this.onlyTableData = res.data;
        }
      }
    },
    //tab页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData(); //调用getParamsData
    },
    //监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFromRef.resetFields();
    },
    //点击添加按钮 添加参数
    addParams() {
      this.$refs.addFromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          this.$message.error("添加参数失败");
        } else {
          this.$message.success("添加参数成功");
          //关闭对话框
          this.addDialogVisble = false;
          //刷新数据列表
          this.getParamsData();
        }
      });
    },
    //点击按钮展示修改的对话框 (接口)
    async showEditDialog(attr_id) {
      //查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error("获取参数信息失败");
      } else {
        this.editFrom = res.data;
        this.editDialogVisible = true;
      }
      //显示对话框
      this.editDialogVisble = true;
    },
    //重置表单的操作
    editDialogClosed() {
      this.$refs.editFromRef.resetFields();
    },
    //点击按钮修改信息 修改(接口)
    editParams() {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("修改参数失败");
        } else {
          this.$message.success("修改参数成功");
          // 刷新列表数据
          this.getParamsData();
          // 关闭对话框
          this.editDialogVisble = false;
        }
      });
    },
    //根据ID删除对应的参数项
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //用户取消了删除
      if (confirmResult !== "confirm") {
        this.$message.info("已取消删除");
      } else {
        //删除的业务逻辑
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${attr_id}`
        );
        if (res.meta.status !== 200) {
          this.$message.error("删除参数失败");
        } else {
          this.$message.success("删除参数成功");
          // 刷新数据列表
          this.getParamsData();
        }
      }
    },
    //文本框失去焦点 或者回车都会触发
    async handleInputConfirm(row) {
      //trim自动过滤用户首尾输入的空格
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //如果没有return，则证明输入的内容需要做后续的处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row) {
      // 需要发起请求，保存这次操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败");
      }
      this.$message.success("修改参数项成功");
    },
    //点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获得焦点
      //$nexTick 方法的作用就是当页面元素被重新渲染后才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除对应的参数可选项
    async handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      // 需要发起请求，保存这次删除操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数项失败");
      }
      this.$message.success("删除参数项成功");
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.cat_opt {
  margin: 15px 0px;
}
span {
  margin: 15px 0px;
}
.btn {
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>