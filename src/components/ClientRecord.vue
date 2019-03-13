<template>
  <div class="renwu-wrapper">
    <div class="renwu-wrap">
      <el-row class="task-tag-row">
        <el-tag class="active" @click="getRecordByDate('all')">全部</el-tag>
        <el-tag @click="getRecordByDate('3day')">三天内</el-tag>
        <el-tag @click="getRecordByDate('week')">本周</el-tag>
        <el-tag @click="getRecordByDate('month')">本月</el-tag>
      </el-row>
      <div class="record-timepick">
        时间
        <el-date-picker
          class="record-data"
          size="small"
          v-model="timePicker"
          type="daterange"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="findRecordByDate"></el-button>
      </div>
      <el-table
        :data="recordData"
        height="560"
        style="width: 100%">
        <el-table-column
          prop="client"
          label="客户名称">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="客户电话">
        </el-table-column>
        <el-table-column
          prop="datetime"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="description"
          label="任务计划">
        </el-table-column>
        <el-table-column
          prop="operater"
          label="负责人">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="detail"
          label="详情">
          <template slot-scope="scope">
            <span class="el-icon-edit-outline task-t-jilu" @click="showRecord(scope.row)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="clearfix">
      <el-pagination
        v-if="reloadPage"
        class="fr client-page"
        background
        layout="prev, pager, next"
        @current-change="curPageChange"
        :page-size="10"
        :total="totalPage">
      </el-pagination>
      <div class="client-showp fr">每页显示 10 条(共{{totalPage}}条)</div>
    </div>
    <Record :detailData="clientDetail" :desrcData="clientDescr" v-show="showRecordCard" @hiderecord="hideRecord"></Record>
    <div class="task-mask" v-show="showRecordCard" @click="hideRecord"></div>
  </div>
</template>

<script>
import Record from './common/Record'
import util from '../assets/js/util'
import config from '../assets/js/config'
export default {
  name: 'ClientRecord',
  components: {
    Record
  },
  data () {
    return {
      timePicker: '',
      showRecordCard: false,
      rowData: {},
      recordData: [],
      right: '', /* 权限 */
      pageIndex: 1, /* 分页当前页码 */
      totalPage: '', /* 分页总页码 */
      dateType: '', /* 时间类型（all，week，month，3day） */
      clientDetail: {}, /* 详情中的客户信息 */
      clientDescr: [], /* 详情中的描述 */
      reloadPage: true /* 重载分页 */
    }
  },
  created () {
    this.dateType = 'all'
    this.pageIndex = 1
    this.getRecord(this.dateType, this.pageIndex)
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
    /* 获取联系记录 */
    getRecord (dateType, page) {
      const right = util.getSession('store').user.right
      let str = typeof dateType === 'string' ? dateType : '' + dateType[0] + '至' + dateType[1]
      util.mf_post(config.host + '/clientRecordPAge/getRecord', {dateType, page, right}, this, '获取' + str + '记录')
        .then(res => {
          this.recordData = res.data
          this.totalPage = res.num
        })
    },
    /* 根据日期来获取联系记录 */
    getRecordByDate (dateType) {
      this.dateType = dateType
      this.indexPage = 1
      this.getRecord(this.dateType, this.indexPage)
      this.reloadElement('reloadPage')
    },
    /* 分页切换 */
    curPageChange (index) {
      this.indexPage = index
      this.getRecord(this.dateType, this.indexPage)
    },
    /* 刷新操作 */
    reloadElement (el) {
      this[el] = false
      this.$nextTick(() => {
        this[el] = true
      })
    },
    /* 获取详情数据 */
    getTaskDetail (row) {
      console.log(row)
      let data = {}
      data.right = this.right
      data.clientphone = row.phone
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
    /* 获取一段时间内的客户记录 */
    findRecordByDate () {
      if (!this.timePicker[0] && !this.timePicker[1]) {
        this.$message({
          type: 'warning',
          message: '请选择查询日期'
        })
        return false
      }
      this.dateType = this.timePicker
      this.indexPage = 1
      this.getRecord(this.dateType, this.indexPage)
      this.reloadElement('reloadPage')
    },
    hideRecord () {
      this.showRecordCard = false
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
  .task-tag-row .el-tag{
    padding: 0 30px;
  }
  .record-timepick{
    padding: 18px;
  }
  .record-timepick .el-button{
    padding: 8px 35px;
  }
  .record-data{
    margin: 0 15px;
  }
  .el-row .el-tag{
    margin-right: 20px;
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
