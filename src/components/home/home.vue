<template>
  <el-container>
    <!-- 顶栏 -->
    <el-header>
      <el-row>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <div class="demo-image">
              <div class="block">
                <el-image
                  style="width: 100px; height: 61px"
                  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587989757494&di=9276b7ed8647ac489620c30445200c4f&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180126%2F8c4222aa6f0340aa82494a28db120ea9.jpeg"
                  fit="contain"
                ></el-image>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="13">
          <h3>emall后台管理系统</h3>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <el-link @click.prevent="doSingout()">退出</el-link>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <!-- 侧栏 -->
      <el-aside width="200px">
        <el-menu @open="handleOpen" @close="handleClose" :unique-opened="true">
          <!-- 导航1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">用户列表</el-menu-item>
          </el-submenu>
          <!-- 导航2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">角色列表</el-menu-item>
            <el-menu-item index="2-2">商品列表</el-menu-item>
          </el-submenu>
          <!-- 导航3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">商品列表</el-menu-item>
            <el-menu-item index="3-2">分类参数</el-menu-item>
            <el-menu-item index="3-2">商品分类</el-menu-item>
          </el-submenu>
          <!-- 导航4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="2-1">订单列表</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
          <!-- 导航5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    doSingout () {
      // 清除tocken
      localStorage.clear()
      this.$message.success('退出成功')
      // 转到login
      this.$router.push({ name: 'login' })
    }
  },
  beforeCreate () {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$message('用户未登录')
      this.$router.push({ name: 'login' })
    }
    // TODO判断token是否合法 暂时全部合法
    // this.$http.get('#',token)
  }
}
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 22px;
}

.el-aside {
  color: #333;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

.el-container {
  height: 100%;
}
</style>
