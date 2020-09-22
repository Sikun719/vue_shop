<template>
  <div class="Cart">
    <!-- 商品管理-商品分类 -->
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="tree-table"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :data="catelist"
        :columns="columns"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:rgb(64,158,255)"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot-scope="scope" slot="opt">
          <!-- 修改按钮 -->
          <el-button
            @click="showEditDialog(scope)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
          >编辑</el-button>
          <!-- 删除按钮 -->
          <el-button
            size="mini"
            @click="removeUserById(scope)"
            type="danger"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisble"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <!-- 分类名称 -->
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :props="casadeProps"
            :options="parentCateList"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改商品名称"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="addCateFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="商品名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询条件（接口中的参数）
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catelist: [], //商品分类的数据列表，默认为空
      total: 0, //总数据条数
      //为table指定列的定义
      columns: [
        {
          // label:标题名称
          label: "分类名称",
          prop: "cat_name", //接口参数 名称
        },
        {
          // label:标题名称
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "isok",
        },
        {
          // label:标题名称
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "order",
        },
        {
          // label:标题名称
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "opt",
        },
      ],
      addCateDialogVisble: false, //控制添加分类对话框的显示与隐藏
      //添加分类的表单数据对象
      addCateForm: {
        cat_name: "", //将要添加的分类名称
        cat_pid: 0, //父级分类的ID
        cat_level: 0, //分类的等级默认添加的是1级分类
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入修改商品的名称", trigger: "blur" },
        ],
      },
      parentCateList: [], //父级分类的列表
      //指定级联选择器的配置对象
      casadeProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [], //选中的父级分类ID数组
      editDialogVisible: false, //控制修改分类对话框的显示与隐藏
      editForm: {}, //查询到的分类信息对象
      //修改表单的验证规则对象
    };
  },
  created() {
    this.getCateList(); //下面调用
  },
  methods: {
    //获取商品分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类失败");
      } else {
        // console.log(res.data);
        //把数据列表赋值给catelist
        this.catelist = res.data.result;
        //为总数据条数赋值
        this.total = res.data.total;
      }
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      // 刷新数据
      this.getCateList();
    },
    // 监听pagenum改变
    handleCurrentChange(numPage) {
      this.queryInfo.pagenum = numPage;
      // 刷新数据
      this.getCateList();
    },
    //点击按钮添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的列表（下面用到的）
      this.getParentCateList();
      //点击对话框出现
      this.addCateDialogVisble = true;
    },
    //获取父级分类的数据列表(接口)
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取父级分类数据失败");
      } else {
        // console.log(res.data);
        // 将获取到的数据保存到parentCateList数组中
        this.parentCateList = res.data;
      }
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      //   console.log(this.selectedKeys);
      //如果selectedKeys,数组中的length大于0,证明选中了父级分类
      // 反之就说明没有选中任何的父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的ID
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        //为当前的分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        //父级的ID
        this.addCateForm.cat_pid = 0;
        //为当前的分类等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮添加新的分类（接口）
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        //刷新数据列表
        this.getCateList();
        // 关闭对话框
        this.addCateDialogVisble = false;
      });
    },
    //监听对话框的关闭事件，重置表单数据  "resetFields":(方法)
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      //点击取消清空数组
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },

    //展示编辑分类的对话框
    async showEditDialog(scope) {
      //点击显示对话框
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(
        `categories/` + scope.row.cat_id
      );
      if (res.meta.status != 200) {
        this.$message.error("查询分类信息失败");
      } else {
        // console.log(res.data.cat_id); 查询ID值
        this.editForm = res.data;
      }
    },
    //监听修改商品对话框的关闭事件（当再次点击修改验证消息会消失）
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改商品信息并且提交  修改
    editUserInfo() {
      // 预校验 flase不通过 true通过
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填写正确的商品信息");
        } else {
          //请求后台接口修改商品信息数据
          const { data: res } = await this.$http.put(
            "categories/" + this.editForm.cat_id,
            {
              cat_name: this.editForm.cat_name,
            }
          );
          if (res.meta.status !== 200) {
            this.$message.error("商品信息更新失败");
          } else {
            //关闭对话框
            this.editDialogVisible = false;
            //刷新数据列表
            this.getCateList();
            //提示修改成功
            this.$message.success("更新商品信息成功");
          }
        }
      });
    },

    //根据Id删除对应的商品信息    删除功能
    async removeUserById(scope) {
      const { data: res } = await this.$http.get(
        `categories/` + scope.row.cat_id
      );
      if (res.meta.status != 200) {
        this.$message.error("查询分类信息失败");
      } else {
        // console.log(res.data.cat_id); 查询ID值
        this.editForm = res.data;
      }
      //弹框提示是否删除数据
      const confirmResult = await this.$confirm("是否删除当前商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => {
        return err;
      });
      //如果商品确认删除 则返回值为字符串 confirm
      //如果商品取消了删除 则返回值的字符串为 cancel
      console.log(confirmResult);
      if (confirmResult !== "confirm") {
        this.$message.info("已取消删除");
      } else {
        const { data: res } = await this.$http.delete(
          "categories/" + this.editForm.cat_id
        );
        if (res.meta.status !== 200) {
          console.log(res);
          this.$message.error("删除商品信息失败");
        } else {
          //刷新数据列表
          this.getCateList();
          this.$message.success("删除商品信息成功");
        }
      }
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.tree-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>