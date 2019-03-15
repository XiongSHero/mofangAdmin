const pool = require('../../db/mysql')
const { query } = pool

/* 检查有没有该用户，不能重复添加客户 */
const isAddClient = (val) => {
  const { clientphone } = val
  const _sql = `select client from mf_task where clientphone='${clientphone}'`
  return query(_sql)
}
/* 添加数据 */
const addClient = (val) => {
  const { client, tasktime, state, clientphone, child, relationship,
    age, stage, subject, will, operater} = val
  console.log('3333333333333333333333333333333333333333')
  console.log(val)
  console.log('3333333333333333333333333333333333333333')
  const _sql = 'insert into `mf_task` (`client`, `tasktime`, `state`, `clientphone`, `child`, `relationship`,\n' +
    ' `age`, `stage`, `subject`, `will`, `operater`) values (?,?,?,?,?,?,?,?,?,?,?)'
  return query(_sql, [client, tasktime, state, clientphone, child, relationship,
    age, stage, subject, will, operater])
}
/* 根据时间来获取客户池的数据 */
const getClientDate = (val) => {
  const { right, date, page } = val
  const startPage = (page - 1) * 10
  const paging = 10
  if (right === 'admin') {
    switch (date) {
      case 'all':
        const _sqlall = `select * from mf_task order by tasktime desc limit ${startPage}, ${paging}`
        const _sqlnum = `select count(id) as num from mf_task `
        const sqlall = query(_sqlall)
        const sqlnum = query(_sqlnum)
        return Promise.all([sqlall, sqlnum])
      case 'day':
        const _sqlday = `select * from mf_task where date(tasktime) = curdate() order by tasktime desc limit ${startPage}, ${paging}`
        const _sqldaynum = `select count(id) as num from mf_task where date(tasktime) = curdate()`
        const sqlday = query(_sqlday)
        const sqldaynum = query(_sqldaynum)
        return Promise.all([sqlday, sqldaynum])
      case 'week':
        const _sqlweek = `select * from mf_task where week(tasktime)=week(sysdate()) order by tasktime desc limit ${startPage}, ${paging}`
        const _sqlweeknum = `select count(id) as num from mf_task where week(tasktime)=week(sysdate())`
        const sqlweek = query(_sqlweek)
        const sqlweeknum = query(_sqlweeknum)
        return Promise.all([sqlweek, sqlweeknum])
      case 'month':
        const _sqlmonth = `select * from mf_task where month(tasktime) = month(sysdate()) order by tasktime desc limit ${startPage}, ${paging}`
        const _sqlmonthnum = `select count(id) as num from mf_task where month(tasktime) = month(sysdate())`
        const sqlmonth = query(_sqlmonth)
        const sqlmonthnum = query(_sqlmonthnum)
        return Promise.all([sqlmonth, sqlmonthnum])
    }
  } else {
    switch (date) {
      case 'all':
        const _sqlall = `select * from mf_task where operater='${right}'  order by tasktime desc limit ${startPage}, ${paging}`
        const _sqlnum = `select count(id) as num from mf_task where operater='${right}'`
        const sqlall = query(_sqlall)
        const sqlnum = query(_sqlnum)
        return Promise.all([sqlall, sqlnum])
      case 'day':
        const _sqlday = `select * from mf_task where operater='${right}'  and date(tasktime) = curdate() order by tasktime desc limit ${startPage}, ${paging}`
        const _sqldaynum = `select count(id) as num from mf_task where operater='${right}' and date(tasktime) = curdate()`
        const sqlday = query(_sqlday)
        const sqldaynum = query(_sqldaynum)
        return Promise.all([sqlday, sqldaynum])
      case 'week':
        const _sqlweek = `select * from mf_task where operater='${right}' and week(tasktime)=week(sysdate()) order by tasktime desc limit ${startPage}, ${paging}`
        const _sqlweeknum = `select count(id) as num from mf_task where operater='${right}' and week(tasktime)=week(sysdate())`
        const sqlweek = query(_sqlweek)
        const sqlweeknum = query(_sqlweeknum)
        return Promise.all([sqlweek, sqlweeknum])
      case 'month':
        const _sqlmonth = `select * from mf_task where operater='${right}' and month(tasktime) = month(sysdate()) order by tasktime desc limit ${startPage}, ${paging}`
        const _sqlmonthnum = `select count(id) as num from mf_task where operater='${right}' and month(tasktime) = month(sysdate())`
        const sqlmonth = query(_sqlmonth)
        const sqlmonthnum = query(_sqlmonthnum)
        return Promise.all([sqlmonth, sqlmonthnum])
    }
  }
}
/* 根据状态来获取客户池的数据 */
const getClientByState = (val) => {
  const { right, state, page } = val
  const startPage = (page - 1) * 10
  const paging = 10
  if (right === 'admin') {
    const _sqlall = `select * from mf_task where state='${state}' order by tasktime desc limit ${startPage}, ${paging}`
    const _sqlnum = `select count(id) as num from mf_task where state='${state}'`
    const sqlall = query(_sqlall)
    const sqlnum = query(_sqlnum)
    return Promise.all([sqlall, sqlnum])
  } else {
    const _sqlall = `select * from mf_task where operater='${right}' and state='${state}' order by tasktime desc limit ${startPage}, ${paging}`
    const _sqlnum = `select count(id) as num from mf_task where operater='${right}' and state='${state}'`
    const sqlall = query(_sqlall)
    const sqlnum = query(_sqlnum)
    return Promise.all([sqlall, sqlnum])
  }
}

