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
            <el-link href="#">退出</el-link>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <!-- 侧栏 -->
      <el-aside width="200px">
        <el-menu @open="handleOpen" @close="handleClose">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
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
