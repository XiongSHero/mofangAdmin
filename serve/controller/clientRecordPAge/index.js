const pool = require('../../db/mysql')
const { query } = pool
/* 获取客户记录 */
/* eslint-disable */
const getRecord = (val) => {
  const { page, right, dateType } = val
  const pageStart = (page - 1) * 10
  const pages = 10
  switch (dateType) {
    case 'all':
      if (right === 'admin') {
        const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
        const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
        const queryrecord = query(_sql)
        const querynum = query(_sqlnum)
        return Promise.all([queryrecord, querynum])
      } else {
        const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
        const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
        const queryrecord = query(_sql)
        const querynum = query(_sqlnum)
        return Promise.all([queryrecord, querynum])
      }
      break
    case '3day':
      if (right === 'admin') {
        const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND DATE_SUB(CURDATE(), INTERVAL 2 DAY) <= date(datetime)
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
        const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND DATE_SUB(CURDATE(), INTERVAL 2 DAY) <= date(datetime)
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
        const queryrecord = query(_sql)
        const querynum = query(_sqlnum)
        return Promise.all([queryrecord, querynum])
      } else {
        const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater 
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND DATE_SUB(CURDATE(), INTERVAL 2 DAY) <= date(datetime)
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
        const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND DATE_SUB(CURDATE(), INTERVAL 2 DAY) <= date(datetime)
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
        const queryrecord = query(_sql)
        const querynum = query(_sqlnum)
        return Promise.all([queryrecord, querynum])
      }
      break
    case 'week':
      if (right === 'admin') {
        const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND week(datetime) = week(sysdate())
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
        const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND week(datetime) = week(sysdate())
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
        const queryrecord = query(_sql)
        const querynum = query(_sqlnum)
        return Promise.all([queryrecord, querynum])
      } else {
        const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater 
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND week(datetime) = week(sysdate())
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
        const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND week(datetime) = week(sysdate())
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
        const queryrecord = query(_sql)
        const querynum = query(_sqlnum)
        return Promise.all([queryrecord, querynum])
      }
      break
    case 'month':
      if (right === 'admin') {
        const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND month(datetime) = month(sysdate())
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
        const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND month(datetime) = month(sysdate())
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
        const queryrecord = query(_sql)
        const querynum = query(_sqlnum)
        return Promise.all([queryrecord, querynum])
      } else {
        const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater 
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND month(datetime) = month(sysdate())
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
        const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND month(datetime) = month(sysdate())
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
        const queryrecord = query(_sql)
        const querynum = query(_sqlnum)
        return Promise.all([queryrecord, querynum])
      }
      break
  }
  /* 查询客户记录 */
  if (Array.isArray(dateType)) {
    if (right === 'admin') {
      const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND datetime between '${dateType[0]}' AND '${dateType[1]}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
      const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND datetime between '${dateType[0]}' AND '${dateType[1]}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
      const queryrecord = query(_sql)
      const querynum = query(_sqlnum)
      return Promise.all([queryrecord, querynum])
    } else {
      const _sql = `SELECT a.client, b.phone, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime, a.state, a.operater 
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND datetime between '${dateType[0]}' AND '${dateType[1]}'
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )
 	              ORDER BY  datetime ASC
 	              LIMIT ${pageStart}, ${pages}
 	              `
      const _sqlnum = `SELECT count(id) as num
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
                AND datetime between '${dateType[0]}' AND '${dateType[1]}'
                AND operater='${right}'
                AND
 	              NOT EXISTS (
 		            SELECT
 			          1
 		            FROM
			          mf_customer 
 		            WHERE
 			          phone = b.phone
 		            AND datetime > b.datetime
 	              )`
      const queryrecord = query(_sql)
      const querynum = query(_sqlnum)
      return Promise.all([queryrecord, querynum])
    }
  }
}

module.exports = {
  getRecord

}
