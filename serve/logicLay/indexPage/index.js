const controller = require('../../controller/indexPage')
const model = require('../model')
const m = model(['getIndexNum', 'getTenNum', 'getTenState', 'getTenClient', 'getTenDetail', 'getTodayData'], 'indexPage')
const util = require('../../util/util')
const config = require('../../config/config')

/* 获取不同日期的任务数量 */
const getIndexNum = async ctx => {
  let right = ctx.request.body.right
  console.log('right' + right)
  let res
  try {
    await controller.getIndexNum(right).then(result => {
      let arr = []
      result.forEach((item) => {
        arr.push(item[0].num)
      })
      res = {
        code: 200,
        msg: arr
      }
    })
  } catch (err) {
    // console.log(err)
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
/* 获取最近10天每天的客户数量 */
const getTenNum = async ctx => {
  let right = ctx.request.body.right
  let res
  try {
    await controller.getTenNum(right).then(result => {
      let getTenNum = {time: [], num: []}
      result.forEach((item) => {
        getTenNum.time.push(util.monthDay(item.ddate))
        getTenNum.num.push(item.num)
      })
      res = {
        code: 200,
        msg: getTenNum
      }
    })
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
/* 获取最近10天不同状态的客户 */
const getTenState = async ctx => {
  let right = ctx.request.body.right
  let res
  try {
    await controller.getTenState(right).then(result => {
      let getTenState = []
      result.forEach((item) => {
        switch (item.state) {
          case config.DESIRE[0]:
            getTenState.push({value: item.num, name: '已成交'})
            break
          case config.DESIRE[1]:
            getTenState.push({value: item.num, name: '有意向'})
            break
          case config.DESIRE[2]:
            getTenState.push({value: item.num, name: '已拒绝'})
            break
        }
      })
      res = {
        code: 200,
        msg: getTenState
      }
    })
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
/* 获取最近10的客户数据 */
const getTenClient = async ctx => {
  let res
  let page = ctx.request.body
  if (!page) page = 1
  try {
    await controller.getTenClient(page).then(result => {
      const getTenClient = {}
      getTenClient.total = result[1][0].num
      getTenClient.client = result[0]
      res = {
        code: 200,
        msg: getTenClient
      }
    })
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
/* 获取最近10天的客户详情 */
const getTenDetail = async ctx => {
  let res
  let id = ctx.request.body
  try {
    await controller.getTenDetail(id).then(result => {
      let getTenDetail = {}
      getTenDetail.detail = result[1][0]
      getTenDetail.descr = result[0]
      res = {
        code: 200,
        msg: getTenDetail
      }
    })
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
/* 获取今日任务 */
const getTodayData = async ctx => {
  let res
  let page = ctx.request.body
  console.log(page)
  try {
    await controller.getTodayData(page).then(result => {
      let getTodayData = {}
      getTodayData.todayData = result[0]
      getTodayData.totalPage = result[1][0].num
      res = {
        code: 200,
        msg: getTodayData
      }
    })
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
module.exports = {
  ...m,
  getIndexNum,
  getTenNum,
  getTenState,
  getTenClient,
  getTenDetail,
  getTodayData
}
