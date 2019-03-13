const controller = require('../../controller/login')
const model = require('../model')
const { md5 } = require('../../util/util')
const m = model(['login', 'register', 'registerInsert', 'modifyPass'], 'login')
/* 登录 */
const login = async ctx => {
  let res
  const login = ctx.request.body
  try {
    await controller.login(login).then(result => {
      if (result.length === 0) {
        res = {
          status: 0,
          msg: '没有此用户'
        }
      } else {
        if (md5(login.pass) === result[0].password) {
          res = {
            status: 1,
            msg: '登录成功',
            right: result[0]['right']
          }
        } else {
          res = {
            status: 0,
            msg: '密码错误'
          }
        }
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
/* 注册 */
const register = async ctx => {
  let res
  const reg = ctx.request.body
  try {
    const result = await controller.register(reg)
    if (result.length > 0) {
      res = {
        code: 200,
        msg: {
          status: 0,
          msg: '此用户已注册'
        }
      }
    } else {
      const regData = {
        user: reg.user,
        pass: md5(reg.pass),
        right: reg.user
      }
      const regResult = await controller.registerInsert(regData)
      if (regResult.affectedRows === 1) {
        res = {
          code: 200,
          msg: {
            status: 1,
            msg: '注册成功'
          }
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
const addClient = async ctx => {
  let res
  const reg = ctx.request.body
  try {
    const result = await controller.register(reg)
    if (result.length > 0) {
      res = {
        code: 200,
        msg: {
          status: 0,
          msg: '此用户已注册'
        }
      }
    } else {
      const regData = {
        user: reg.user,
        pass: md5(reg.pass),
        right: reg.user
      }
      const regResult = await controller.registerInsert(regData)
      if (regResult.affectedRows === 1) {
        res = {
          code: 200,
          msg: {
            status: 1,
            msg: '注册成功'
          }
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
const modifyPass = async ctx => {
  let res
  const reg = ctx.request.body
  try {
    reg.pass = md5(reg.pass)
    reg.newPass = md5(reg.newPass)
    const result = await controller.validatePass(reg)
    if (result.length > 0) {
      const modifyRes = await controller.modifyPass(reg)
      if (modifyRes.affectedRows === 1) {
        res = {
          code: 200,
          msg: {
            status: 1,
            msg: '修改密码成功'
          }
        }
      } else {
        res = {
          code: 200,
          msg: {
            status: 0,
            msg: '修改密码失败'
          }
        }
      }
    } else {
      res = {
        code: 200,
        msg: {
          status: 0,
          msg: '旧密码错误'
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
module.exports = {
  ...m,
  register,
  login,
  addClient,
  modifyPass
}
