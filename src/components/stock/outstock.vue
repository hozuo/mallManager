<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread :myBreadList="myBreadList"></my-bread>
    <!-- 搜索 -->
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="pageQuery.name" class="inputSearch" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getInstockList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button class="inputSearchButton" type="success" @click="showAddInstockDia()">新增出库流水</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" height="500px" style="width: 100%,">
      <el-table-column prop="id" label="id" sortable></el-table-column>
      <el-table-column prop="sn" label="编号" width="180" sortable></el-table-column>
      <el-table-column prop="storeStr" label="仓库名" width="120" sortable></el-table-column>
      <el-table-column prop="userStr" label="出库员" width="110" sortable></el-table-column>
      <el-table-column prop="itemStr" label="出库商品" width="130" sortable></el-table-column>
      <el-table-column prop="buyId" label="采购订单号" width="170" sortable></el-table-column>
      <el-table-column prop="stock" label="实时库存" width="110" sortable></el-table-column>
      <el-table-column prop="inState" label="流程状态" width="110" sortable></el-table-column>
      <el-table-column prop="num" label="数量" sortable></el-table-column>
      <el-table-column prop="inTime" label="出库日期" width="140" sortable></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户" width="110" sortable></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" sortable width="180"></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户" width="110" sortable></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="180"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑 -->
            <el-button
              @click="showEditInstockDia(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <!-- 删除 -->
            <el-button
              @click="showDeleteInstockBox(scope.row.id)"
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
    <!-- 添加出库流水对话框 -->
    <el-dialog title="添加出库流水" :visible.sync="dialogFormVisibleAddInstock">
      <el-form :model="createInstockForm">
        <el-form-item label="出库商品" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="createInstockForm.itemId">
            <el-option
              v-for="(item,index) in itemList"
              :label="item.itemName"
              :value="item.itemId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="仓库名" prop="storeStr" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="createInstockForm.storeId">
            <el-option
              v-for="(store,index) in storeList"
              :label="store.storeName"
              :value="store.storeId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数量" prop="num" label-width="100px">
          <el-input v-model="createInstockForm.num" autocomplete="off" clearable></el-input>
        </el-form-item>

        <el-form-item label="出库员" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="createInstockForm.userId">
            <el-option
              v-for="(manager,index) in managerList"
              :label="manager.username"
              :value="manager.userId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出库时间" label-width="100px">
          <el-date-picker
            v-model="createInstockForm.inTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddInstock = false">取 消</el-button>
        <el-button type="primary" @click="createInstock()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑出库流水对话框 -->
    <el-dialog title="编辑出库流水" :visible.sync="dialogFormVisibleEditInstock">
      <el-form :model="editInstockForm">
        <el-form-item label="编号" prop="sn" label-width="100px">
          <el-input v-model="editInstockForm.sn" autocomplete="off" clearable></el-input>
        </el-form-item>

        <el-form-item label="出库商品" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="editInstockForm.itemId">
            <el-option
              v-for="(item,index) in itemList"
              :label="item.itemName"
              :value="item.itemId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="仓库名" prop="storeStr" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="editInstockForm.storeId">
            <el-option
              v-for="(store,index) in storeList"
              :label="store.storeName"
              :value="store.storeId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出库时间" label-width="100px">
          <el-date-picker
            v-model="editInstockForm.inTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="出库员" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="editInstockForm.userId">
            <el-option
              v-for="(manager,index) in managerList"
              :label="manager.username"
              :value="manager.userId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="采购订单号" prop="buyId" label-width="100px">
          <el-input v-model="editInstockForm.buyId" autocomplete="off" clearable></el-input>
        </el-form-item>

        <el-form-item label="数量" prop="num" label-width="100px">
          <el-input v-model="editInstockForm.num" autocomplete="off" clearable></el-input>
        </el-form-item>

        <el-form-item label="实时库存" prop="stock" label-width="100px">
          <el-input v-model="editInstockForm.stock" autocomplete="off" clearable></el-input>
        </el-form-item>

        <el-form-item label="流程状态" prop="inState" label-width="100px">
          <el-input v-model="editInstockForm.inState" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditInstock = false">取 消</el-button>
        <el-button type="primary" @click="editInstock()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      // 面包屑参数
      myBreadList: ['库存管理', '出库流水'],

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

      // 选择器参数
      managerList: [],
      storeList: [],
      itemList: [],

      // 新增使用的数据
      createInstockForm: {
        id: '',
        sn: '',
        storeId: '',
        storeStr: '',
        userId: '',
        userStr: '',
        itemId: '',
        itemStr: '',
        buyId: '',
        stock: '',
        inState: '',
        num: '',
        inTime: ''
      },

      editInstockForm: {
        id: '',
        sn: '',
        storeId: '',
        storeStr: '',
        userId: '',
        userStr: '',
        itemId: '',
        itemStr: '',
        buyId: '',
        stock: '',
        inState: '',
        num: '',
        inTime: ''
      },

      // 组件可见性
      dialogFormVisibleAddInstock: false,
      dialogFormVisibleEditInstock: false
    }
  },
  created () {
    // 获取出库流水列表
    this.getInstockList()
  },
  methods: {
    // 获取出库流水列表
    async getInstockList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6001/instocks',
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
        this.tableData.forEach(element => {
          element.sn = element.sn.replace('IN', 'OUT')
        })
      } else {
        console.log(msg)
      }
    },

    // 显示添加对话框
    async showAddInstockDia () {
      this.dialogFormVisibleAddInstock = true
      this.getManagerlist()
      this.getStoreList()
      this.getItemList()
    },

    // 获取出库员列表
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
        this.managerList = data.records
      } else {
        console.log(msg)
      }
    },

    // 获取仓库列表
    async getStoreList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6002/stores',
        method: 'get'
      })
      // 解构
      const { status, msg } = res.data
      console.log(status)
      console.log(msg)
      if (status === '200') {
        // 解构
        const { data } = res.data
        console.log(data)
        this.storeList = data.records
      } else {
        console.log(msg)
      }
    },

    // 获取商品列表
    async getItemList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6002/items',
        method: 'get'
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
        this.itemList = data.records
      } else {
        console.log(msg)
      }
    },

    // 添加出库流水
    async createInstock () {
      this.createInstockForm.inTime = moment(
        this.createInstockForm.inTime
      ).format('YYYY-MM-DD HH:mm:ss')
      const res = await this.$http({
        url: 'http://www.ericson.top:6001/instock',
        method: 'post',
        data: this.createInstockForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)
      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('添加出库流水成功')
        this.createInstockForm.instockName = ''
        this.createInstockForm.sn = ''
        this.createInstockForm.managerId = ''
        this.createInstockForm.addr = ''
        this.dialogFormVisibleAddInstock = false
        this.getInstockList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示编辑出库流水表单
    showEditInstockDia (instock) {
      this.getManagerlist()
      this.getStoreList()
      this.getItemList()
      this.editInstockForm.id = instock.id
      this.editInstockForm.sn = instock.sn
      this.editInstockForm.itemId = instock.itemId
      this.editInstockForm.storeId = instock.storeId
      this.editInstockForm.inTime = instock.inTime
      this.editInstockForm.userId = instock.userId
      this.editInstockForm.buyId = instock.buyId
      this.editInstockForm.num = instock.num
      this.editInstockForm.stock = instock.stock
      this.editInstockForm.inState = instock.inState
      this.dialogFormVisibleEditInstock = true
    },

    // 编辑出库流水
    async editInstock () {
      this.editInstockForm.inTime = moment(this.editInstockForm.inTime).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      const res = await this.$http({
        url: 'http://www.ericson.top:6001/instock/' + this.editInstockForm.id,
        method: 'put',
        data: this.editInstockForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('修改出库流水信息成功')
        this.editInstockForm.id = ''
        this.editInstockForm.sn = ''
        this.editInstockForm.itemId = ''
        this.editInstockForm.storeId = ''
        this.editInstockForm.inTime = ''
        this.editInstockForm.userId = ''
        this.editInstockForm.buyId = ''
        this.editInstockForm.num = ''
        this.editInstockForm.stock = ''
        this.editInstockForm.inState = ''
        this.dialogFormVisibleEditInstock = false
        this.getInstockList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示删除对话框
    showDeleteInstockBox (instockId) {
      this.$confirm('确认删除出库流水吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteInstock(instockId)
        })
        .instockch(() => {
          this.$message.info('已取消')
        })
    },

    // 删除出库流水
    async deleteInstock (id) {
      const res = await this.$http({
        url: 'http://www.ericson.top:6001/instock/' + id,
        method: 'delete'
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('删除成功')
        this.getInstockList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    /* 分页方法 */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageQuery.pageSize = val
      this.getInstockList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageQuery.pageCurrent = val
      this.getInstockList()
    }
  }
}
</script>

<style>
</style>
