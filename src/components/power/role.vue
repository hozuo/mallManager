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
      <!-- 表格行展开,角色权限 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级菜单,根节点 -->
          <el-row v-for="(item1,i) in scope.row.menus" :key="i">
            <el-col :span="3">
              <el-tag
                @close="deleteRoleMenu(scope.row.roleId,item1.menuId)"
                closable
                type="warning"
              >{{item1.menuName}}</el-tag>
              <i v-if="item1.children.length!==0" class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="21">
              <!-- 二级菜单 -->
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="3">
                  <el-tag
                    @close="deleteRoleMenu(scope.row.roleId,item2.menuId)"
                    closable
                  >{{item2.menuName}}</el-tag>
                  <i v-if="item2.children.length!==0" class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="21">
                  <!-- 三级菜单,叶子结点 -->
                  <el-row>
                    <el-tag
                      @close="deleteRoleMenu(scope.row.roleId,item3.menuId)"
                      closable
                      type="success"
                      v-for="(item3,i) in item2.children"
                      :key="i"
                    >{{item3.menuName}}</el-tag>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.menus===undefind">未分配权限</span>
        </template>
      </el-table-column>
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
              @click="showEditRoleDia(scope.row)"
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
            <!-- 编辑权限 -->
            <el-button
              @click="showEditRoleMenuDia(scope.row)"
              type="success"
              icon="el-icon-check"
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
    <!-- 添加角色对话框 -->
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

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEditRole">
      <el-form :model="roleForm" :rules="roleRules">
        <el-form-item label="角色名称" prop="rolename" label-width="100px">
          <el-input v-model="roleForm.rolename" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark" label-width="100px">
          <el-input v-model="roleForm.remark" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditRole = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色权限对话框 -->
    <el-dialog title="修改角色权限" :visible.sync="dialogFormVisibleEditRoleMenu">
      <el-tree
        :data="menuTreeList"
        show-checkbox
        node-key="menuId"
        :default-expanded-keys="menuTreeExpandedKeys"
        :default-checked-keys="menuTreeCheckedKeys"
        :props="menuTreeProps"
        ref="menuTree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditRoleMenu = false">取 消</el-button>
        <el-button type="primary" @click="editRoleMenu()">确 定</el-button>
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
      tableData: [
        {
          menus: [
            {
              children: [{}],
              menuId: null,
              menuName: null,
              parentId: null,
              type: null
            }
          ]
        }
      ],

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

      /* 当前编辑的角色表单(多用途临时数据容器) */
      roleForm: {
        roleId: null,
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

      // 权限树的参数
      menuTreeProps: {
        children: 'children',
        label: 'menuName'
      },

      // 权限树展示数组
      menuTreeList: null,

      // 默认展开的数组(全部)
      menuTreeExpandedKeys: [],

      // 默认选中的数组
      menuTreeCheckedKeys: [],

      // 组件可见性
      dialogFormVisibleAddRole: false,
      dialogFormVisibleEditRole: false,
      dialogFormVisibleEditRoleMenu: false
    }
  },
  created () {
    // 获取角色列表
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
      // 获取角色权限
      this.getRoleMenus()
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

    // 显示编辑角色表单
    showEditRoleDia (role) {
      this.dialogFormVisibleEditRole = true
      this.roleForm.roleId = role.roleId
      this.roleForm.rolename = role.rolename
      this.roleForm.remark = role.remark
    },

    // 编辑角色
    async editRole () {
      const res = await this.$http({
        url: 'http://www.ericson.top:2020/role/' + this.roleForm.roleId,
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

    // 显示修改角色权限对话框
    async showEditRoleMenuDia (role) {
      console.log('showEditRoleMenuDia')
      // 获取全权限树
      const res = await this.$http({
        url: 'http://api.ericson.top:2020/menus',
        method: 'get',
        params: {
          type: 'tree'
        }
      })
      const { status, msg } = res.data
      console.log(status)
      console.log(msg)
      // 判断返回正确结果
      if (status === '200') {
        const { data } = res.data
        console.log(data)
        // 此时的data是infoList
        this.menuTreeList = data
      } else {
        this.$message.warning(msg)
      }
      // 设置默认展开列表
      var arrTempExpanded = []
      this.menuTreeList.forEach(item1 => {
        arrTempExpanded.push(item1.menuId)
        item1.children.forEach(item2 => {
          arrTempExpanded.push(item2.menuId)
        })
      })
      this.menuTreeExpandedKeys = arrTempExpanded

      // 设置默认选中列表
      var arrTempChecked = []
      if (role.menus !== null && role.menus !== undefined) {
        role.menus.forEach(item1 => {
          item1.children.forEach(item2 => {
            item2.children.forEach(item3 => {
              arrTempChecked.push(item3.menuId)
            })
          })
        })
      }
      this.menuTreeCheckedKeys = arrTempChecked

      // 设置当前用户id到全局的数据容器中,供提交表单时使用
      this.roleForm.roleId = role.roleId

      this.dialogFormVisibleEditRoleMenu = true
    },

    // 修改角色权限
    async editRoleMenu () {
      // 定义该角色当前选中的idSet
      let arr1 = this.$refs.menuTree.getCheckedKeys()
      let arr2 = this.$refs.menuTree.getHalfCheckedKeys()
      var arrTempMenuIdSet = [...arr1, ...arr2]

      const res = await this.$http.put(
        'http://localhost:2020/role/' + this.roleForm.roleId + '/menus',
        { menuId: arrTempMenuIdSet }
      )

      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('修改角色权限成功')
        this.getRoleList()
        this.dialogFormVisibleEditRoleMenu = false
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
    },

    // 获取角色权限
    getRoleMenus () {
      this.tableData.forEach(async element => {
        const res = await this.$http({
          url: 'http://localhost:2020/role/' + element.roleId + '/menus',
          method: 'get',
          params: this.pageQuery
        })
        // 解构
        const { status, msg } = res.data
        console.log(status)
        console.log(msg)
        // 判断返回正确结果
        if (status === '200') {
          const { data } = res.data
          console.log(data)
          element.menus = data
          console.log(element.menu)
        }
      })
    },

    // 删除角色的权限
    async deleteRoleMenu (roleId, menuId) {
      const res = await this.$http({
        url: 'http://api.ericson.top:2020/role/' + roleId + '/menus/' + menuId,
        method: 'delete'
      })

      // 解构
      const { status, msg, data } = res.data
      console.log(status)
      console.log(msg)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success(data)
        this.getRoleList()
      } else if (status === '600') {
        this.$message.warning('用户未登录')
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style>
</style>
