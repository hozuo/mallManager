<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread :myBreadList="myBreadList"></my-bread>
    <!-- 搜索 -->
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="pageQuery.name" class="inputSearch" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getItemList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button class="inputSearchButton" type="success" @click="showAddItemDia()">新增商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      height="500px"
      style="width: 100%,"
      @sort-change="sort"
    >
      <el-table-column prop="itemId" label="商品id" width="130" sortable="custom"></el-table-column>
      <el-table-column prop="itemName" label="商品名" width="130" sortable="custom"></el-table-column>
      <el-table-column prop="sn" label="编号" width="130" sortable="custom"></el-table-column>
      <el-table-column prop="catStr" label="分类" sortable="custom"></el-table-column>
      <el-table-column prop="buyPrice" label="采购价" width="100" sortable="custom">
         <template slot-scope="scope">{{scope.row.buyPrice|money}}</template>
      </el-table-column>
      <el-table-column prop="salePrice" label="销售价" width="100" sortable="custom">
         <template slot-scope="scope">{{scope.row.salePrice|money}}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="400" sortable="custom"></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户" width="100" sortable="custom"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="180" sortable="custom"></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户" width="100" sortable="custom"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑 -->
            <el-button
              @click="showEditItemDia(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <!-- 删除 -->
            <el-button
              @click="showDeleteItemBox(scope.row.itemId)"
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
    <!-- 添加商品对话框 -->
    <el-dialog title="添加商品" :visible.sync="dialogFormVisibleAddItem">
      <el-form :model="createItemForm" :rules="itemRules">
        <el-form-item label="商品名称" prop="itemName" label-width="100px">
          <el-input v-model="createItemForm.itemName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="sn" label-width="100px">
          <el-input v-model="createItemForm.sn" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="catStr" label-width="100px">
          <el-input v-model="createItemForm.catStr" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="采购价" prop="buyPrice" label-width="100px">
          <el-input v-model="createItemForm.buyPrice" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售价" prop="salePrice" label-width="100px">
          <el-input v-model="createItemForm.salePrice" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="100px">
          <el-input v-model="createItemForm.remark" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="createItemForm.catId">
            <el-option
              v-for="(cat,index) in catlist"
              :label="cat.catName"
              :value="cat.catId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddItem = false">取 消</el-button>
        <el-button type="primary" @click="createItem()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisibleEditItem">
      <el-form :model="editItemForm" :rules="itemRules">
        <el-form-item label="商品名称" prop="itemName" label-width="100px">
          <el-input v-model="editItemForm.itemName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="sn" label-width="100px">
          <el-input v-model="editItemForm.sn" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="采购价" prop="buyPrice" label-width="100px">
          <el-input v-model="editItemForm.buyPrice" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售价" prop="salePrice" label-width="100px">
          <el-input v-model="editItemForm.salePrice" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="100px">
          <el-input v-model="editItemForm.remark" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类" label-width="100px">
          <!-- 当select的绑定值与value相同,默认显示对应label -->
          <el-select v-model="editItemForm.catId">
            <el-option
              v-for="(cat,index) in catlist"
              :label="cat.catName"
              :value="cat.catId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditItem = false">取 消</el-button>
        <el-button type="primary" @click="editItem()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 面包屑参数
      myBreadList: ['基础信息管理', '商品列表'],

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

      catlist: [],

      // 新增使用的数据
      createItemForm: {
        itemName: '',
        sn: '',
        catId: '',
        catStr: '',
        buyPrice: '',
        salePrice: '',
        remark: ''
      },

      editItemId: '',

      editItemForm: {
        itemId: '',
        itemName: '',
        sn: '',
        catId: '',
        catStr: '',
        buyPrice: '',
        salePrice: '',
        remark: ''
      },

      // 添加用户限制规则
      itemRules: {
        itemName: [
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
      dialogFormVisibleAddItem: false,
      dialogFormVisibleEditItem: false
    }
  },
  created () {
    // 获取商品列表
    this.getItemList()
  },
  methods: {
    // 获取商品列表
    async getItemList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6002/items',
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
      }
    },

    async showAddItemDia () {
      this.dialogFormVisibleAddItem = true
      this.getCatlist()
    },

    async getCatlist () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6002/cats',
        method: 'get'
      })
      // 解构
      const { status, msg } = res.data
      // 判断返回正确结果
      if (status === '200') {
        // 解构
        const { data } = res.data
        console.log(data)
        this.catlist = data.records
      } else {
        console.log(msg)
      }
    },

    // 添加商品
    async createItem () {
      this.createItemForm.buyPrice *= 100
      this.createItemForm.salePrice *= 100
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/item',
        method: 'post',
        data: this.createItemForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('添加商品成功')
        this.createItemForm.itemName = ''
        this.createItemForm.sn = ''
        this.createItemForm.catId = ''
        this.createItemForm.addr = ''
        this.dialogFormVisibleAddItem = false
        this.getItemList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示编辑商品表单
    showEditItemDia (item) {
      this.dialogFormVisibleEditItem = true
      this.getCatlist()
      this.editItemId = item.itemId
      this.editItemForm.itemName = item.itemName
      this.editItemForm.sn = item.sn
      this.editItemForm.catId = item.catId
      this.editItemForm.catStr = item.catStr
      this.editItemForm.buyPrice = item.buyPrice / 100
      this.editItemForm.salePrice = item.salePrice / 100
      this.editItemForm.remark = item.remark
    },

    // 编辑商品
    async editItem () {
      this.dialogFormVisibleEditItem = false
      this.editItemForm.buyPrice *= 100
      this.editItemForm.salePrice *= 100
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/item/' + this.editItemId,
        method: 'put',
        data: this.editItemForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('修改商品信息成功')
        this.editItemId = ''
        this.editItemForm.itemName = ''
        this.editItemForm.sn = ''
        this.editItemForm.catId = ''
        this.editItemForm.catStr = ''
        this.editItemForm.buyPrice = ''
        this.editItemForm.salePrice = ''
        this.editItemForm.remark = ''
        this.getItemList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示删除对话框
    showDeleteItemBox (itemId) {
      this.$confirm('确认删除商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteItem(itemId)
        })
        .itemch(() => {
          this.$message.info('已取消')
        })
    },

    // 删除商品
    async deleteItem (id) {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/item/' + id,
        method: 'delete'
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('删除成功')
        this.getItemList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    /* 分页方法 */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageQuery.pageSize = val
      this.getItemList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageQuery.pageCurrent = val
      this.getItemList()
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
        this.pageQuery.orderBy = 'itemId'
      }
      this.getItemList()
    }
  }
}
</script>

<style>
</style>
