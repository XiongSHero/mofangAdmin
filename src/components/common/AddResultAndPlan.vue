<template>
  <transition name="el-fade-in-linear">
    <div class="task-ka">
      <el-card class="box-card" :body-style="{ overflowY: 'auto' }">
        <div slot="header" class="clearfix">
          <span class="task-t-title">添加结果和计划</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="onReset">关闭</el-button>
        </div>
        <div style="height: 435px">
          <el-form ref="form" :inline="true" :model="form" label-width="70px">
            <h2 class="task-add-title task-add-ma">任务结果</h2>
            <el-form-item label="客户状态">
              <el-radio-group v-model="form.state">
                <el-radio :label="0">已成交</el-radio>
                <el-radio :label="1">有意向</el-radio>
                <el-radio :label="2">已拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="任务结果" class="tast-state-require">
              <el-input type="textarea" :autosize="{ minRows: 3}" v-model="form.result"></el-input>
            </el-form-item>
            <div v-show="form.state !== 2">
              <h2  class="task-add-title ask-add-border">任务计划</h2>
              <el-form-item label="任务时间">
                <el-date-picker
                  class="record-data"
                  size="small"
                  v-model="form.datetime"
                  type="date"
                  :picker-options="pickerBeginDateBefore"
                  placeholder="选择日期">
                </el-date-picker>
                <el-time-picker
                  size="small"
                  v-model="form.date"
                  :picker-options="{
                   selectableRange: '8:30:00 - 22:30:00'
                }"
                  placeholder="选择时间">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="任务计划" class="tast-state-require">
                <el-input type="textarea" :autosize="{ minRows: 3}" v-model="form.plan"></el-input>
              </el-form-item>
            </div>
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
  name: 'AddResultAndPlan',
  props: {
    rowPhone: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      form: {
        result: '',
        plan: '',
        state: '',
        datetime: '',
        date: ''
      },
      pickerBeginDateBefore: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      }
    }
  },
  methods: {
    /* 验证表单 */
    valide (form) {
      if (form.state !== 0 && form.state !== 1 && form.state !== 2) {
        this.$message({
          type: 'warning',
          message: '请添加客户状态'
        })
        return false
      }
      if (!form.result) {
        this.$message({
          type: 'warning',
          message: '请添加任务结果'
        })
        return false
      }
      if (form.state !== 2) {
        if (!form.datetime || !form.date) {
          this.$message({
            type: 'warning',
            message: '请选择任务计划时间'
          })
          return false
        }
        if (!form.plan) {
          this.$message({
            type: 'warning',
            message: '请添加任务计划'
          })
          return false
        }
      }
    },
    /* 发送提交表单请求 */
    postForm () {
      const form = {}
      let clientphone = this.rowPhone
      let resultTime = util.timeSerialize(new Date())
      let result = '结果：' + this.form.result
      form.state = this.form.state
      form.clientphone = this.rowPhone
      if (this.form.state !== 2) {
        if (!this.form.datetime) return
        let planTime = this.formatDate(this.form.datetime, 'y-m-d') + ' ' + this.formatDate(this.form.date, 'h:m:s')
        let plan = '计划：' + this.form.plan
        form.description = [
          {clientphone, description: result, datetime: resultTime, category: 1},
          {clientphone, description: plan, datetime: planTime, category: 2}
        ]
      } else {
        form.description = [
          {clientphone, description: result, datetime: resultTime, category: 1}
        ]
      }
      util.mf_post(config.host + '/taskPage/addResultAndPlan', form, this, '添加任务结果和任务计划')
        .then(res => {
          this.$message({
            type: 'success',
            message: res
          })
          this.onReset()
          this.$emit('reloadData', null)
        })
    },
    /* 提交添加任务结果和任务计划的表单 */
    onSubmit () {
      this.valide(this.form)
      this.postForm()
    },
    formatDate (date, type) {
      if (type === 'y-m-d') {
        const y = date.getFullYear()
        const M = date.getMonth() + 1
        const d = date.getDate()
        return '' + y + '-' + util.addTwo(M) + '-' + d
      } else if (type === 'h:m:s') {
        const h = date.getHours()
        const m = date.getMinutes()
        const s = date.getSeconds()
        return '' + util.addTwo(h) + ':' + util.addTwo(m) + ':' + util.addTwo(s)
      }
    },
    /* 重置表单 */
    onReset () {
      for (let field in this.form) {
        this.form[field] = ''
      }
      this.$emit('hideAddResult', null)
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
    height: 520px;
  }
  .task-t-title{
    display: inline-block;
    width: 680px;
    text-align: center;
    height: 22px;
    line-height: 22px;
  }
  .task-add-title{
    margin-bottom: 10px;
    text-align: center;
    line-height: 28px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
  .task-add-ma{
    margin-top: -20px;
  }
  .ask-add-border{
    border-top: #333 1px dashed;
  }
  .task-submit{
    display: block;
    text-align: center;
    margin-bottom: 0;
  }

</style>
