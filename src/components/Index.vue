<template>
  <div class="index-wrap">
   <!--<h2 class="i-title">魔方教育<span class="i-welcome">欢迎您的登录</span>!</h2>-->
    <!-- 统计最近的任务 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <div class="t-task clearfix">
            <div class="t-img-wrap blue fl">
              <span class="icon iconfont icon-jinri"></span>
            </div>
            <div class="t-task-cont fl">
              <h3>今日任务</h3>
              <p>{{todayTask}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <div class="t-task clearfix">
            <div class="t-img-wrap green fl">
              <span class="icon iconfont icon-benzhou"></span>
            </div>
            <div class="t-task-cont fl">
              <h3>本周已处理</h3>
              <p>{{weekTask}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <div class="t-task clearfix">
            <div class="t-img-wrap yellow fl">
              <span class="icon iconfont icon-shangzhou"></span>
            </div>
            <div class="t-task-cont fl">
              <h3>上周已处理</h3>
              <p>{{lastWeekTask}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <div class="t-task clearfix">
            <div class="t-img-wrap purple fl">
              <span class="icon iconfont icon-benyue"></span>
            </div>
            <div class="t-task-cont fl">
              <h3>本月已处理</h3>
              <p>{{monthTask}}</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 最近10天联系客户数量和客户状态 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="grid-content1">
          <div class="client-num-wrap">
            <h2 class="recent-client">最近10天联系客户数</h2>
            <div class="client-num-echart" ref="clientnum"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content1">
          <div class="client-num-wrap">
            <h2 class="recent-client">客户状态</h2>
            <div class="client-state" ref="clientstate"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content2">
          <div class="client-table-header clearfix">
            <h2 class="client-table-title  fl">最近联系客户</h2><span class="icon iconfont icon-shuaxin fr" @click="clientRefresh(pageIndex)"></span>
          </div>
          <el-table
            v-loading="clientLoading"
            :data="clientData"
            height="220"
            style="width: 100%">
            <el-table-column
              prop="client"
              label="客户名称"
              width="220">
            </el-table-column>
            <el-table-column
              prop="clientphone"
              label="电话"
              width="220">
            </el-table-column>
            <el-table-column
              prop="detail"
              label="详情">
              <template slot-scope="scope">
                <span class="el-icon-edit-outline task-t-jilu" @click="showDetailCard(scope.row)"></span>
              </template>
            </el-table-column>
          </el-table>
          <div class="clearfix">
            <el-pagination
              class="fr client-page"
              background
              layout="prev, pager, next"
              @current-change="curPageChange"
              :page-size="5"
              :total="totalPage">
            </el-pagination>
            <div class="client-showp fr" v-show="totalPage">每页显示 5 条(共{{totalPage}}条)</div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content2">
          <div class="grid-content2">
            <div class="client-table-header clearfix">
              <h2 class="client-table-title  fl">今日待处理任务</h2><span class="icon iconfont icon-shuaxin fr" @click="getTodayData(pageTaskIndex)"></span>
            </div>
            <el-table
              v-loading="taskLoading"
              :data="taskData"
              height="220"
              style="width: 100%">
              <el-table-column
                prop="client"
                label="客户名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="phone"
                label="电话"
                width="180">
              </el-table-column>
              <el-table-column
                prop="description"
                label="内容">
              </el-table-column>
            </el-table>
            <div class="clearfix" v-show="totalPageTask">
              <el-pagination
                class="fr client-page"
                background
                layout="prev, pager, next"
                @current-change="curPageChangeTask"
                :page-size="5"
                :total="totalPageTask">
              </el-pagination>
              <div class="client-showp fr">每页显示 5 条共{{totalPageTask}}条</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <Record :detailData="clientDetail" :desrcData="clientDescr" v-show="showDtailCard" @hiderecord="hideDetailCard"></Record>
    <div class="task-mask" v-show="showDtailCard" @click="hideDetailCard"></div>
    <!--<div class="task-mask" v-show="" @click=""></div>-->
  </div>
</template>

<script>
/* eslint-disable */
  import config from '../assets/js/config'
  import util from '../assets/js/util'
  import Record from './common/Record'

  export default {
  name: 'Index',
  components: {
    Record
  },
  data () {
    return {
      todayTask: '',
      weekTask: '',
      lastWeekTask: '',
      monthTask: '',
      showDtailCard: false,
      clientDetail: {},
      clientDescr: [],
      totalPage: 0,
      totalPageTask: 0,
      pageIndex: 1, /* 用于记录分页的index */
      pageTaskIndex: 1,
      option: {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            /* 柱状图x轴的数据 */
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '客户数'
          }
        ],
        series: [
          {
            name: '客户数',
            type: 'bar',
            barWidth: '40%',
            /* 折线图y轴数据 */
            data: []
          }
        ]
      },
      optionState: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          x: 'left',
          bottom: '10px',
          data: ['已成交', '有意向', '已拒绝']
        },
        grid: {
          left: '5%', // 与容器左侧的距离
          right: '5%', // 与容器右侧的距离
          top: '5%',
          bottom: '5%'
        },
        series: [
          {
            name: '客户意愿',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            /* 饼状图数据 */
            data: []
          }
        ]
      },
      clientData: [],
      taskData: [],
      clientLoading: false,
      taskLoading: false,
      userRight: ''
    }
  },
  created () {
    /* http获取数据 */
    this.getIndexNum()
    this.getTenNum().then(() => {
      this.initEchart('clientnum', this.option)
    })
    this.getTenState().then(() => {
      this.initEchart('clientstate', this.optionState)
    })
    this.getTenData(1)
    this.getTodayData(1)
  },
  methods: {
    /* 初始化Echarts */
    initEchart (el, option) {
      return new Promise((resolve) => {
        const clientNum = this.$refs[el]
        const myChart = echarts.init(clientNum)
        myChart.setOption(option)
        window.addEventListener('resize', () => {
          myChart.resize()
        })
        resolve(myChart)
      })
    },
    /* 分页触发 */
    curPageChange (index) {
      this.getTenData(index)
      this.pageIndex = index
    },
    curPageChangeTask (index) {
      this.pageTaskIndex = index
      this. getTodayData (index)
    },
    /* 最近联系客户的刷新 */
    clientRefresh (index) {
      this.getTenData (index)
    },
    /* 获取首页的任务数量 */
    getIndexNum () {
      /* 获取权限 */
      util.mf_post(config.host + '/indexPage/getIndexNum', { right: util.getSession('store').user.right }, this, '获取首页任务数量数据').then((res) => {
        this.todayTask = res[0]
        this.weekTask = res[1]
        this.lastWeekTask = res[2]
        this.monthTask = res[3]
      })
    },
    /* 获取最近10天每天的客户数量 */
    getTenNum () {
      return new Promise((resolve) => {
        util.mf_post(config.host + '/indexPage/getTenNum', { right: util.getSession('store').user.right }, this, '获取10天客户数量数据').then((res) => {
          this.option.series[0].data = res.num
          this.option.xAxis[0].data = res.time
          resolve()
        })
      })
    },
    /* 获取最近10天不同状态的客户数量 */
    getTenState () {
      return new Promise((resolve) => {
        util.mf_post(config.host + '/indexPage/getTenState', { right: util.getSession('store').user.right }, this, '获取客户状态数据').then((res) => {
          this.optionState.series[0].data = res
          resolve()
        })
      })
    },
    /* 获取最近10天的客户 */
    getTenData (page) {
      return new Promise((resolve) => {
        this.clientLoading = true
        util.mf_post(config.host + '/indexPage/getTenClient', {page: page, right: util.getSession('store').user.right}, this, '获取10天的客户表格数据').then((res) => {
          this.clientData = res.client
          this.totalPage = res.total
          this.clientLoading = false
          resolve()
        })
      })
    },
    /* 获取今日任务 */
    getTodayData (page) {
      return new Promise((resolve) => {
        this.taskLoading = true
        util.mf_post(config.host + '/indexPage/getTodayData', {page: page, right: util.getSession('store').user.right}, this, '获取今日任务数据').then((res) => {
          this.taskData = res.todayData
          this.totalPageTask = res.totalPage
          this.taskLoading = false
          resolve()
        })
      })
    },
    showDetailCard (row) {
      /* 获取最近10天的客户详情 */
      util.mf_post(config.host + '/indexPage/getTenDetail', {id: row.clientphone, right:util.getSession('store').user.right}, this, '获取客户详情数据').then((res) => {
        this.clientDescr = res.descr
        this.clientDetail = res.detail
      })
      this.showDtailCard = true
    },
    hideDetailCard () {
      this.showDtailCard = false
    }
  }
}
</script>

