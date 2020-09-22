<template>
  <div class="List">
    <!-- 商品管理-商品列表 -->
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 渲染内容 -->
        <el-table-column label="商品名称" prop="goods_name" width="700px"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="150px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="150px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <!-- 事件过滤器 将毫秒转换成正常的时间格式 -->
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.goods_id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分业器区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 8, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
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
      //查询参数对象 （接口文档）
      queryInfo: {
        query: "", //搜索关键字
        pagenum: 1, //当前页码值
        pagesize: 10, //每页多少显示数据
      },
      goodslist: [], //商品列表
      total: 0, //总数据条数
      editDialogVisible: false, //控制修改用户对话框的显示与隐藏
      //查询到的用户信息对象
      editForm: {
        goods_name: "", //名称
        goods_price: 0, //价格
        goods_weight: 0, //重量
        goods_number: 0, //数量
        goods_cat: [], //商品所属的分类数组
      },
      //验证信息
      editFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入修改价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsList(); //下面调用
  },
  methods: {
    //获取对应商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表失败");
      } else {
        this.$message.success("获取商品列表成功");
        // console.log(res.data);
        this.goodslist = res.data.goods;
        this.total = res.data.total;
      }
    },
    //分页器
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    //删除
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        this.$message.info("已经取消删除");
      } else {
        //请求接口 删除
        const { data: res } = await this.$http.delete(`goods/${id}`);
        if (res.meta.status !== 200) {
          this.$message.error("删除商品失败");
        } else {
          this.$message.success("删除商品成功");
        }
      }
    },
    //添加商品跳转add页面
    goAddpage() {
      this.$router.push("/add");
    },
    //展示编辑用户的对话框
    async showEditDialog(goods_id) {
      //点击显示对话框
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("goods/" + goods_id);
      if (res.meta.status != 200) {
        this.$message.error("查询用户信息失败");
      } else {
        console.log(res.data);
        this.editForm = res.data;
      }
    },
    //监听修改用户对话框的关闭事件（当再次点击修改验证消息会消失）
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并且提交  修改
    editUserInfo(cat_id) {
      // 预校验 flase不通过 true通过
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填写正确的用户信息");
        } else {
          //请求后台接口修改用户信息数据
          const { data: res } = await this.$http.put(
            `goods/${this.editForm.cat_id}`,
            {
              goods_name: this.editForm.goods_name,
              goods_price: this.editForm.goods_price,
              goods_weight: this.editForm.goods_weight,
              goods_number: this.editForm.goods_number,
              goods_cat:this.edieForm.goods_cat
            }
          );
          console.log(res);
          if (res.meta.status !== 201) {
            this.$message.error("用户信息更新失败");
          } else {
            //关闭对话框
            this.editDialogVisible = false;
            //刷新数据列表
            this.getGoodsList();
            //提示修改成功
            this.$message.success("更新用户信息成功");
          }
        }
      });
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
.el-pagination {
  margin-top: 15px;
}
</style>