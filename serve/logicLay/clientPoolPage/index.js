const controller = require('../../controller/clientPoolPage')
const model = require('../model')
const m = model(['isAddClient', 'addClient', 'getClientDate', 'getClientDetail', 'editClient',
  'deleteClient'], 'clientPoolPage')

/* 添加客户， 如果已有不能重复添加 */
const addClient = async ctx => {
  let res
  const client = ctx.request.body
  try {
    const resultIs = await controller.isAddClient(client)
    if (resultIs.length > 0) {
      res = {
        code: 200,
        msg: '客户已存在，不能重复添加'
      }
    } else {
      const result = await controller.addClient(client)
      console.log(result)
      if (result.affectedRows === 1) {
        res = {
          code: 200,
          msg: '添加客户成功'
        }
      }
    }
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}

/* 根据日期获取客户池的数据 */
const getClientDate = async ctx => {
  let res
  const client = ctx.request.body
  try {
    const result = await controller.getClientDate(client)
    let clientData = {}
    clientData.data = result[0]
    clientData.num = result[1][0].num
    res = {
      code: 200,
      msg: clientData
    }
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
/* 根据状态获取客户池的数据 */
const getClientByState = async ctx => {
  let res
  const client = ctx.request.body
  try {
    const result = await controller.getClientByState(client)
    let clientData = {}
    clientData.data = result[0]
    clientData.num = result[1][0].num
    res = {
      code: 200,
      msg: clientData
    }
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
/* 根据状态获取客户池的数据 */
const getClientDetail = async ctx => {
  let res
  const client = ctx.request.body
  try {
    console.log(client)
    const result = await controller.getClientDetail(client)
    let clientdata = {}
    clientdata.detail = result[0][0]
    clientdata.descr = result[1]
    let stage = ['小学', '初中', '高中']
    let subject = ['语文', '数学', '英语']
    let clientStage = clientdata.detail.stage
    let clientSubject = clientdata.detail.subject
    switch (clientStage) {
      case 'xiao':
        clientStage = stage[0]
        break
      case 'chu':
        clientStage = stage[1]
        break
      case 'gao':
        clientStage = stage[2]
        break
    }
    switch (clientSubject) {
      case 'yu':
        clientSubject = subject[0]
        break
      case 'shu':
        clientSubject = subject[1]
        break
      case 'wai':
        clientSubject = subject[2]
        break
    }
    clientdata.detail.stage = clientStage
    clientdata.detail.subject = clientSubject
    res = {
      code: 200,
      msg: clientdata
    }
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
/* 编辑客户信息 */
const editClient = async ctx => {
  let res
  const form = ctx.request.body
  console.log('=============================================')
  console.log(form)
  console.log('=============================================')
  try {
    const result = await controller.editClient(form)
    if (result.affectedRows === 1) {
      res = {
        code: 200,
        msg: '更改成功'
      }
    }
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
/* 删除客户 */
const deleteClient = async ctx => {
  let res
  const deleteClient = ctx.request.body
  try {
    const result = await controller.deleteClient(deleteClient)
    console.log(result)
    if (result[0].affectedRows === 1 && result[1]) {
      res = {
        code: 200,
        msg: '删除成功'
      }
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
  addClient,
  getClientDate,
  getClientByState,
  getClientDetail,
  editClient,
  deleteClient
}
