<template>
  <transition name="el-fade-in-linear">
    <div class="task-ka">
      <el-card class="box-card" :body-style="{ overflowY: 'auto' }">
        <div slot="header" class="clearfix">
          <span class="task-t-title">添加客户</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="onReset">关闭</el-button>
        </div>
        <div style="height: 398px">
          <el-form ref="form" :inline="true" :model="form" label-width="70px">
            <el-form-item label="客户">
              <el-input class="tast-state-kehu" size="small" required v-model="form.client"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input class="tast-state-kehu" size="small" required v-model="form.clientphone"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input class="tast-state-kehu" size="small" type="number" v-model="form.age"></el-input>
            </el-form-item>
            <el-form-item label="关系">
              <el-input class="tast-state-kehu" size="small" v-model="form.relationship"></el-input>
            </el-form-item>
            <el-form-item label="学生">
              <el-input class="tast-state-kehu" size="small" v-model="form.child"></el-input>
            </el-form-item>
            <el-form-item label="阶段">
              <el-select v-model="form.stage" placeholder="请选择阶段" class="tast-state-kehu" size="small">
                <el-option label="小学" value="xiao"></el-option>
                <el-option label="初中" value="chu"></el-option>
                <el-option label="高中" value="gao"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科目">
              <el-select v-model="form.subject" placeholder="请选择科目" class="tast-state-kehu" size="small">
                <el-option label="语文" value="yu"></el-option>
                <el-option label="数学" value="shu"></el-option>
                <el-option label="英语" value="wai"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="家长要求" class="tast-state-require">
              <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.will"></el-input>
            </el-form-item>
            <el-form-item class="task-submit">
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button @click="onReset">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </transition>
</template>

<script>
import util from '../../assets/js/util'
import config from '../../assets/js/config'

export default {
  name: 'AddClient',
  data () {
    return {
      form: {
        client: '',
        clientphone: '',
        age: '',
        relationship: '',
        child: '',
        stage: '',
        subject: '',
        will: '',
        state: '3',
        operater: ''
      }
    }
  },
  methods: {
    /* 提交添加客户的表单 */
    onSubmit () {
      if (!this.form.client) {
        this.$message({
          type: 'warning',
          message: '客户不能为空'
        })
        return false
      }
      if (!(/^1\d{10}$/.test(this.form.clientphone))) {
        this.$message({
          type: 'warning',
          message: '客户手机号码格式不正确'
        })
        return false
      }
      this.form.tasktime = util.timeSerialize(new Date())
      this.form.operater = util.getSession('store').user.right
      this.form.state = 3
      util.mf_post(config.host + '/clientPoolPage/addClient', this.form, this, '添加用户').then(res => {
        this.$message({
          type: 'success',
          message: res
        })
        this.$emit('reloadtableData', null)
        this.onReset()
      })
    },
    /* 重置表单 */
    onReset () {
      for (let field in this.form) {
        this.form[field] = ''
      }
      this.$emit('hideAddClient', null)
    }
  }
}
</script>

<style scoped>
  .task-ka{
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    -moz-transform: translate3d(-50%, -50%, 0);
    -ms-transform: translate3d(-50%, -50%, 0);
    -o-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    z-index: 20;
  }
  .box-card{
    width: 750px;
    height: 485px;
  }
  .task-t-title{
    display: inline-block;
    width: 680px;
    text-align: center;
    height: 22px;
    line-height: 22px;
  }
  .tast-state-kehu{
    width: 140px;
  }
  .client-stage{
    margin-left: 30px;
  }
  .task-submit{
    display: block;
    text-align: center;
    margin-bottom: 0;
  }
  .task-add{
    line-height: 28px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
  }
  .task-add-icon{
    font-size: 16px;
    margin-right: 5px;
  }

</style>
