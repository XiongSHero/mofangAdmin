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
        电话<el-input v-model="phone"  class="record-data" size="small" placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="getClientByPhone"></el-button>
        <el-button type="primary" class="add-client" @click="showAddClient">添加客户</el-button>
        <vue-xlsx-table @on-select-file="readExcel">上传EXCEL</vue-xlsx-table>
        <router-link :to="{path: '/excel'}" class="excelImg">excel数据格式??</router-link>
      </div>
      <el-table
        :data="clientData"
        v-loading="getClientLoading"
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
          prop="operater"
          label="负责人">
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
        <el-table-column
          v-if="mainRight === 'admin'"
          prop="handle"
          label="权限">
          <template slot-scope="scope" class="updateRight">
            <el-dropdown @command="modifyRight" trigger="click">
              <span class="el-dropdown-link" @click="getRowDetail(scope.row)">
                修改权限<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="right in rights" :key="right.right" :command="right.right">{{right.right}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
/* eslint-disable */
import Record from './common/Record'
import EditClient from './common/EditClient'
import vueXlsxTable from './common/VueXlsxTable'
import AddClient from './common/AddClient'
import util from '../assets/js/util'
import config from '../assets/js/config'

export default {
  name: 'Client',
  components: {
    Record,
    EditClient,
    AddClient,
    vueXlsxTable
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
      byDateOrState: false, /* 分页切换是按日期（false）还是按状态切换（true） */
      uploadData: [],
      excelUrl: '',
      phone: '', /* 客户电话 */
      rights: [], /* 所有的权限 */
      mainRight: '', /* 主权限admin */
      rowDetail: '' /* 被点击的行的信息 */
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
    window.addEventListener('load', () => {
      this.getAllRights()
    })
  },
  watch:{
    '$route'(to){
      if (to.path === '/client') {
        this.getAllRights()
      }
    }
  },
  methods: {
    /* 获取所有的权限 */
    getAllRights () {
      this.mainRight = util.getSession('store').user.right
      if (this.mainRight === 'admin') {
        util.mf_post(config.host + '/clientPoolPage/getAllRights', {mainRight: this.mainRight}, this, '获取所有权限')
          .then(res => {
            this.rights = res

          })
      }
    },
    /* 权限修改 */
    modifyRight (right) {
      if (this.mainRight !== 'admin') {
        this.$message({
          type: 'warning',
          message: '权限不足'
        })
        return
      }
      const id = this.rowDetail.id
      const client = this.rowDetail.client
      this.$confirm(`是否修改《${client}》的权限?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.modifyAction(right,id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    modifyAction (right, id) {
      util.mf_post(config.host + '/clientPoolPage/modifyRight', {right, id}, this, '修改权限失败')
        .then(res => {
          if (res.status === 0) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.reloadAfterAction()
          } else if (res.status === 1) {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    getRowDetail (row) {
      this.rowDetail = row
    },
    /* 导入excel文件 */
    readExcel (data) {
      /* 验证表格数据 */
      const excelData = data.body
      if (excelData.length === 0) {
        this.$message({
          type: 'error',
          message: '表格数据不能为空'
        })
        return false
      }
      const isData = excelData.every(item => {
        return item['学生姓名'] && item['联系方式']
      })
      if (!isData) {
        this.$message({
          type: 'error',
          message: '表格数据格式错误'
        })
        return false
      }
      /* 格式化表格数据 */
      this.uploadData =  this.excelFormdate(excelData)
      let repeat = []
      this.uploadData.reduce(function (init, cur) {
        if (init.length === 0 || init[init.length -1].clientphone !== cur.clientphone) {
          init.push(cur)
        } else if (init[init.length -1].clientphone === cur.clientphone) {
          repeat.push(cur)
        }
        return init
      },[])
      let repeatStr = ''
      if (repeat.length > 0) {
        repeat.forEach(item => {
          repeatStr += item.clientphone + '<br>'
        })
        this.$notify.error({
          title: '表格数据重复',
          dangerouslyUseHTMLString: true,
          duration: 0,
          message: repeatStr
        });
        return
      }
      this.getClientLoading = true
      /* 将数据发送到后台 */
      util.mf_post(config.host + '/clientPoolPage/uploadExcel', this.uploadData, this, '上传EXCEL表格数据')
        .then(res => {
          if (res.msg === this.uploadData.length && res.status === 0) {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            this.reloadAfterAction()
          } else if (res.status === 1) {
            const result = res.msg
            let str = ''
            result.forEach(item => {
              str += item.clientphone +'<br>'
            })
            this.$notify.error({
              title: '系统中已有以下数据',
              dangerouslyUseHTMLString: true,
              duration: 0,
              message: str
            });
          } else {
            this.$message({
              type: 'error',
              message: '上传失败'
            })
          }
          this.getClientLoading = false
        }).catch(() => {
        this.getClientLoading = false
      })
    },
    /* 处理完成操作后，修改数据 */
    reloadAfterAction () {
      if (this.byDateOrState) {
        this.getClientByState(this.clientState, this.indexPage)
      } else {
        this.getClientData(this.byDate, this.indexPage)
      }
    },
    /* 处理excel上传的数据 */
    excelFormdate (excelData) {
      excelData.forEach(item => {
        Object.keys(item).forEach(key => {
          switch (key) {
            case '学生姓名':
              item.child = item[key]
              delete item[key]
              break
            case '联系方式':
              item.clientphone = String.trim(item[key])
              delete item[key]
              break
            case '家长':
              item.client = String.trim(item[key])
              delete item[key]
              break
            case '关系':
              item.relationship = String.trim(item[key])
              delete item[key]
              break
            case '年龄':
              item.age = String.trim(item[key])
              delete item[key]
              break
            case '阶段':
              // item.stage = String.trim(item[key])
              switch (item[key]) {
                case '小学':
                  item.stage = 'xiao'
                  break
                case '初中':
                  item.stage = 'chu'
                  break
                case '高中':
                  item.stage = 'gao'
                  break
              }
              delete item[key]
              break
            case '科目':
              switch (item[key]) {
                case '语文':
                  item.subject = 'yu'
                  break
                case '数学':
                  item.subject = 'shu'
                  break
                case '英语':
                  item.subject = 'wai'
                  break
              }
              delete item[key]
              break
            case '描述':
              item.will = String.trim(item[key])
              delete item[key]
              break
            default:
              delete item[key]
          }
        })
        item.state = 3
        item.tasktime = util.timeSerialize(new Date())
        item.operater = util.getSession('store').user.right
        if (!item.client) {
          item.client = item.child + '（学生）'
        }
        if(!item.relationship) {
          item.relationship = ''
        }
        if(!item.age) {
          item.age = ''
        }
        if(!item.stage) {
          item.stage = ''
        }
        if(!item.subject) {
          item.subject = ''
        }
        if(!item.will) {
          item.will = ''
        }
      })
      return excelData
    },
    /* 根据电话搜索客户 */
    getClientByPhone () {
      const phone = this.phone
      if (!(/^1\d{10}$/.test(phone))) {
        this.$message({
          type: 'warning',
          message: '请输入合格客户电话'
        })
        return
      }
      let right = util.getSession('store').user.right
      this.getClientLoading = true
      util.mf_post(config.host + '/clientPoolPage/getClientByPhone', {phone, right}, this, '获取' + phone + '表格数据')
        .then(res => {
          this.getClientLoading = false
          this.clientData = res
          this.totalPage = res.length
          this.reloadElement('showPagination')
        })
    },
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
      this.indexPage = index
      this.reloadAfterAction()
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
  .excelImg{
    vertical-align: bottom;
    font-size: 14px;
    color: #108cee;
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
  .updateRight{
    z-index: 1000;
  }
</style>
