<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread :myBreadList="myBreadList"></my-bread>
    <!-- 搜索 -->
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="pageQuery.name" class="inputSearch" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button class="inputSearchButton" type="success" @click="showAddOrderDia()">新增销售订单</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" height="500px" style="width: 100%,">
      <el-table-column prop="id" label="id" width="300" sortable></el-table-column>
      <el-table-column prop="sn" label="编号" width="210" sortable></el-table-column>
      <el-table-column prop="supplierStr" label="供应商" width="310" sortable></el-table-column>
      <el-table-column prop label="商品" width="160">
        <template slot-scope="scope">
          <el-tag @click="showOrderItemsDia(scope.row)">点击查看商品详情</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userStr" label="销售员" width="110" sortable></el-table-column>
      <el-table-column prop="storeStr" label="仓库" width="110" sortable></el-table-column>
      <el-table-column prop="state" label="流程状态" width="110" sortable></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户" width="110" sortable></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" sortable width="180"></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户" width="110" sortable></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="180"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑 -->
            <el-button
              @click="showEditOrderDia(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <!-- 删除 -->
            <el-button
              @click="showDeleteOrderBox(scope.row.id)"
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
    <!-- 添加销售订单对话框 -->
    <el-dialog title="添加销售订单" :visible.sync="dialogFormVisibleAddOrder">
      <el-form :model="createOrderForm">
        <!-- 商品 -->
        <el-form-item
          v-for="(orderItem, index) in createOrderItems"
          :key="index"
          :label="'商品' + (index + 1)"
          label-width="100px"
        >
          <el-select v-model="orderItem.itemId">
            <el-option
              v-for="(item,index) in itemList"
              :label="item.itemName"
              :value="item.itemId"
              :key="index"
            ></el-option>
          </el-select>
          <el-form-item prop="num">
            <el-input
              v-model="orderItem.num"
              autocomplete="off"
              clearable
              style="width:"
              placeholder="商品数量"
            ></el-input>
          </el-form-item>
        </el-form-item>

        <el-form-item label="仓库名" prop="storeStr" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="createOrderForm.storeId">
            <el-option
              v-for="(store,index) in storeList"
              :label="store.storeName"
              :value="store.storeId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入库员" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="createOrderForm.userId">
            <el-option
              v-for="(manager,index) in managerList"
              :label="manager.username"
              :value="manager.userId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="createOrderForm.supplierId">
            <el-option
              v-for="(sup,index) in supplierList"
              :label="sup.name"
              :value="sup.supId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrderItems()">添加商品</el-button>
        <el-button @click="dialogFormVisibleAddOrder = false">取 消</el-button>
        <el-button type="primary" @click="createOrder()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑销售订单对话框 -->
    <el-dialog title="编辑销售订单" :visible.sync="dialogFormVisibleEditOrder">
      <el-form :model="editOrderForm">
        <!-- 商品 -->
        <el-form-item
          v-for="(orderItem, index) in editOrderItems"
          :key="index"
          :label="'商品' + (index + 1)"
          label-width="100px"
        >
          <el-select v-model="orderItem.itemId">
            <el-option
              v-for="(item,index) in itemList"
              :label="item.itemName"
              :value="item.itemId"
              :key="index"
            ></el-option>
          </el-select>
          <el-form-item prop="num">
            <el-input
              v-model="orderItem.num"
              autocomplete="off"
              clearable
              style="width:"
              placeholder="商品数量"
            ></el-input>
          </el-form-item>
        </el-form-item>

        <el-form-item label="仓库名" prop="storeStr" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="editOrderForm.storeId">
            <el-option
              v-for="(store,index) in storeList"
              :label="store.storeName"
              :value="store.storeId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入库员" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="editOrderForm.userId">
            <el-option
              v-for="(manager,index) in managerList"
              :label="manager.username"
              :value="manager.userId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="editOrderForm.supplierId">
            <el-option
              v-for="(sup,index) in supplierList"
              :label="sup.name"
              :value="sup.supId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditOrder = false">取 消</el-button>
        <el-button type="primary" @click="editOrder()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 商品详情对话框 -->
    <el-dialog title="商品详情" :visible.sync="dialogFormVisibleOrderItems">
      <el-table :data="itemKeyList" style="width: 100%">
        <el-table-column prop="id" label="商品id" width="180"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="num" label="销售数量"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleOrderItems = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 面包屑参数
      myBreadList: ['订单管理', '销售订单'],

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
      supplierList: [],

      // 新增使用的数据
      createOrderForm: {
        sn: '',
        supplierId: '',
        supplierStr: '',
        userId: '',
        userStr: '',
        storeId: '',
        storeStr: '',
        state: '',
        orderItems: ''
      },

      createOrderItems: [
        {
          orderId: '',
          itemId: '',
          num: ''
        }
      ],

      editOrderForm: {
        sn: '',
        supplierId: '',
        supplierStr: '',
        userId: '',
        userStr: '',
        storeId: '',
        storeStr: '',
        state: ''
      },

      // 详情使用的数据
      itemKeyList: [{
        id: '',
        name: '',
        num: ''
      }],

      // 组件可见性
      dialogFormVisibleAddOrder: false,
      dialogFormVisibleEditOrder: false,
      dialogFormVisibleOrderItems: false
    }
  },
  created () {
    // 获取销售订单列表
    this.getOrderList()
  },
  methods: {
    // 获取销售订单列表
    async getOrderList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6003/orders',
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
          element.sn = element.sn.replace('In', 'OUT')
        })
      } else {
        console.log(msg)
      }
    },

    // 显示添加对话框
    async showAddOrderDia () {
      this.dialogFormVisibleAddOrder = true
      this.getManagerlist()
      this.getStoreList()
      this.getItemList()
      this.getSupplierList()
    },

    // 获取销售管理员(用户)列表
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

    // 获取供货商列表
    async getSupplierList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6002/suppliers',
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
        this.supplierList = data.records
      } else {
        console.log(msg)
      }
    },

    // 添加一个订单商品
    addOrderItems () {
      this.createOrderItems.push({
        orderId: '',
        itemId: '',
        num: ''
      })
    },

    // 添加销售订单
    async createOrder () {
      var jsonstr = JSON.stringify(this.createOrderItems)
      this.createOrderForm.orderItems = jsonstr
        .replace('[', '')
        .replace(']', '')
      const res = await this.$http({
        url: 'http://www.ericson.top:6003/order',
        method: 'post',
        data: this.createOrderForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)
      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('添加销售订单成功')
        this.createOrderForm.orderName = ''
        this.createOrderForm.sn = ''
        this.createOrderForm.managerId = ''
        this.createOrderForm.addr = ''
        this.dialogFormVisibleAddOrder = false
        this.getOrderList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示编辑销售订单表单
    showEditOrderDia (order) {
      this.getManagerlist()
      this.getStoreList()
      this.getItemList()
      this.getSupplierList()
      this.editOrderForm.id = order.id
      this.editOrderForm.sn = order.sn
      this.editOrderForm.supplierId = order.supplierId
      this.editOrderForm.supplierStr = order.supplierStr
      this.editOrderForm.userId = order.userId
      this.editOrderForm.userStr = order.userStr
      this.editOrderForm.storeId = order.storeId
      this.editOrderForm.storeStr = order.storeStr
      this.editOrderForm.state = order.state
      this.dialogFormVisibleEditOrder = true
    },

    // 编辑销售订单
    async editOrder () {
      const res = await this.$http({
        url: 'http://www.ericson.top:6003/order/' + this.editOrderForm.id,
        method: 'put',
        data: this.editOrderForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('修改销售订单成功')
        this.editOrderForm.sn = ''
        this.editOrderForm.supplierId = ''
        this.editOrderForm.supplierStr = ''
        this.editOrderForm.userId = ''
        this.editOrderForm.userStr = ''
        this.editOrderForm.storeId = ''
        this.editOrderForm.storeStr = ''
        this.editOrderForm.state = ''
        this.dialogFormVisibleEditOrder = false
        this.getOrderList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示删除对话框
    showDeleteOrderBox (orderId) {
      this.$confirm('确认删除销售订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteOrder(orderId)
        })
        .orderch(() => {
          this.$message.info('已取消')
        })
    },

    // 删除销售订单
    async deleteOrder (id) {
      const res = await this.$http({
        url: 'http://www.ericson.top:6003/order/' + id,
        method: 'delete'
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('删除成功')
        this.getOrderList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示商品详情对话框
    async showOrderItemsDia (order) {
      const res = await this.$http({
        url: 'http://api.ericson.top:6003/order/' + order.id + '/items',
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
        this.itemKeyList = data
      } else {
        console.log(msg)
      }
      this.dialogFormVisibleOrderItems = true
    },

    /* 分页方法 */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageQuery.pageSize = val
      this.getOrderList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageQuery.pageCurrent = val
      this.getOrderList()
    }
  }
}
</script>

<style>
</style>
