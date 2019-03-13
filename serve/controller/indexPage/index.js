const pool = require('../../db/mysql')
const { query } = pool

/* 获取首页不同日期下的任务数量 */
/* eslint-disable */
const getIndexNum = (right) => {
  if (right === 'admin') {
      const sqlDay = `SELECT count(b.phone) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 2
								AND date(datetime)=curdate()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              ) ` // 查询当天的记录
    const sqlWeek = `SELECT count(b.phone) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 1
								AND week(datetime) = week(sysdate())
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )  ` // 查询本周的记录
    const sqlLastWeek = `SELECT count(b.phone) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 1
								AND YEARWEEK(date_format(datetime,'%Y-%m-%d')) = YEARWEEK(now())-1
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )` // 查询上周的记录
    const sqlMonth = `SELECT count(b.phone) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 1
								AND month(datetime) = month(sysdate())
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              ) ` // 获取本月的记录
    const queryDay = query(sqlDay)
    const queryWeek = query(sqlWeek)
    const queryLastWeek = query(sqlLastWeek)
    const queryMonth = query(sqlMonth)
    return Promise.all([queryDay, queryWeek, queryLastWeek, queryMonth])
  } else {
    const sqlDay = `SELECT count(b.phone) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                and operater='${right}'
								AND b.category = 2
								AND date(datetime)=curdate()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              ) ` // 查询当天的记录
    const sqlWeek = `SELECT count(b.phone) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                and operater='${right}'
								AND b.category = 1
								AND week(datetime) = week(sysdate())
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )  ` // 查询本周的记录
    const sqlLastWeek = `SELECT count(b.phone) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                and operater='${right}'
								AND b.category = 1
								AND YEARWEEK(date_format(datetime,'%Y-%m-%d')) = YEARWEEK(now())-1
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )` // 查询上周的记录
    const sqlMonth = `SELECT count(b.phone) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                and operater='${right}'
								AND b.category = 1
								AND month(datetime) = month(sysdate())
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              ) ` // 获取本月的记录
    const queryDay = query(sqlDay)
    const queryWeek = query(sqlWeek)
    const queryLastWeek = query(sqlLastWeek)
    const queryMonth = query(sqlMonth)
    return Promise.all([queryDay, queryWeek, queryLastWeek, queryMonth])
  }
}

/* 获取最近10天每天的客户数量 */
const getTenNum = (right) => {
  if(right === 'admin'){
    const _sql = `SELECT date(dday) ddate, count(*) - 1 as num FROM ( SELECT datelist as dday
              FROM calendar where  DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datelist)&&date(datelist)<=CURDATE() 
              UNION ALL
              SELECT
              DATE_FORMAT(datetime,'%y-%m-%d')
              FROM
              (
							SELECT b.datetime
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 1
								AND DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datetime)&&date(datetime)<=CURDATE()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )
							) d
              ) c
              GROUP BY ddate`
    return query(_sql)
  } else {
    const _sql = `SELECT date(dday) ddate, count(*) - 1 as num FROM ( SELECT datelist as dday
              FROM calendar where  DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datelist)&&date(datelist)<=CURDATE() 
              UNION ALL
              SELECT
              DATE_FORMAT(datetime,'%y-%m-%d')
              FROM
              (
							SELECT b.datetime
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND a.operater='${right}'
								AND b.category = 1
								AND DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datetime)&&date(datetime)<=CURDATE()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )
							) d
              ) c
              GROUP BY ddate`
    return query(_sql)
  }

}

/* 获取最近10天不同状态的客户 */
const getTenState = (right) => {
  if (right === 'admin') {
    const _sql = `SELECT state, count(state) as num
                FROM (
								SELECT a.state, b.datetime
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 1
								AND DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datetime)&&date(datetime)<=CURDATE()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              ) 
								) c
                GROUP BY state`
    return query(_sql)
  } else {
    const _sql = `SELECT state, count(state) as num
                FROM (
								SELECT a.state, b.datetime
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 1
								AND a.operater='${right}'
								AND DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datetime)&&date(datetime)<=CURDATE()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              ) 
								) c
                GROUP BY state`
    return query(_sql)
  }
}

/* 获取最近10的客户数据 */
const getTenClient = (val) => {
  let {page, right} = val
  let pageStart = (page - 1) * 5, pageEnd = 5
  if (right === 'admin') {
    const _sql = `SELECT a.client,a.clientphone
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 1
								AND DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datetime)&&date(datetime)<=CURDATE()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              ) 
                LIMIT ${pageStart},${pageEnd} `
    const _sql_ = `SELECT count(a.client) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 1
								AND DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datetime)&&date(datetime)<=CURDATE()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )`
    const total = query(_sql)
    const paging = query(_sql_)
    return  Promise.all([total, paging])
  } else {
    const _sql = `SELECT a.client,a.clientphone
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND a.operater='${right}'
								AND b.category = 1
								AND DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datetime)&&date(datetime)<=CURDATE()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              ) 
                LIMIT ${pageStart},${pageEnd} `
    const _sql_ = `SELECT count(a.client) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND a.operater='${right}'
								AND b.category = 1
								AND DATE_SUB(CURDATE(), INTERVAL 9 DAY) <= date(datetime)&&date(datetime)<=CURDATE()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )`
    const total = query(_sql)
    const paging = query(_sql_)
    return  Promise.all([total, paging])
  }
}
/* 获取最近10天的客户详情 */
const getTenDetail = (val) => {
  let {id, right} =val
  if (right === 'admin') {
    const _sql = `SELECT DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime,description FROM mf_customer where phone=${id} ORDER BY datetime ASC`
    const _sql_ = `SELECT id, client, state, child, relationship, age, stage, subject, will FROM mf_task where clientphone=${id}`
    const total = query(_sql)
    const paging = query(_sql_)
    return  Promise.all([total, paging])
  } else {
    const _sql = `SELECT DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime,description FROM mf_customer where  phone=${id} ORDER BY datetime ASC`
    const _sql_ = `SELECT id, client, state, child, relationship, age, stage, subject, will FROM mf_task where 
                 clientphone=${id} AND operater='${right}'`
    const total = query(_sql)
    const paging = query(_sql_)
    return  Promise.all([total, paging])
  }
}
/* 获取今日任务 */
const getTodayData = (val) => {
  let {page, right} = val
  if (right === 'admin') {
    let pageStart = (page - 1) * 5, pages = 5
    const _sql = `SELECT a.client,b.phone, b.description
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 2
								AND date(datetime)=curdate()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )
 	              LIMIT ${pageStart},${pages} ` // 最新的描述
    const _sql_ = `SELECT count(a.client) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 2
								AND date(datetime)=curdate()
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )`
    const paging = query(_sql)
    const total = query(_sql_)
    return Promise.all([paging, total])
  } else {
    let pageStart = (page - 1) * 5, pages = 5
    const _sql = `SELECT a.client,b.phone, b.description
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 2
								AND date(datetime)=curdate()
								AND a.operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )
 	              LIMIT ${pageStart},${pages} ` // 最新的描述
    const _sql_ = `SELECT count(a.client) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND b.category = 2
								AND date(datetime)=curdate()
								AND a.operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
								AND category=b.category
 		            AND datetime > b.datetime
 	              )`
    const paging = query(_sql)
    const total = query(_sql_)
    return Promise.all([paging, total])
  }

}
module.exports = {
  getIndexNum,
  getTenNum,
  getTenState,
  getTenClient,
  getTenDetail,
  getTodayData
}
