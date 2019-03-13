<template>
  <transition name="el-fade-in-linear">
    <div class="task-ka">
      <el-card class="box-card" :body-style="{ overflowY: 'auto' }">
        <div slot="header" class="clearfix">
          <span class="task-t-title">处理记录</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="hideRecord">关闭</el-button>
        </div>
        <div style="height: 398px">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="grid-content">
                客户：{{detailData.client}}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                年龄：{{detailData.age}}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                关系： {{detailData.relationship}}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="grid-content">
                学生：{{detailData.child}}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                阶段：{{detailData.stage}}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                科目： {{detailData.subject}}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="grid-content">
                家长要求：{{detailData.will}}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="grid-content">
                客户状态：
                <el-radio v-model="radioId" label="0" disabled >已成功</el-radio><el-radio v-model="radioId" label="1" disabled >有意向</el-radio><el-radio v-model="radioId" disabled label="2">已拒绝</el-radio>
              </div>
            </el-col>
          </el-row>
          <div style="height:auto;">
            <el-steps direction="vertical" :active="descrActive">
              <el-step v-for="item in desrcData" :key="item.datetime" :title="item.datetime" :description="item.description"></el-step>
            </el-steps>
            <p class="el-table__empty-text" v-show="desrcData.length === 0">暂无记录</p>
          </div>
        </div>
      </el-card>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Record',
  props: {
    detailData: {
      type: Object,
      required: true
    },
    desrcData: {
      type: Array
    }
  },
  computed: {
    radioId () {
      return this.detailData.state
    },
    descrActive () {
      return this.desrcData.length - 1
    }
  },
  methods: {
    hideRecord () {
      this.$emit('hiderecord', null)
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

  .grid-content {
    min-height: 36px;
    line-height: 36px;
    color: #666;
  }
  .task-radio{
    margin-left: 30px;
  }
</style>
