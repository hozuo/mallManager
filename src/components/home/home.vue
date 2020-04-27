<template>
  <el-container>
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
      <el-aside width="200px">Aside</el-aside>
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
  background-color: #d3dce6;
  color: #333;
  text-align: center;
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
