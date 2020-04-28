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
        <el-input placeholder="请输入内容" v-model="pageQuery.name" class="inputSearch">
          <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button class="inputSearchButton" type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" height="500px" style="width: 100%,">
      <el-table-column type="index" label="#" width="55"></el-table-column>
      <el-table-column prop="userId" label="用户id" width="70"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120"></el-table-column>
      <el-table-column prop="email" label="电子邮箱" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column label="用户状态" width="90">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.invitation"
            active-value="0"
            inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="180"></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户" width="120"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户" width="120"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain="true"></el-button>
            <el-button type="success" icon="el-icon-check" circle size="mini" plain="true"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain="true"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 表格使用的数组
      tableData: [],
      // 分页查询参数
      pageQuery: {
        /** 当前页码 */
        pageCurrent: '1',
        /** 页面行数 */
        pageSize: '10',
        /** 排序字段 */
        orderBy: null,
        /** 升序降序,默认升序 */
        isASC: null,
        /** 按照名称查询 */
        name: null
      },
      invitation: false
    }
  },
  methods: {
    async getUserList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:2020/users',
        method: 'get',
        headers: {
          token: localStorage.getItem('token'),
          'Access-Control-Allow-Headers': ''
        },
        params: this.pageQuery
      })

      // 解构
      const { status, msg } = res.data
      console.log(status)
      console.log(msg)

      // 判断返回正确结果
      if (status === '200') {
        // 解构
        const { data } = res.data
        console.log(data)
        this.tableData = data.records
      }
    }
  },
  created () {
    this.getUserList()
    console.log(localStorage.getItem('token'))
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