/* 获取表格中的详情信息 */
const getClientDetail = (val) => {
  const { right, clientphone } = val
  if (right === 'admin') {
    const _sql = `select id, DATE_FORMAT(tasktime,'%Y-%m-%d %H:%i:%s') as tasktime, client, state, clientphone, child,
                relationship, age, stage, subject, will from mf_task where clientphone
                ='${clientphone}'`
    const _sqldescr = `SELECT DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime,description FROM mf_customer where
   phone=${clientphone} ORDER BY datetime ASC`
    const sqldetail = query(_sql)
    const sqldescr = query(_sqldescr)
    return Promise.all([sqldetail, sqldescr])
  } else {
    const _sql = `select id, DATE_FORMAT(tasktime,'%Y-%m-%d %H:%i:%s') as tasktime, client, state, clientphone, child,
                relationship, age, stage, subject, will from mf_task where operater='${right}' and clientphone
                ='${clientphone}' ORDER BY tasktime DESC`
    const _sqldescr = `SELECT DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime,description FROM mf_customer where
   phone=${clientphone}`
    const sqldetail = query(_sql)
    const sqldescr = query(_sqldescr)
    return Promise.all([sqldetail, sqldescr])
  }
}

/* 编辑客户信息 */
const editClient = (val) => {
  const {id, client, tasktime, state, clientphone, child, relationship, age, stage, subject, will, right} = val
  const _sqledit = `update mf_task set client='${client}', state='${state}', tasktime='${tasktime}', clientphone='${clientphone}',
                    child='${child}', relationship='${relationship}', age='${age}', stage='${stage}', subject='${subject}',
                    will='${will}', operater='${right}' where id=${id}`
  return query(_sqledit)
}
/* 删除客户 */
const deleteClient = (val) => {
  const {id, phone} = val
  const _sqldelete = `delete from mf_task where id=${id}`
  const _sqldeldescr = `delete from mf_customer where phone=${phone}`
  const deleteClient = query(_sqldelete)
  const deleteDescr = query(_sqldeldescr)
  return Promise.all([deleteClient, deleteDescr])
}
/* 上传excel表格数据 */
const uploadExcel = (val) => {
  // const { client, tasktime, state, clientphone, child, relationship,
  //   age, stage, subject, will, operater} = val
  const _sql = 'insert into `mf_task` (`client`, `tasktime`, `state`, `clientphone`, `child`, `relationship`,\n' +
    ' `age`, `stage`, `subject`, `will`, `operater`) values ?'
  return query(_sql, [val])
}

/* 检查上传的数据是否有重复 */
const isRepeat = (val) => {
  const _sql = `select clientphone from mf_task where clientphone in (?)`
  return query(_sql, [val])
}

/* 根据电话获取客户信息 */
const getClientByPhone = (val) => {
  const {phone, right} = val
  if (right === 'admin') {
    const _sql = `select id, DATE_FORMAT(tasktime,'%Y-%m-%d %H:%i:%s') as tasktime, client, state, clientphone, child,
                relationship, age, stage, subject, will from mf_task where clientphone
                ='${phone}'`
    return query(_sql)
  } else {
    const _sql = `select id, DATE_FORMAT(tasktime,'%Y-%m-%d %H:%i:%s') as tasktime, client, state, clientphone, child,
                relationship, age, stage, subject, will from mf_task where clientphone
                ='${phone}' and operater='${right}'`
    return query(_sql)
  }
}

/* 获取所有的权限 */
const getAllRights = (val) => {
  const {mainRight} = val
  if (mainRight === 'admin') {
    const _sql = `SELECT a.right from mf_admin a`
    return query(_sql)
  }
}
/* 修改权限 */
const modifyRight = (val) => {
  const {right, id} = val
  const _sql = `update mf_task set operater='${right}' where id=${id}`
  return query(_sql)
}

module.exports = {
  isAddClient,
  addClient,
  getClientDate,
  getClientByState,
  getClientDetail,
  editClient,
  deleteClient,
  uploadExcel,
  isRepeat,
  getClientByPhone,
  getAllRights,
  modifyRight
}
