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
        isRememberMe: ''
      }
    }
  },
  methods: {
    async doLogin () {
      console.log(this.$http)
      // 发送登录请求(异步操作封装成同步代码)
      // const res = await this.$http.post('/login', this.formdata)
      var params = new URLSearchParams()
      params.append('username', this.formdata.username)
      params.append('password', this.formdata.password)
      // const res = await this.$http.post(
      //   'http://api.ericson.top:2020/user/login',
      //   params
      // )
      const res = await this.$http.post(
        'http://api.ericson.top:2020/user/login',
        params
      )
      console.log(res)

      // 解构
      const { code } = res.data
      console.log(code)

      // 判断返回正确结果
      if (code === '200') {
        // 解构
        const { data, message } = res.data
        console.log(data)
        console.log(message)

        // 提示成功
        this.$message.success('登陆成功')
        // 存储token
        localStorage.setItem('token', data)

        // 跳转主页
        this.$router.push({ name: 'home' })
      } else {
        this.$message.warning('用户名或密码错误')
      }
    }
  },
  mounted () {
    document.domain = 'ericson.top'
    window.domain = 'a.com'
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
