<template>
<!-- myBreadList添加面包屑导航的路径 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item,index) in myBreadList" :key="index">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ['my-bread-list']
}
</script>

<style>
</style>
