const controller = require('../../controller/taskPage')
const model = require('../model')
const m = model(['getAllTask', 'addResultAndPlan'], 'taskPage')
const getAllTask = async ctx => {
  let res
  const task = ctx.request.body
  try {
    const result = await controller.getAllTask(task)
    let allTask = {}
    allTask.data = result[0]
    allTask.num = result[1][0].num
    res = {
      code: 200,
      msg: allTask
    }
  } catch (err) {
    res = {
      code: 400,
      result: err
    }
  }
  ctx.body = res
}
const addResultAndPlan = async ctx => {
  let res
  const task = ctx.request.body
  console.log('========================================')
  console.log(task)
  console.log('========================================')
  try {
    const result = await controller.addResultAndPlan(task)
    const sd = result.every(item => {
      return item.affectedRows === 1
    })
    if (sd) {
      res = {
        code: 200,
        msg: '添加任务结果和任务计划成功'
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
  getAllTask,
  addResultAndPlan
}
