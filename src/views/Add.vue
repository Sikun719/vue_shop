<template>
  <div class="Add">
    <!-- 商品管理-商品添加 -->
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏区域 -->
        <el-tabs
          @tab-click="tabClicked"
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称：" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格：" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量：" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量：" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(cb,i) in item.attr_vals" :key="i" :label="cb"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性渲染 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 图片上传面板 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传  action表示图片要上传的后台接口地址  on-preview指定预览的事件-->
            <el-upload
              :on-success="handleSuccess"
              :headers="headerObj"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 安装依赖-->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor class="height" v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button class="btn" type="primary" @click="add">添加按钮</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img class="previewImg" :src="previewPath " alt />
    </el-dialog>
  </div>
</template>

<script>
//导入lodash
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0", //步骤条默认第一个
      //添加商品的表单数据对象（接口参数）
      addForm: {
        goods_name: "", //名称
        goods_price: 0, //价格
        goods_weight: 0, //重量
        goods_number: 0, //数量
        goods_cat: [], //商品所属的分类数组
        pics: [], //图片的数组
        goods_introduce: "", //商品的详情描述
        attrs: [], //最后添加的数组数据
      },
      //校验规则
      addFormRules: {
        //   商品名称验证规则
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        //   商品价格验证规则

        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        //   商品价格验证规则
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        //   商品数量验证规则
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        //   级联选择器验证规则
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      catelist: [], //商品分类列表数据
      cateProps: {
        label: "cat_name", //接口参数
        value: "cat_id", //接口参数
        children: "children",
      },
      manyTableData: [], //动态参数列表数组
      onlyTableDate: [], //静态属性列表数组
      //图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "", //预览图片
      previewVisible: false, //默认隐藏对话框
    };
  },
  created() {
    this.getCateList(); //下面调用
  },
  methods: {
    //   获取所有商品分类数据(接口)
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类数据失败");
      } else {
        this.catelist = res.data;
        // console.log(this.catelist);
      }
    },
    // 级联选择器选中项变化，会触发这个函数
    handleChange() {
      //   console.log(this.addForm.goods_cat);
      //如果选中的不是三级分类就直接清空
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat.length = [];
      }
    },
    // 必须选中分类才可以切换列表 否则不能切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    async tabClicked() {
      // console.log(this.activeIndex)
      //如果为 1 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("获取动态参数列表失败");
        } else {
          // console.log(res.data)
          //复选框用到的
          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
          });

          this.manyTableData = res.data;
        }
      } else if (this.activeIndex === "2") {
        //如果为 2 证明访问的是静态属性面板
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("获取静态属性失败");
        } else {
          //   console.log(res.data)
          this.onlyTableDate = res.data;
        }
      }
    },
    //处理图片预览的效果
    handlePreview(file) {
      // console.log(file)
      this.previewPath = file.response.data.url;
      //显示对话框
      this.previewVisible = true;
    },
    //处理移除图片的操作
    handleRemove(file) {
      //  console.log(file);
      //1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中,找到这个图片相对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      // 3.调用数组的splice方法,把图片信息对象从pics数组中移除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      //   console.log(response);
      //1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo);
      //   console.log(this.addForm);
    },
    //最后添加商品
    add() {
      //console.log(this.addForm);
      // 对所有的内容进行预校验
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填写必要的表单项");
        } else {
          //执行添加的逻辑（接口）
          //lodash cloneDeep(obj)深拷贝
          const form = _.cloneDeep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");
          //   console.log(form);
          //处理动态参数
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" "),
            };
            this.addForm.attrs.push(newInfo);
          });
          //处理静态属性
          this.onlyTableDate.forEach((item) => {
            const newInfo = {
              attr_id: "item.attr_id",
              attr_value: "item.attr_vals",
            };
            this.addForm.attrs.push(newInfo);
          });
          form.attrs = this.addForm.attrs;
          console.log(form);
          // 发起请求添加商品
          // 商品的名称，必须是唯一的
          const { data: res } = await this.$http.post("goods", form);
          if (res.meta.status !== 201) {
            return this.$message.error("添加商品失败！");
          }
          this.$message.success("添加商品成功！");
          this.$router.push("/goods");
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
.el-steps {
  margin: 30px 0px;
}
.el-checkbox {
  margin: 0px 5px 0px 0px;
}
.previewImg {
  width: 100%;
}
.ql-editor {
  height: 300px;
}
.height {
  height: 300px;
}
.btn {
  margin-left: 1400px;
  margin-top: 63px;
}
</style>