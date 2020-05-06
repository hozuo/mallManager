<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread :myBreadList="myBreadList"></my-bread>
    <!-- 搜索 -->
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="pageQuery.name" class="inputSearch" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getSupplierList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button class="inputSearchButton" type="success" @click="showAddSupplierDia()">新增供货商</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" height="500px" style="width: 100%,">
      <el-table-column prop="supId" label="id" width="70"></el-table-column>
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="address" label="地址" width="180"></el-table-column>
      <el-table-column prop="manager" label="负责人"></el-table-column>
      <el-table-column prop="phone" label="电话" width="140"></el-table-column>
      <el-table-column prop="fax" label="传真"></el-table-column>
      <el-table-column prop="remark" label="备注" width="470"></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="180"></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑 -->
            <el-button
              @click="showEditSupplierDia(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <!-- 删除 -->
            <el-button
              @click="showDeleteSupplierBox(scope.row.supId)"
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
    <!-- 添加供货商对话框 -->
    <el-dialog title="添加供货商" :visible.sync="dialogFormVisibleAddSupplier">
      <el-form :model="createSupplierForm" :rules="supplierRules">
        <el-form-item label="供货商名称" prop="name" label-width="100px">
          <el-input v-model="createSupplierForm.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="供货商地址" prop="address" label-width="100px">
          <el-input v-model="createSupplierForm.address" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="负责人姓名" prop="manager" label-width="100px">
          <el-input v-model="createSupplierForm.manager" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" label-width="100px">
          <el-input v-model="createSupplierForm.phone" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax" label-width="100px">
          <el-input v-model="createSupplierForm.fax" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="100px">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="createSupplierForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddSupplier = false">取 消</el-button>
        <el-button type="primary" @click="createSupplier()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑供货商对话框 -->
    <el-dialog title="编辑供货商" :visible.sync="dialogFormVisibleEditSupplier">
      <el-form :model="editSupplierForm" :rules="supplierRules">
        <el-form-item label="供货商名称" prop="name" label-width="100px">
          <el-input v-model="editSupplierForm.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="供货商地址" prop="address" label-width="100px">
          <el-input v-model="editSupplierForm.address" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="负责人姓名" prop="manager" label-width="100px">
          <el-input v-model="editSupplierForm.manager" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" label-width="100px">
          <el-input v-model="editSupplierForm.phone" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax" label-width="100px">
          <el-input v-model="editSupplierForm.fax" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="100px">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="editSupplierForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditSupplier = false">取 消</el-button>
        <el-button type="primary" @click="editSupplier()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 面包屑参数
      myBreadList: ['基础信息管理', '供货商信息录入'],

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
      createSupplierForm: {
        name: '',
        address: '',
        manager: '',
        phone: '',
        fax: '',
        remark: ''
      },

      editSupplierId: '',

      editSupplierForm: {
        name: '',
        address: '',
        manager: '',
        phone: '',
        fax: '',
        remark: ''
      },

      // 添加用户限制规则
      supplierRules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'change'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入地址',
            trigger: 'change'
          }
        ]
      },

      // 组件可见性
      dialogFormVisibleAddSupplier: false,
      dialogFormVisibleEditSupplier: false
    }
  },
  created () {
    // 获取供货商列表
    this.getSupplierList()
  },
  methods: {
    // 获取供货商列表
    async getSupplierList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6002/suppliers',
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

    async showAddSupplierDia () {
      this.dialogFormVisibleAddSupplier = true
    },

    // 添加供货商
    async createSupplier () {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/supplier',
        method: 'post',
        data: this.createSupplierForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('添加供货商成功')
        this.createSupplierForm.name = ''
        this.createSupplierForm.address = ''
        this.createSupplierForm.manager = ''
        this.createSupplierForm.phone = ''
        this.createSupplierForm.fax = ''
        this.createSupplierForm.remark = ''
        this.dialogFormVisibleAddSupplier = false
        this.getSupplierList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示编辑供货商表单
    showEditSupplierDia (supplier) {
      this.dialogFormVisibleEditSupplier = true
      this.editSupplierForm.SupId = supplier.supId
      this.editSupplierForm.name = supplier.name
      this.editSupplierForm.address = supplier.address
      this.editSupplierForm.manager = supplier.manager
      this.editSupplierForm.phone = supplier.phone
      this.editSupplierForm.fax = supplier.fax
      this.editSupplierForm.remark = supplier.remark
    },

    // 编辑供货商
    async editSupplier () {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/supplier/' + this.editSupplierForm.SupId,
        method: 'put',
        data: this.editSupplierForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('修改供货商信息成功')
        this.editSupplierForm.name = ''
        this.editSupplierForm.address = ''
        this.editSupplierForm.manager = ''
        this.editSupplierForm.phone = ''
        this.editSupplierForm.fax = ''
        this.editSupplierForm.remark = ''
        this.dialogFormVisibleEditSupplier = false
        this.getSupplierList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    // 显示删除对话框
    showDeleteSupplierBox (supId) {
      this.$confirm('确认删除供货商吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteSupplier(supId)
        })
        .supplierch(() => {
          this.$message.info('已取消')
        })
    },

    // 删除供货商
    async deleteSupplier (id) {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/supplier/' + id,
        method: 'delete'
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('删除成功')
        this.getSupplierList()
      } else {
        const { msg } = res.data
        console.log(msg)
      }
    },

    /* 分页方法 */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageQuery.pageSize = val
      this.getSupplierList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageQuery.pageCurrent = val
      this.getSupplierList()
    }
  }
}
</script>

<style>
</style>
