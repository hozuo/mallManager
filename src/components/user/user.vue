<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row>
      <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
      </el-col>
      <el-col :span="4">
        <el-button class="inputSearchButton" type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      height="500px"
      style="width: 100%,"
    >
      <el-table-column type="index" label="#" width="55"></el-table-column>
      <el-table-column prop="name" label="用户名" width="120"></el-table-column>
      <el-table-column prop="date" label="用户id" width="180"></el-table-column>
      <el-table-column prop="name" label="电子邮箱" width="180"></el-table-column>
      <el-table-column prop="address" label="电话" width="180"></el-table-column>
      <el-table-column prop="address" label="用户状态" width="180"></el-table-column>
      <el-table-column prop="address" label="修改时间" width="180"></el-table-column>
      <el-table-column prop="address" label="修改用户" width="180"></el-table-column>
      <el-table-column prop="address" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="address" label="创建用户" width="180"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      // 分页查询参数
      pageQuery: {
        /** 当前页码 */
        pageCurrent: '1',
        /** 页面行数 */
        pageSize: '10',
        /** 排序字段 */
        orderBy: '',
        /** 升序降序,默认升序 */
        isASC: '',
        /** 按照名称查询 */
        name: ''
      },
      query: ''
    }
  },
  methods: {
    async getUserList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:2020/users',
        method: 'post',
        transformRequest: [
          data => {
            // 对 data 进行任意转换处理
            return this.$Qs.stringify(data)
          }
        ],
        data: this.pageQuery
      })

      // 解构
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        // 解构
        const { data, message } = res.data
      }
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.inputSearch {
  margin-top: 15px;
  margin-left: 0%;
  width: 350px;
}
.inputSearchButton {
  margin-top: 15px;
}
</style>
