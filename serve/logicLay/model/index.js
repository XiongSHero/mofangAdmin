/**
 *
 * @param {*} config  对应的方法，要定义的哪几个方法模块，单个services层传入
 * @param {*} file 对应的controller文件名称
 * @return 返回一个对应好的对象
 */
module.exports = (config, file) => {
  const controller = require(`../../controller/${file}`)
  return config.reduce((copy, name) => {
    copy[name] = async ctx => {
      let res
      try {
        const val = ctx.request.body
        await controller[name](val).then(result => {
          res = {
            code: 200,
            result: result
          }
        })
      } catch (err) {
        res = {
          retCode: 500,
          msg: err.message || '服务器异常'
        }
      }
      ctx.body = res
    }
    return copy
  }, {})
}
