<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-button @click="doLogin()" class="login-button" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      formdata: {
        username: '',
        password: '',
        isRememberMe: 'false'
      }
    }
  },
  methods: {
    // 登录
    async doLogin () {
      const res = await this.$http({
        url: 'http://api.ericson.top:2020/user/login',
        method: 'post',
        data: this.formdata
      })

      console.log(res.data)

      // 解构
      const { status } = res.data
      console.log(status)

      // 判断返回正确结果
      if (status === '200') {
        // 解构
        const { data, msg } = res.data
        console.log(data)
        console.log(msg)
        // 提示成功
        this.$message.success('登陆成功')
        // 存储token
        localStorage.setItem('token', data)
        // 跳转主页
        this.$router.push({ name: 'home' })
      } else {
        const { msg } = res.data
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  padding-top: 12px;
  border-radius: 5px;
}
.login-wrap .login-form .login-button {
  width: 100%;
}
</style>
