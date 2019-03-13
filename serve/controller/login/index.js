const pool = require('../../db/mysql')
const { query } = pool
/* 登录 */
const login = (val) => {
  const { user } = val
  const _sql = `select * from mf_admin where username = ?`
  return query(_sql, [ user ])
}
/* 注册管理员 */
const register = (val) => {
  const { user } = val
  const _sql = `SELECT username from mf_admin where username=?`
  return query(_sql, [ user ])
}
const registerInsert = (val) => {
  const { user, pass, right } = val
  console.log(val)
  const _sql = 'INSERT INTO `mf_admin` (`username`, `password`, `right`) VALUES (?, ?, ?)'
  return query(_sql, [ user, pass, right ])
}
/* 修改密码 */
const modifyPass = (val) => {
  const { newPass, user } = val
  const _sql = `update mf_admin set password='${newPass}' where username='${user}'`
  return query(_sql)
}
const validatePass = (val) => {
  const { pass, user } = val
  const _sql = `select password from mf_admin where password='${pass}' and username='${user}'`
  return query(_sql)
}
module.exports = {
  login,
  register,
  registerInsert,
  modifyPass,
  validatePass
}
