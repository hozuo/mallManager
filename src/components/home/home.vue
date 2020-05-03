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
        <el-menu :unique-opened="true" :collapse-transition="false" :router="true">
          <!-- 导航1 -->
          <el-submenu v-for="(item1,index) in menuList" :key="index" :index="''+item1.sort">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item1.menuName}}</span>
            </template>
            <el-menu-item
              v-for="(item2,index) in item1.children"
              :key="index"
              :index="item2.url"
            >{{item2.menuName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return { menuList: [] }
  },
  methods: {
    // 退出
    doSingout () {
      // 清除tocken
      localStorage.clear()
      this.$message.success('退出成功')
      // 转到login
      this.$router.push({ name: 'login' })
    },

    // 获取左侧菜单列表
    async getMenuList () {
      const res = await this.$http({
        url: 'http://localhost:2020/menus',
        method: 'get',
        params: { type: 'menu' }
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
        this.menuList = data
      } else {
        this.$message.warning(msg)
      }
    }
  },
  mounted () {
    this.getMenuList()
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
}

.el-container {
  height: 100%;
}
</style>
