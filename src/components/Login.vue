<template>
  <div>
    <div class="login-form">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="管理员" prop="user">
          <el-input type="user" v-model="ruleForm2.user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" @keyup.enter.native="submitForm('ruleForm2')" v-model="ruleForm2.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" ref="login" @click="submitForm('ruleForm2')" :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Bg-canvas></Bg-canvas>
  </div>
</template>

<script>
/* eslint-disable */
import BgCanvas from './BgCanvas'
import config from '../assets/js/config'
export default {
  data () {
    var checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('管理员不能为空'))
      }
      callback()
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      }
      callback()
    }
    return {
      ruleForm2: {
        user: '',
        pass: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        user: [
          { validator: checkUser, trigger: 'blur' }
        ]
      },
      loginLoading: false
    }
  },
  components: {
    BgCanvas
  },
  methods: {
    submitForm (formName) {
      this.loginLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post(config.host + '/login/login', this.ruleForm2)
            .then((res) => {
              this.loginLoading = false
              const login = res.data
              if (login.status === 0) {
                this.$message.error(login.msg)
              } else if (login.status === 1) {
                localStorage.setItem('username', this.ruleForm2.user)
                this.$message({
                  type: 'success',
                  message: login.msg
                })
                let userRight = login.right
                let userdate = {user: {name: this.ruleForm2.user, right: userRight}}
                localStorage.setItem('store', JSON.stringify(userdate))
                this.$router.push('/index')
              }
            }).catch(() => {
            this.loginLoading = false
            this.$message.error('网络错误，登录失败，请联系网管或者刷新')
          })
          // this.$router.push('/index')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .login-form
    width: 500px
    position: absolute
    top: 50%
    left: 50%
    -webkit-transform: translate3d(-50%, -50%, 0)
    -moz-transform: translate3d(-50%, -50%, 0)
    -ms-transform: translate3d(-50%, -50%, 0)
    -o-transform: translate3d(-50%, -50%, 0)
    transform: translate3d(-50%, -50%, 0)
</style>
