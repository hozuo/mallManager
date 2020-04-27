<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
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
        password: ''
      }
    }
  },
  methods: {
    doLogin () {
      console.log(this.$http)
      this.$http.post('/login', this.formdata).then(res => {
        const {
          data,
          meta: { msg, status }
        } = res.data
        console.log(data)
        console.log(msg)
        console.log(status)
        if (status === 200) {
          // 登陆成功
          // 提示成功
          this.$message.success('登陆成功')
          // 跳转主页
          this.$http.push({ name: 'home' })
        } else {
          this.$message.warning('用户名或密码错误')
        }
      })
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
