<template>
  <transition name="el-fade-in-linear">
    <div class="task-ka">
      <el-card class="box-card" :body-style="{ overflowY: 'auto' }">
        <div slot="header" class="clearfix">
          <span class="task-t-title">编辑客户信息</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="hideEdit">关闭</el-button>
        </div>
        <div style="height: 398px">
          <el-form ref="form" :inline="true" :model="form" label-width="70px">
            <el-form-item label="客户">
              <el-input class="tast-state-kehu" size="small" v-model="form.client"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input class="tast-state-kehu" size="small" v-model="form.age"></el-input>
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
            <el-form-item label="客户状态">
              <el-radio-group v-model="form.state">
                <el-radio :label="0">已成交</el-radio>
                <el-radio :label="1">有意向</el-radio>
                <el-radio :label="2">已拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="注释" class="tast-state-require">
              <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.will"></el-input>
            </el-form-item>
            <el-form-item class="task-submit">
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button @click="hideEdit">取消</el-button>
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
  name: 'EditClient',
  props: {
    detailData0: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      form: {
        client: '',
        age: '',
        relationship: '',
        child: '',
        stage: '',
        subject: '',
        will: '',
        state: ''
      }
    }
  },
  watch: {
    detailData0: {
      handler (val, oldval) {
        if (val.state) {
          val.state = Number(val.state)
        }
        this.form.id = val.id
        this.form.client = val.client
        this.form.tasktime = val.tasktime
        this.form.age = val.age
        this.form.relationship = val.relationship
        this.form.child = val.child
        switch (val.stage) {
          case '小学':
            this.form.stage = 'xiao'
            break
          case '初中':
            this.form.stage = 'chu'
            break
          case '高中':
            this.form.stage = 'gao'
            break
        }
        switch (val.subject) {
          case '语文':
            this.form.subject = 'yu'
            break
          case '数学':
            this.form.subject = 'shu'
            break
          case '英语':
            this.form.subject = 'wai'
            break
        }
        this.form.will = val.will
        this.form.state = val.state
        this.form.clientphone = val.clientphone
      },
      immediate: true, // 关键
      deep: true
    }
  },
  methods: {
    onSubmit () {
      this.editClient()
    },
    /* 校验 */
    validate (data) {
      if (!data.client) {
        this.$message({
          type: 'warning',
          message: '客户不能为空'
        })
        return false
      }
      if (!data.client) {
        this.$message({
          type: 'warning',
          message: '客户不能为空'
        })
        return false
      }
      if (!(/^1\d{10}$/.test(data.clientphone))) {
        this.$message({
          type: 'warning',
          message: '客户手机号码格式不正确'
        })
        return false
      }
    },
    /* 提交客户的更改 */
    editClient () {
      let data = {}
      data.client = this.form.client
      data.tasktime = this.form.tasktime
      data.id = this.form.id
      data.age = this.form.age
      data.relationship = this.form.relationship
      data.child = this.form.child
      data.stage = this.form.stage
      data.subject = this.form.subject
      data.will = this.form.will
      data.state = this.form.state
      data.clientphone = this.form.clientphone
      data.right = util.getSession('store').user.right
      this.validate(data)
      util.mf_post(config.host + '/clientPoolPage/editClient', data, this, '提交客户编辑')
        .then(res => {
          this.$message({
            type: 'success',
            message: res
          })
          this.$emit('reloadclient', null)
        })
      this.hideEdit()
    },
    hideEdit () {
      for (let key in this.form) {
        this.form[ key ] = ''
      }
      this.$emit('hideedit', null)
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
  .task-submit{
    display: block;
    text-align: center;
    margin-bottom: 0;
  }
</style>
