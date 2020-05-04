<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread :myBreadList="myBreadList"></my-bread>
    <!-- 搜索 -->
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="pageQuery.name" class="inputSearch" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getStoreList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button class="inputSearchButton" type="success" @click="showAddStoreDia()">新增仓库</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" height="500px" style="width: 100%,">
      <el-table-column prop="storeId" label="仓库id"></el-table-column>
      <el-table-column prop="storeName" label="仓库名"></el-table-column>
      <el-table-column prop="sn" label="编号"></el-table-column>
      <el-table-column prop="addr" label="地址" width="270"></el-table-column>
      <el-table-column prop="managerStr" label="管理员"></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="180"></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑 -->
            <el-button
              @click="showEditStoreDia(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <!-- 删除 -->
            <el-button
              @click="showDeleteStoreBox(scope.row.storeId)"
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
    <!-- 添加仓库对话框 -->
    <el-dialog title="添加仓库" :visible.sync="dialogFormVisibleAddStore">
      <el-form :model="createStoreForm" :rules="storeRules">
        <el-form-item label="仓库名称" prop="storeName" label-width="100px">
          <el-input v-model="createStoreForm.storeName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="仓库编号" prop="sn" label-width="100px">
          <el-input v-model="createStoreForm.sn" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="仓库地址" prop="addr" label-width="100px">
          <el-input v-model="createStoreForm.addr" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="负责人" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="createStoreForm.managerId">
            <el-option
              v-for="(manager,index) in managerlist"
              :label="manager.username"
              :value="manager.userId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddStore = false">取 消</el-button>
        <el-button type="primary" @click="createStore()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑仓库对话框 -->
    <el-dialog title="编辑仓库" :visible.sync="dialogFormVisibleEditStore">
      <el-form :model="editStoreForm" :rules="storeRules">
        <el-form-item label="仓库名称" prop="storeName" label-width="100px">
          <el-input v-model="editStoreForm.storeName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="仓库编号" prop="sn" label-width="100px">
          <el-input v-model="editStoreForm.sn" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="仓库地址" prop="addr" label-width="100px">
          <el-input v-model="editStoreForm.addr" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="editStoreForm.managerId">
            <el-option
              v-for="(manager,index) in managerlist"
              :label="manager.username"
              :value="manager.userId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditStore = false">取 消</el-button>
        <el-button type="primary" @click="editStore()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 面包屑参数
      myBreadList: ['基础信息管理', '仓库信息录入'],

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
        pageSize: 5,
        total: 0,
        pages: 0,
        records: ''
      },

      managerlist: [],

      // 新增使用的数据
      createStoreForm: {
        storeId: '',
        storeName: '',
        sn: '',
        addr: '',
        managerId: ''
      },

      editStoreId: '',

      editStoreForm: {
        storeId: '',
        storeName: '',
        sn: '',
        addr: '',
        managerId: ''
      },

      // 添加用户限制规则
      storeRules: {
        storeName: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'change'
          }
        ],
        sn: [
          {
            required: true,
            message: '请输入编号',
            trigger: 'change'
          }
        ],
        addr: [
          {
            required: true,
            message: '请输入地址',
            trigger: 'change'
          }
        ]
      },

      // 组件可见性
      dialogFormVisibleAddStore: false,
      dialogFormVisibleEditStore: false
    }
  },
  created () {
    // 获取仓库列表
    this.getStoreList()
  },
  methods: {
    // 获取仓库列表
    async getStoreList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6002/stores',
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
      } else {
        console.log(msg)

        // console.log(msg)
      }
    },

    async showAddStoreDia () {
      this.dialogFormVisibleAddStore = true
      this.getManagerlist()
    },

    async getManagerlist () {
      const res = await this.$http({
        url: 'http://api.ericson.top:2020/users',
        method: 'get'
      })
      // 解构
      const { status, msg } = res.data
      // 判断返回正确结果
      if (status === '200') {
        // 解构
        const { data } = res.data
        console.log(data)
        this.managerlist = data.records
      } else {
        console.log(msg)
      }
    },

    // 添加仓库
    async createStore () {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/store',
        method: 'post',
        data: this.createStoreForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('添加仓库成功')
        this.createStoreForm.storeName = ''
        this.createStoreForm.sn = ''
        this.createStoreForm.managerId = ''
        this.createStoreForm.addr = ''
        this.dialogFormVisibleAddStore = false
        this.getStoreList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示编辑仓库表单
    showEditStoreDia (store) {
      this.dialogFormVisibleEditStore = true
      this.getManagerlist()
      this.editStoreId = store.storeId
      this.editStoreForm.storeName = store.storeName
      this.editStoreForm.sn = store.sn
      this.editStoreForm.managerId = store.managerId
      this.editStoreForm.addr = store.addr
    },

    // 编辑仓库
    async editStore () {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/store/' + this.editStoreId,
        method: 'put',
        data: this.editStoreForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('修改仓库信息成功')
        this.editStoreForm.storeName = ''
        this.editStoreForm.sn = ''
        this.editStoreForm.managerId = ''
        this.editStoreForm.addr = ''
        this.dialogFormVisibleEditStore = false
        this.getStoreList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示删除对话框
    showDeleteStoreBox (storeId) {
      this.$confirm('确认删除仓库吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteStore(storeId)
        })
        .storech(() => {
          this.$message.info('已取消')
        })
    },

    // 删除仓库
    async deleteStore (id) {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/store/' + id,
        method: 'delete'
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('删除成功')
        this.getStoreList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    /* 分页方法 */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageQuery.pageSize = val
      this.getStoreList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageQuery.pageCurrent = val
      this.getStoreList()
    }
  }
}
</script>

<style>
</style>
