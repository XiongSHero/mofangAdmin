<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="setting-header">
        基本信息
      </div>
      <div class="setting-body">
        <h2 class="setting-title">基本信息</h2>
        <el-row>
          <div class="setting-key fl">
            账户ID:
          </div>
          <div class="setting-value fl">
            1521515464
          </div>
        </el-row>
        <el-row>
          <div class="setting-key fl">
            管理员:
          </div>
          <div class="setting-value fl">
            <el-input
              v-model="name"
              size="small"
              :disabled="true">
            </el-input>
          </div>
        </el-row>
        <el-row>
          <div class="setting-key fl">
            手机号:
          </div>
          <div class="setting-value fl">
            <el-input
              type="number"
              size="small"
              v-model="phone"
              :disabled="true">
            </el-input>
          </div>
        </el-row>
        <el-row>
          <div class="setting-key fl">
            密码:
          </div>
          <div class="setting-value fl">
            <el-input
              size="small"
              v-model="pass"
              type="password"
              :disabled="true">
            </el-input>
          </div>
          <div class="setting-value fl">
            <el-button size="small" type="primary" @click="showPass">修改密码</el-button>
          </div>
        </el-row>
      </div>
    </el-card>
    <RegAndPass :title="passTittle" :show-card="showPassCard" :do-type="toDo" @hideCard="hidePass"></RegAndPass>
  </div>
</template>

<script>
import RegAndPass from './common/RegAndPass'
export default {
  name: 'Setting',
  data () {
    return {
      name: '342343',
      phone: 143242342332,
      pass: 'cxzcxzc',
      showPassCard: false,
      passTittle: '修改密码',
      toDo: 'modifyPass'
    }
  },
  components: {
    RegAndPass
  },
  mounted () {
    this.name = localStorage.getItem('username')
  },
  methods: {
    showPass () {
      this.showPassCard = true
    },
    hidePass () {
      this.showPassCard = false
    }
  }
}
</script>

<style scoped>
  .setting-title{
    height: 28px;
    line-height: 28px;
    text-indent: 12px;
    font-size: 16px;
    border-left: 6px solid #108cee;
  }
  .setting-key, .setting-value{
    height: 30px;
    line-height: 30px;
    padding: 18px 20px 0;
    width: 100px;
  }
  .setting-value{
    width: 210px;
  }
</style>
