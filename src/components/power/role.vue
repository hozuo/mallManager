<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread :myBreadList="myBreadList"></my-bread>
    <!-- 表格 -->
    <el-table
      @sort-change="sort"
      ref="multipleTable"
      :data="tableData"
      height="500px"
      style="width: 100%,"
    >
      <el-table-column prop="roleId" label="角色id" sortable="custom"></el-table-column>
      <el-table-column prop="rolename" label="角色名" sortable="custom"></el-table-column>
      <el-table-column prop="remark" label="备注" sortable="custom"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" sortable="custom"></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户" sortable="custom"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户" sortable="custom"></el-table-column>
      <!-- <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <el-button
              @click="showEditUserDia(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <el-button
              @click="showDeleteUserBox(scope.row.userId)"
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              :plain="true"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>-->
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageObject.pageCurrent"
      :page-sizes="[ 2, 5, 10, 20, 50, 100]"
      :page-size="pageQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageObject.total"
      style="margin-top: 10px;"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      myBreadList: ['权限管理', '角色列表'],
      // 表格使用的数组
      tableData: [],
      // 分页查询参数
      pageQuery: {
        /** 当前页码 */
        pageCurrent: 1,
        /** 页面行数 */
        pageSize: 5,
        /** 排序字段 */
        orderBy: null,
        /** 升序降序,默认升序 */
        isASC: null,
        /** 按照名称查询 */
        name: null
      },

      /* 分页查询返回参数 */
      pageObject: {
        pageCurrent: 1,
        pageSize: 10,
        total: 0,
        pages: 0,
        records: ''
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:2020/roles',
        method: 'get',
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
        this.pageObject = data
        this.tableData = this.pageObject.records
      } else if (status === '600') {
        this.$message.warning('用户未登录')
        this.$router.push('/login')
      }
    },

    /* 分页方法 */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageQuery.pageSize = val
      this.getRoleList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageQuery.pageCurrent = val
      this.getRoleList()
    },

    // 排序方法
    sort ({ column, prop, order }) {
      console.log(column)
      console.log(prop)
      console.log(order)
      this.pageQuery.orderBy = prop
      if (order === 'descending') {
        this.pageQuery.isASC = false
      } else if (order === 'ascending') {
        this.pageQuery.isASC = true
      } else {
        this.pageQuery.isASC = true
        this.pageQuery.orderBy = 'roleId'
      }
      this.getRoleList()
    }
  }
}
</script>

<style>
</style>
