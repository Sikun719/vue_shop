<template>
  <div class="Report">
    <!-- 数据统计-数据报表 -->
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 1625px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts报表
import echarts from "echarts";
//导入lodash
import _ from "lodash";
export default {
  data() {
    return {
      // options 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  created() {},
  //此时页面上的元素已经被渲染完毕了 才初始化图标
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      this.$message.error("获取折线图数据失败");
    }
    //4.准备数据和配置项
    const result = _.merge(res.data, this.options);

    //5.展示数据
    myChart.setOption(result);
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
</style>