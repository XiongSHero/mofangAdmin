<template>
<div>
  <transition name="el-fade-in-linear">
    <el-card class="pass-card" v-show="showCard">
      <div slot="header" class="clearfix setting-header">
        <span>{{title}}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="hideCard">关闭</el-button>
      </div>
      <div class="pass-card-body">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="70px" class="demo-ruleForm">
          <el-form-item label="管理员" prop="user" v-if="doType === 'register'">
            <el-input type="text" v-model="ruleForm2.user" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass" v-if="doType === 'modifyPass'">
            <el-input  type="password" v-model.number="ruleForm2.newPass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="setting-pass-sub" @click="submitForm('ruleForm2')">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </transition>
  <div class="pass-mask" v-show="showCard"></div>
</div>
</template>

<script>
import util from '../../assets/js/util'
import config from '../../assets/js/config'
export default {
  name: 'RegAndPass',
  props: {
    title: {
      type: String,
      required: true
    },
    showCard: {
      type: Boolean,
      required: true
    },
    doType: {
      type: String,
      required: true
    }
  },
  data () {
    var validateUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('管理员不能为空'))
      }
      callback()
    }
    var validateNewPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('新密码不能为空'))
      }
      setTimeout(() => {
        if (value.length < 6) {
          callback(new Error('密码长度需大于6位'))
        }
        callback()
      }, 100)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm2: {
        user: '',
        pass: '',
        checkPass: '',
        newPass: ''
      },
      rules2: {
        user: [
          {validator: validateUser, trigger: 'blur'}
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        newPass: [
          {validator: validateNewPass, trigger: 'blur'}
        ]
      },
      showPassCard: false
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.doType) {
            case 'register':
              util.mf_post(config.host + '/login/register', this.ruleForm2, this, '注册')
                .then((res) => {
                  if (res.status === 0) {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    })
                  } else if (res.status === 1) {
                    this.$message({
                      type: 'success',
                      message: res.msg
                    })
                    this.$emit('hideCard', null)
                    this.$refs['ruleForm2'].resetFields()
                  }
                })
              break
            case 'modifyPass':
              this.ruleForm2.user = localStorage.getItem('username')
              util.mf_post(config.host + '/login/modifyPass', this.ruleForm2, this, '修改密码')
                .then((res) => {
                  if (res.status === 0) {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    })
                  } else if (res.status === 1) {
                    this.$message({
                      type: 'success',
                      message: res.msg
                    })
                    this.$emit('hideCard', null)
                    this.$refs['ruleForm2'].resetFields()
                    localStorage.setItem('username', '')
                    localStorage.setItem('store', '')
                    this.$router.push({path: '/'})
                  }
                })
              break
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$emit('hideCard', null)
    },
    hideCard () {
      this.$emit('hideCard', null)
    }
  }
}
</script>

<style scoped>
  .setting-header{
    text-align: center;
    font-size: 16px;
    line-height: 22px;
  }
  .pass-card{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 530px;
    height: 320px;
    -webkit-transform: translate3d(-50%, -50%, 0);
    -moz-transform: translate3d(-50%, -50%, 0);
    -ms-transform: translate3d(-50%, -50%, 0);
    -o-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    z-index: 20;
  }
  .setting-pass-sub{
    margin-left: 115px;
  }
  .pass-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    z-index: 10;
  }
</style>
