<template>
  <el-card>
    <!-- 面包屑导航区 -->
    <my-bread :myBreadList="myBreadList"></my-bread>
    <!-- 卡片视图 -->

    <el-table :data="pageObject.records" border stripe style="margin-top: 15px">
      <el-table-column label="#" prop="menuId"></el-table-column>
      <el-table-column label="权限名称" prop="menuName"></el-table-column>
      <el-table-column label="路径" prop="url"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="授权" prop="permission"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="180" sortable>
        <template slot-scope="scope">{{scope.row.updateTime|fmtdate}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" sortable>
        <template slot-scope="scope">{{scope.row.createTime|fmtdate}}</template>
      </el-table-column>
      <!-- <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
          <el-tag type="danger" v-else>三级</el-tag>
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
      // 权限列表
      pageObject: {
        pageCurrent: null,
        pageSize: null,
        pages: null,
        records: [],
        total: null
      },

      myBreadList: ['权限管理', '权限列表'],

      // 分页查询参数
      pageQuery: {
        /** 当前页码 */
        pageCurrent: 1,
        /** 页面行数 */
        pageSize: 10,
        /** 排序字段 */
        orderBy: null,
        /** 升序降序,默认升序 */
        isASC: null,
        /** 按照名称查询 */
        name: null
      }
    }
  },

  created () {
    this.getMenuList()
  },

  methods: {
    async getMenuList () {
      const res = await this.$http({
        url: 'http://localhost:2020/menus',
        method: 'get',
        params: this.pageQuery
      })
      console.log(res)
      console.log(res.data.status)
      console.log(res.data.data)

      if (res.data.status !== '200') {
        return this.$message.error('获取权限列表失败！')
      }
      this.pageObject = res.data.data
    },

    /* 分页方法 */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageQuery.pageSize = val
      this.getMenuList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageQuery.pageCurrent = val
      this.getMenuList()
    }
  }
}
</script>

<style>
</style>