<style scoped>
  @import '../assets/css/iconfont.css';
  .i-title{
    font-size: 14px;
    margin-bottom: 20px;
  }
  .i-welcome{
    color: #63a7ef;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
     margin-bottom: 0;
   }
  .grid-content{
    background: #fff;
    height: 100px;
  }
  .grid-content1{
    height: 380px;
    width: 100%;
    background: #fff;
  }
  .grid-content2{
    height: 320px;
    width: 100%;
    background: #fff;
  }
  .t-task{
    padding: 20px;
  }
  .t-img-wrap{
    width: 59px;
    height: 59px;
    border-radius: 50%;
    margin-right: 30px;
    text-align: center;
    line-height: 59px;
  }
  .t-img-wrap .iconfont{
    color: #fff;
    font-size: 30px;
  }
  .blue{
    background: #108cee;
  }
  .green{
    background: #64b524;
  }
  .yellow{
    background: #f38900;
  }
  .purple{
    background: #714ca2;
  }
  .t-img-wrap img{
    width: 100px;
  }
  .t-task-cont h3{
    height: 20px;
    line-height: 20px;
    font-size: 14px;
  }
  .t-task-cont p{
    height: 40px;
    line-height: 40px;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
  }
  .task-t-jilu{
    font-size: 18px;
    color: #409EFF;
    cursor: pointer ;
  }
  .client-num-wrap{
    padding: 18px 24px;
  }
  .recent-client{
    font-size: 16px;
  }
  .client-num-echart, .client-state{
    height: 324px;
  }
  .client-table-header{
    padding: 14px 30px 14px;
  }
  .client-table-header .iconfont{
    cursor: pointer;
  }
  .client-table-title{
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
  }
  .el-table th, .el-table tr{
    padding-left: 20px;
  }
  .client-page{
    padding-top: 10px;
  }
  .client-showp{
    height: 50px;
    line-height: 50px;
    color: #108cee;
    font-size: 12px;
  }
  .task-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    z-index: 10;
  }
</style>
