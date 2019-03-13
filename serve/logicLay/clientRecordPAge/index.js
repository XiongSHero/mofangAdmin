const controller = require('../../controller/clientRecordPAge')
const model = require('../model')
const m = model(['getRecord'], 'clientRecordPAge')
/* 获取客户联系记录 */
const getRecord = async ctx => {
  let res
  const task = ctx.request.body
  try {
    const result = await controller.getRecord(task)
    let record = {}
    record.data = result[0]
    record.data.forEach(item => {
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
      }
    })
    record.num = result[1][0].num
    res = {
      code: 200,
      msg: record
    }
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
  getRecord
}
