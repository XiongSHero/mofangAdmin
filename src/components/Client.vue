<template>
  <div class="renwu-wrapper">
    <div class="renwu-wrap">
      <el-row class="task-tag-row">
        分类
        <el-tag class="active" @click="getClientAll">全部</el-tag>
        <el-tag @click="getClientBy0">已成交</el-tag>
        <el-tag @click="getClientBy1">有意向</el-tag>
        <el-tag @click="getClientBy2">已拒绝</el-tag>
        <el-tag @click="getClientByNull">未联系</el-tag>
        <el-tag @click="getClientByMonth">本月新增</el-tag>
        <el-tag @click="getClientByWeek">本周新增</el-tag>
        <el-tag @click="getClientByDay">今日新增</el-tag>
      </el-row>
      <div class="record-timepick">
        客户<el-input v-model="input"  class="record-data" size="small" placeholder="请输入内容"></el-input>
        电话<el-input v-model="input"  class="record-data" size="small" placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="el-icon-search"></el-button>
        <el-button type="primary" class="add-client" @click="showAddClient">添加客户</el-button>
      </div>
      <el-table
        :data="clientData"
        :loading="getClientLoading"
        style="width: 100%"
        height="620"
        v-if="showTable"
      >
        <el-table-column
          prop="client"
          label="客户名称">
        </el-table-column>
        <el-table-column
          prop="clientphone"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="tasktime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="detail"
          label="详情">
          <template slot-scope="scope">
            <span class="el-icon-edit-outline task-t-jilu" @click="showRecord(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="handle"
          label="工具">
          <template slot-scope="scope">
            <el-button type="text" class="client-button" @click="editClient(scope.row)">编辑</el-button>  /  <el-button class="client-button" @click="deleteClient(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="clearfix">
      <el-pagination
        v-if="showPagination"
        class="fr client-page"
        background
        layout="prev, pager, next"
        @current-change="curPageChange"
        :page-size="10"
        :total="totalPage">
      </el-pagination>
      <div class="client-showp fr">每页显示 10 页（共{{totalPage}}页）</div>
    </div>
    <Record :detailData="clientDetail" :desrcData="clientDescr" v-show="showRecordCard" @hiderecord="hideRecord"></Record>
    <EditClient v-show="showEditCard" :detailData0="detailEdit" @hideedit="hideEdit" @reloadclient="curPageChange(indexPage)"></EditClient>
    <Add-client v-show="showAddClientCard" @hideAddClient="hideAddClient" @reloadtableData="reloadtableData"></Add-client>
    <div class="task-mask" v-show="showRecordCard" @click="hideRecord"></div>
    <div class="task-mask" v-show="showEditCard" @click="hideEdit"></div>
    <div class="task-mask" v-show="showAddClientCard" @hideAddClient="hideAddClient"></div>
  </div>
</template>

