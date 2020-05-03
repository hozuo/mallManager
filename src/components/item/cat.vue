<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread :myBreadList="myBreadList"></my-bread>
    <!-- 搜索 -->
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="pageQuery.name" class="inputSearch" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getCatList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button
          class="inputSearchButton"
          type="success"
          @click="dialogFormVisibleAddCat = true"
        >新增商品分类</el-button>
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
      <el-table-column prop="catId" label="商品分类id" sortable="custom"></el-table-column>
      <el-table-column prop="catName" label="商品分类名" sortable="custom"></el-table-column>
      <el-table-column prop="remark" label="备注" sortable="custom"></el-table-column>
      <el-table-column prop="updateUserStr" label="修改用户" sortable="custom"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" sortable="custom" width="180"></el-table-column>
      <el-table-column prop="createUserStr" label="创建用户" sortable="custom"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑 -->
            <el-button
              @click="showEditCatDia(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <!-- 删除 -->
            <el-button
              @click="showDeleteCatBox(scope.row.catId)"
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
    <!-- 添加商品分类对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisibleAddCat">
      <el-form :model="catFormCreate" :rules="catRules">
        <el-form-item label="分类名称" prop="catName" label-width="100px">
          <el-input v-model="catFormCreate.catName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类描述" prop="remark" label-width="100px">
          <el-input v-model="catFormCreate.remark" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAddCat = false">取 消</el-button>
        <el-button type="primary" @click="createCat()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑商品分类对话框 -->
    <el-dialog title="编辑商品分类" :visible.sync="dialogFormVisibleEditCat">
      <el-form :model="catForm" :rules="catRules">
        <el-form-item label="分类名称" prop="catName" label-width="100px">
          <el-input v-model="catForm.catName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类描述" prop="remark" label-width="100px">
          <el-input v-model="catForm.remark" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditCat = false">取 消</el-button>
        <el-button type="primary" @click="editCat()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 面包屑参数
      myBreadList: ['商品管理', '商品分类'],

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

      /* 当前编辑的商品分类表单(多用途临时数据容器) */
      catForm: {
        catId: null,
        catName: null,
        remark: null
      },

      // 新增使用的数据
      catFormCreate: {
        catId: null,
        catName: null,
        remark: null
      },

      // 添加用户限制规则
      catRules: {
        catName: [
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
      dialogFormVisibleAddCat: false,
      dialogFormVisibleEditCat: false
    }
  },
  created () {
    // 获取商品分类列表
    this.getCatList()
  },
  methods: {
    // 获取商品分类列表
    async getCatList () {
      const res = await this.$http({
        url: 'http://api.ericson.top:6002/cats',
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

        // this.$message.warning(msg)
      }
    },

    // 添加商品分类
    async createCat () {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/cat',
        method: 'post',
        data: this.catFormCreate
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('添加商品分类成功')
        this.dialogFormVisibleAddCat = false
        this.getCatList()
      } else {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    },

    // 显示编辑商品分类表单
    showEditCatDia (cat) {
      this.dialogFormVisibleEditCat = true
      this.catForm.catId = cat.catId
      this.catForm.catName = cat.catName
      this.catForm.remark = cat.remark
    },

    // 编辑商品分类
    async editCat () {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/cat/' + this.catForm.catId,
        method: 'put',
        data: this.catForm
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('修改商品分类信息成功')
        this.catForm.catName = ''
        this.catForm.remark = ''
        this.dialogFormVisibleEditCat = false
        this.getCatList()
      } else {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    },

    // 显示删除对话框
    showDeleteCatBox (catId) {
      this.$confirm('确认删除商品分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteCat(catId)
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },

    // 删除商品分类
    async deleteCat (id) {
      const res = await this.$http({
        url: 'http://www.ericson.top:6002/cat/' + id,
        method: 'delete'
      })
      console.log(res)
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        this.$message.success('删除成功')
        this.getCatList()
      } else {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    },

    /* 分页方法 */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageQuery.pageSize = val
      this.getCatList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageQuery.pageCurrent = val
      this.getCatList()
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
        this.pageQuery.orderBy = 'catId'
      }
      this.getCatList()
    }

  }
}
</script>

<style>
</style>
