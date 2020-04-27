<template>
  <el-container>
  <el-header>Home</el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {}
</script>

<style>
.el-header{
    background-color: #B3C0D1;
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    height: 100%;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }

  .el-container {
   height: 100%;
  }

</style>