<script>
import Record from './common/Record'
import EditClient from './common/EditClient'
import AddClient from './common/AddClient'
import util from '../assets/js/util'
import config from '../assets/js/config'
export default {
  name: 'Client',
  components: {
    Record,
    EditClient,
    AddClient
  },
  data () {
    return {
      showRecordCard: false,
      showEditCard: false,
      showAddClientCard: false, /* 控制添加客户组件的显示与否 */
      clientData: [], /* 表格数据 */
      dateType: {}, /* 获取数据发送的data（日期） */
      stateType: {}, /* 获取数据发送的data（状态） */
      detailType: {}, /* 获取表格（详情）发送的data */
      indexPage: 1, /* 分页页码 */
      byDate: '', /* 日期（本日， 本月， 本周） */
      totalPage: 0, /* 分页总页数 */
      getClientLoading: false, /* 未拿到数据的loading */
      showPagination: true, /* 刷新分页 */
      showTable: true, /* 刷新表格 */
      clientState: '', /* 客户状态 */
      clientDetail: {}, /* 客户信息 */
      detailEdit: {}, /* 需要编辑的信息 */
      clientDescr: [], /* 客户任务记录 */
      byDateOrState: false /* 分页切换是按日期（false）还是按状态切换（true） */
    }
  },
  created () {
    this.byDate = 'all'
    this.clientState = '0'
    this.indexPage = 1
    this.getClientData(this.byDate, this.indexPage)
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
    /* 获取表格数据(根据日期) */
    getClientData (date, indexPage) {
      this.byDateOrState = false
      this.dateType.right = util.getSession('store').user.right
      this.dateType.date = date
      this.dateType.page = indexPage
      this.getClientLoading = true
      util.mf_post(config.host + '/clientPoolPage/getClientDate', this.dateType, this, '获取' + date + '表格数据')
        .then(res => {
          const data = res.data
          data.forEach(item => {
            const ms = Date.parse(item.tasktime)
            item.tasktime = util.timeSerialize(new Date(ms))
            switch (item.state) {
              case '0':
                item.state = '已成交'
                break
              case '1':
                item.state = '有意向'
                break
              case '2':
                item.state = '已拒绝'
                break
              case '3':
                item.state = '未联系'
            }
          })
          this.totalPage = res.num
          this.clientData = data
          this.getClientLoading = false
        })
    },
    /* 获取表格数据(根据状态) */
    getClientByState (state, indexPage) {
      this.byDateOrState = true
      this.stateType.right = util.getSession('store').user.right
      this.stateType.state = state
      this.stateType.page = indexPage
      this.getClientLoading = true
      let stateMsg
      switch (state) {
        case '0':
          stateMsg = '已成交'
          break
        case '1':
          stateMsg = '有意向'
          break
        case '2':
          stateMsg = '已拒绝'
          break
        case '3':
          stateMsg = '未联系'
          break
      }
      util.mf_post(config.host + '/clientPoolPage/getClientByState', this.stateType, this, '获取' + stateMsg + '表格数据')
        .then(res => {
          const data = res.data
          data.forEach(item => {
            const ms = Date.parse(item.tasktime)
            item.tasktime = util.timeSerialize(new Date(ms))
            switch (item.state) {
              case '0':
                item.state = '已成交'
                break
              case '1':
                item.state = '有意向'
                break
              case '2':
                item.state = '已拒绝'
                break
              case '3':
                item.state = '未联系'
            }
          })
          this.totalPage = res.num
          this.clientData = data
          this.getClientLoading = false
        })
    },
    /* 分页切换 */
    curPageChange (index) {
      console.log(index)
      this.indexPage = index
      if (this.byDateOrState) {
        this.getClientByState(this.clientState, this.indexPage)
      } else {
        this.getClientData(this.byDate, this.indexPage)
      }
    },
    /* 刷新操作 */
    reloadElement (el) {
      this[el] = false
      this.$nextTick(() => {
        this[el] = true
      })
    },
    /* 根据时间获取表格数据（本日，本周， 本月） */
    getClientAll () {
      this.byDate = 'all'
      this.getClientData(this.byDate, 1)
      this.indexPage = 1
      this.reloadElement('showPagination')
    },
    getClientByDay () {
      this.byDate = 'day'
      this.getClientData(this.byDate, 1)
      this.indexPage = 1
      this.reloadElement('showPagination')
    },
    getClientByWeek () {
      this.byDate = 'week'
      this.getClientData(this.byDate, 1)
      this.indexPage = 1
      this.reloadElement('showPagination')
    },
    getClientByMonth () {
      this.byDate = 'month'
      this.getClientData(this.byDate, 1)
      this.indexPage = 1
      this.reloadElement('showPagination')
    },
    /* 根据状态获取表格数据（已成交， 有意向， 已拒绝， 未联系） */
    getClientBy0 () {
      this.clientState = '0'
      this.getClientByState(this.clientState, 1)
      this.indexPage = 1
      this.reloadElement('showPagination')
    },
    getClientBy1 () {
      this.clientState = '1'
      this.getClientByState(this.clientState, 1)
      this.indexPage = 1
      this.reloadElement('showPagination')
    },
    getClientBy2 () {
      this.clientState = '2'
      this.getClientByState(this.clientState, 1)
      this.indexPage = 1
      this.reloadElement('showPagination')
    },
    getClientByNull () {
      this.clientState = '3'
      this.getClientByState(this.clientState, 1)
      this.indexPage = 1
      this.reloadElement('showPagination')
    },
    /* 获取客户详细信息（表格中的详情） */
    getClientDetail (row) {
      this.detailType.right = util.getSession('store').user.right
      this.detailType.clientphone = row.clientphone
      util.mf_post(config.host + '/clientPoolPage/getClientDetail', this.detailType, this, '获取' + row.client + '详细数据')
        .then(res => {
          this.clientDetail = res.detail
          this.detailEdit = res.detail
          this.clientDescr = res.descr
        })
    },
    /* 编辑客户信息 */
    editClient (row) {
      this.showEditCard = true
      this.getClientDetail(row)
    },
    /* 删除客户信息 */
    deleteClient (row) {
      this.$confirm('是否删除客户《' + row.client + '》?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAction(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    reloadtableData () {
      this.getClientAll()
    },
    /* 删除操作 */
    deleteAction (row) {
      let id = row.id
      let phone = row.clientphone
      util.mf_post(config.host + '/clientPoolPage/deleteClient', {id, phone}, this, '删除' + row.client)
        .then(res => {
          this.$message({
            type: 'success',
            message: res
          })
          this.getClientData(this.byDate, this.indexPage)
        })
    },
    showRecord (row) {
      this.getClientDetail(row)
      this.showRecordCard = true
    },
    showAddClient () {
      this.showAddClientCard = true
    },
    hideRecord () {
      this.showRecordCard = false
    },
    hideEdit () {
      this.showEditCard = false
    },
    hideAddClient () {
      this.showAddClientCard = false
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
    width: 180px;
    margin: 0 15px;
  }
  .add-client{
    margin-left: 15px;
  }
  .el-row .el-tag{
    margin-right: 20px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .task-tag-row .active{
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
