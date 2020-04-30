<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread :myBreadList="myBreadList"></my-bread>
    <!-- 搜索 -->
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="pageQuery.name" class="inputSearch" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getRoleList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button
          class="inputSearchButton"
          type="success"
          @click="dialogFormVisibleAddRole = true"
        >添加角色</el-button>
      </el-col>
    </el-row>
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
      <el-table-column prop="updateTime" label="修改时间" sortable="custom" width="180"></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户" sortable="custom"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180"></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户" sortable="custom"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
          <!-- 编辑 -->
            <el-button
              @click="showEditUserDia(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <!-- 删除 -->
            <el-button
              @click="showDeleteRoleBox(scope.row.roleId)"
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              :plain="true"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
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

    <!-- 默认不显示 -->
    <!-- 添加角色表单 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAddRole">
      <el-form :model="roleForm" :rules="roleRules">
        <el-form-item label="角色名称" prop="rolename" label-width="100px">
          <el-input v-model="roleForm.rolename" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark" label-width="100px">
          <el-input v-model="roleForm.remark" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddRole = false">取 消</el-button>
        <el-button type="primary" @click="createRole()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户表单 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEditRole">
      <el-form :model="roleForm" :rules="roleRules">
        <el-form-item label="角色名称" prop="rolename" label-width="100px">
          <el-input v-model="roleForm.username" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark" label-width="100px">
          <el-input v-model="roleForm.password" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditRole = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 面包屑参数
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
      },

      /* 添加角色表单 */
      roleForm: {
        rolename: null,
        remark: null
      },

      // 添加用户限制规则
      roleRules: {
        rolename: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'change'
          }
        ],
        remark: [
          {
            required: true,
            message: '请输入描述',
            trigger: 'change'
          }
        ]
      },

      // 组件可见性
      dialogFormVisibleAddRole: false,
      dialogFormVisibleEditRole: false

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

    // 添加角色
    async createRole () {
      const res = await this.$http({
        url: 'http://www.ericson.top:2020/role',
        method: 'post',
        data: this.roleForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('添加角色成功')
        this.dialogFormVisibleAddRole = false
        this.getRoleList()
        this.roleForm.rolename = null
        this.roleForm.remark = null
      } else {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    },

    // 编辑角色
    async editRole () {
      const res = await this.$http({
        url: 'http://www.ericson.top:2020/role/' + this.editRoleId,
        method: 'put',
        data: this.roleForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('修改角色成功')
        this.getRoleList()
        this.dialogFormVisibleEditRole = false
      } else {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    },

    // 显示删除对话框
    showDeleteRoleBox (roleId) {
      this.$confirm('确认删除角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRole(roleId)
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },

    // 删除角色
    async deleteRole (id) {
      const res = await this.$http({
        url: 'http://www.ericson.top:2020/role/' + id,
        method: 'delete'
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('删除成功')
        this.getRoleList()
      } else {
        const { msg } = res.data
        this.$message.warning(msg)
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
