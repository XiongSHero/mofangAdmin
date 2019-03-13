<template>
  <div class="renwu-wrapper">
    <div class="renwu-wrap">
      <el-row class="task-tag-row">
        <el-tag class="active" @click="getAllTask">全部</el-tag>
        <el-tag @click="getTodayTask">今日</el-tag>
      </el-row>
      <el-table
        :data="taskData"
        :loading="taskLoading"
        height="620"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="client"
          label="客户名称">
        </el-table-column>
        <el-table-column
          prop="description"
          label="任务计划">
        </el-table-column>
        <el-table-column
          prop="datetime"
          label="任务执行时间">
        </el-table-column>
        <el-table-column
          prop="record"
          label="处理记录">
          <template slot-scope="scope">
            <span class="el-icon-edit-outline task-t-jilu" @click="showRecord(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="添加任务结果和任务计划">
          <template slot-scope="scope">
            <span class="el-icon-tickets task-t-jilu" @click="showResult(scope.row)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="clearfix">
      <el-pagination
        class="fr client-page"
        background
        v-if="reloadPage"
        layout="prev, pager, next"
        @current-change="curPageChange"
        :page-size="10"
        :total="totalPage">
      </el-pagination>
      <div class="client-showp fr">每页显示 10 页(共{{totalPage}}条)</div>
    </div>
    <Record :detailData="clientDetail" :desrcData="clientDescr" v-show="showRecordCard" @hiderecord="hideRecord"></Record>
    <AddResultAndPlan :rowPhone="rowPhone" v-show="showResultCard" @hideAddResult="hideResult" @reloadData="getTask(dateType, indexPage)"></AddResultAndPlan>
    <div class="task-mask" v-show="showRecordCard" @click="hideRecord"></div>
    <div class="task-mask" v-show="showResultCard" @click="hideResult"></div>
  </div>
</template>

<script>
import Record from './common/Record'
import AddResultAndPlan from './common/AddResultAndPlan'
import util from '../assets/js/util'
import config from '../assets/js/config'
export default {
  name: 'Task',
  components: {
    Record,
    AddResultAndPlan
  },
  data () {
    return {
      showRecordCard: false,
      showResultCard: false,
      taskData: [], /* 表格数据 */
      indexPage: 1, /* 分页当前页码 */
      totalPage: '', /* 分页总页码 */
      taskLoading: false, /* 表格loading */
      dateType: '', /* 时间类型（所有， 今日） */
      reloadPage: true, /* 刷新分页 */
      clientDetail: {}, /* 客户详情 */
      clientDescr: [], /* 处理记录 */
      rowPhone: ''
    }
  },
  created () {
    this.indexPage = 1
    this.dateType = 'all'
    this.getTask(this.dateType, this.indexPage)
  },
  mounted () {
    const tags = document.querySelectorAll('.el-tag')
    for (let i = 0; i < tags.length; i++) {
      let tag = tags[i]
      tag.addEventListener('click', () => {
        for (let i = 0; i < tags.length; i++) {
          let tag = tags[i]
          tag.classList.remove('active')
        }
        tag.classList.add('active')
      })
    }
  },
  methods: {
    /* 获取任务 */
    getTask (date, page) {
      this.taskLoading = false
      let right = util.getSession('store').user.right
      util.mf_post(config.host + '/taskPage/getAllTask', {right, date, page}, this, '获取' + date + '日常任务')
        .then(res => {
          this.taskLoading = true
          this.taskData = res.data
          this.totalPage = res.num
        })
    },
    /* 根据日期获取数据（全部， 今天的） */
    getAllTask () {
      this.indexPage = 1
      this.dateType = 'all'
      this.getTask(this.dateType, this.indexPage)
      this.reloadElement('reloadPage')
    },
    getTodayTask () {
      this.indexPage = 1
      this.dateType = 'today'
      this.getTask(this.dateType, this.indexPage)
      this.reloadElement('reloadPage')
    },
    /* 分页获取数据 */
    curPageChange (index) {
      this.indexPage = index
      this.getTask(this.dateType, this.indexPage)
    },
    /* 刷新操作 */
    reloadElement (el) {
      this[el] = false
      this.$nextTick(() => {
        this[el] = true
      })
    },
    getTaskDetail (row) {
      let data = {}
      data.right = this.right
      data.clientphone = row.clientphone
      util.mf_post(config.host + '/clientPoolPage/getClientDetail', data, this, '获取' + row.client + '详细数据')
        .then(res => {
          this.clientDetail = res.detail
          this.clientDescr = res.descr
        })
    },
    showRecord (row) {
      this.getTaskDetail(row)
      this.showRecordCard = true
    },
    hideRecord () {
      this.showRecordCard = false
    },
    showResult (row) {
      this.showResultCard = true
      this.rowPhone = row.clientphone
    },
    hideResult () {
      this.showResultCard = false
    }
  }
}
</script>

<style scoped>
.renwu-wrap{
  height: 705px;
  background: #fff;
  overflow: hidden;
}
.task-tag-row{
  font-size: 0;
  padding: 18px;
  margin-bottom: -18px;
}

.el-row .el-tag{
  margin-right: 20px;
  padding: 0 25px;
  margin-bottom: 10px;
  cursor: pointer;
}
.active{
  background: #409EFF;
  color: #fff
}
.task-t-jilu{
  font-size: 24px;
  color: #409EFF;
  cursor: pointer ;
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
