<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread :myBreadList='myBreadList'></my-bread>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      myBreadList: ['权限管理', '角色列表']
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style>
</style>
