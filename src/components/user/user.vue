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
        <el-input placeholder="请输入内容" v-model="pageQuery.name" class="inputSearch" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button
          class="inputSearchButton"
          type="success"
          @click="dialogFormVisibleAddUser = true"
        >添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      @sort-change="sort"
      ref="multipleTable"
      :data="tableData"
      height="420px"
      style="width: 100%,"
    >
      <el-table-column type="index" label="#" width="55"></el-table-column>
      <el-table-column prop="userId" label="用户id" width="100" sortable></el-table-column>
      <el-table-column prop="username" label="用户名" width="120" sortable></el-table-column>
      <el-table-column prop="rolename" label="角色" width="120" sortable></el-table-column>
      <el-table-column prop="email" label="电子邮箱" width="180" sortable></el-table-column>
      <el-table-column prop="phone" label="电话" width="120" sortable></el-table-column>
      <el-table-column prop="password" label="密码" width="120" sortable></el-table-column>
      <el-table-column prop="valid" label="用户状态" width="120" sortable>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.valid"
            @change="updateUserValid([scope.row.userId,scope.row.valid])"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="180" sortable></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户" width="120" sortable></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" sortable></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户" width="120" sortable></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑用户 -->
            <el-button
              @click="showEditUserDia(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              @click="showDeleteUserBox(scope.row.userId)"
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <!-- 分配角色 -->
            <el-button type="success" icon="el-icon-check" circle size="mini" :plain="true"></el-button>
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
    ></el-pagination>
    <!-- 默认不显示 -->
    <!-- 添加用户表单 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAddUser">
      <el-form :model="addUserForm" :rules="AddUserRules">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="addUserForm.username" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="100px">
          <el-input v-model="addUserForm.password" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email" label-width="100px">
          <el-input v-model="addUserForm.email" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" label-width="100px">
          <el-input v-model="addUserForm.phone" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddUser = false">取 消</el-button>
        <el-button type="primary" @click="createUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户表单 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEditUser">
      <el-form :model="editUserForm" :rules="editUserRules">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="editUserForm.username" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email" label-width="100px">
          <el-input v-model="editUserForm.email" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" label-width="100px">
          <el-input v-model="editUserForm.phone" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="editUserForm.roleId" >
            <el-option label="区域一" :value="2"></el-option>
            <el-option label="区域二" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditUser = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'user',

  /* 数据 */
  data () {
    return {
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

      /* 添加用户对话框的可见属性 */
      dialogFormVisibleAddUser: false,

      /* 编辑用户对话框的可见属性 */
      dialogFormVisibleEditUser: false,

      /* 添加用户表单 */
      addUserForm: {
        username: null,
        password: null,
        phone: null,
        email: null
      },

      /* 编辑用户表单 */
      editUserForm: {
        username: null,
        phone: null,
        email: null,
        roleId: null
      },

      /* 编辑用户id */
      editUserId: null,

      // 添加用户限制规则
      AddUserRules: {
        username: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'change'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入电子邮箱',
            trigger: 'change'
          }
        ]
      },

      /* 编辑用户限制规则 */
      editUserRules: {
        username: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: 'change'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'change'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入电子邮箱',
            trigger: 'change'
          }
        ]
      }
    }
  },

  /* 方法 */
  methods: {
    // 获取用户列表
    async getUserList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:2020/users',
        method: 'get',
        headers: {
          token: localStorage.getItem('token')
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
        this.pageObject = data
        this.tableData = this.pageObject.records
      }
    },

    // 显示删除用户的提示框
    showDeleteUserBox (id) {
      this.$confirm('确认删除用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteUser(id)
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },

    /* 删除用户 */
    async deleteUser (id) {
      const res = await this.$http({
        url: 'http://www.ericson.top:2020/user/' + id,
        method: 'delete',
        headers: {
          token: localStorage.getItem('token')
        },
        transformRequest: [
          data => {
            // 对 data 进行任意转换处理
            return this.$Qs.stringify(data)
          }
        ]
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('删除成功')
        this.getUserList()
      }
      if (status === '401') {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    },

    /* 添加用户 */
    async createUser () {
      const res = await this.$http({
        url: 'http://www.ericson.top:2020/user',
        method: 'post',
        headers: {
          token: localStorage.getItem('token')
        },
        transformRequest: [
          data => {
            // 对 data 进行任意转换处理
            return this.$Qs.stringify(data)
          }
        ],
        data: this.addUserForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('创建用户成功')
        this.dialogFormVisibleAddUser = false
        this.getUserList()
      }
      if (status === '401') {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    },

    /* 显示编辑用户表单 */
    showEditUserDia (user) {
      this.dialogFormVisibleEditUser = true
      this.editUserForm.username = user.username
      this.editUserForm.roleId = user.roleId
      this.editUserForm.email = user.email
      this.editUserForm.phone = user.phone
      this.editUserId = user.userId
    },

    /* 编辑用户 */
    async editUser () {
      const res = await this.$http({
        url: 'http://www.ericson.top:2020/user/' + this.editUserId,
        method: 'put',
        headers: {
          token: localStorage.getItem('token')
        },
        transformRequest: [
          data => {
            return this.$Qs.stringify(data)
          }
        ],
        data: this.editUserForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('编辑用户成功')
        this.getUserList()
        this.dialogFormVisibleEditUser = false
      }
      if (status === '401') {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    },

    async updateUserValid ([userId, valid]) {
      const res = await this.$http({
        url: 'http://www.ericson.top:2020/user/' + userId + '/valid/' + valid,
        method: 'put',
        headers: {
          token: localStorage.getItem('token')
        },
        transformRequest: [
          data => {
            return this.$Qs.stringify(data)
          }
        ]
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('修改用户状态成功')
      } else {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    },

    /* 分页方法 */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageQuery.pageSize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageQuery.pageCurrent = val
      this.getUserList()
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
        this.pageQuery.orderBy = 'userId'
      }
      this.getUserList()
    }
  },

  /* 钩子函数 */
  created () {
    this.getUserList()
    console.log(localStorage.getItem('token'))
  }
}
</script>

<style>
.box-card {
  height: 550px;
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
