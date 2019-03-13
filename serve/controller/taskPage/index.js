const pool = require('../../db/mysql')
const { query } = pool
/* 获取任务（所有或者今天的） */
/* eslint-disable */
const getAllTask = (val) => {
  const { right, date, page } = val
  let pageStart = (page - 1) * 10
  const pages = 10
  if (right === 'admin') {
    switch (date) {
      case 'all':
        const _sql = `select  a.id, a.client, a.clientphone, a.state, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime
                from mf_task a left join mf_customer b on a.clientphone=b.phone
                WHERE state!='2'  
								AND description is NULL
								UNION ALL
								(SELECT a.id, a.client, a.clientphone, a.state,  b.description,b.datetime
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND state!='2'
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
								)
								ORDER BY datetime ASC
                LIMIT ${pageStart},${pages}
                ` // 查找全部的
        const _sqlnum = `SELECT count(id) as num
                FROM mf_task 
                WHERE state!='2' 
 	              ` // 最新的描述的个数
        const sqlalltask = query(_sql)
        const sqlnum = query(_sqlnum)
        return Promise.all([sqlalltask, sqlnum])
        break
      case 'today':

        const _sqltoday = `select  a.id, a.client, a.clientphone, a.state, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime
                from mf_task a left join mf_customer b on a.clientphone=b.phone
                WHERE state!='2'
								AND description is NULL
								UNION ALL
								(SELECT a.id, a.client, a.clientphone, a.state,  b.description,b.datetime
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND date(datetime)=curdate()
								AND state!='2'
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
								)
								ORDER BY datetime ASC
                LIMIT ${pageStart},${pages} ` // 最新的描述
        const _sqltodaynum = `SELECT COUNT(id) as num FROM (
                select  a.id
                from mf_task a left join mf_customer b on a.clientphone=b.phone
                WHERE state!='2'
								AND description is NULL
								UNION ALL
								(SELECT a.id
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND date(b.datetime)=curdate()
								AND a.state!='2'
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
								) 
                ) c
 	              ` // 最新的描述的个数
        const sqltodaytask = query(_sqltoday)
        const sqltaodynum = query(_sqltodaynum)
        return Promise.all([sqltodaytask, sqltaodynum])
        break
    }
  } else {
    switch (date) {
      case 'all':
        const _sql = `select  a.id, a.client, a.clientphone, a.state, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime
                from mf_task a left join mf_customer b on a.clientphone=b.phone
                WHERE state!='2'
                AND operater='${right}'
								AND description is NULL
								UNION ALL
								(SELECT a.id, a.client, a.clientphone, a.state,  b.description,b.datetime
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND state!='2'
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
								)
								ORDER BY datetime ASC
                LIMIT ${pageStart},${pages}
                       ` // 查找全部的
        const _sqlnum = `SELECT COUNT(id) as num FROM (
                select  a.id
                from mf_task a left join mf_customer b on a.clientphone=b.phone
                WHERE state!='2'
                AND operater='${right}'
								AND description is NULL
								UNION ALL
								(SELECT a.id
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND date(b.datetime)=curdate()
								AND a.state!='2'
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
								) 
                ) c
 	              ` // 最新的描述的个数
        const sqlalltask = query(_sql)
        const sqlnum = query(_sqlnum)
        return Promise.all([sqlalltask, sqlnum])
        break
      case 'today':
        const _sqltoday = `select  a.id, a.client, a.clientphone, a.state, b.description, DATE_FORMAT(datetime,'%Y-%m-%d %H:%i:%s') as datetime
                from mf_task a left join mf_customer b on a.clientphone=b.phone
                WHERE state!='2'
                AND operater='${right}'
								AND description is NULL
								UNION ALL
								(SELECT a.id, a.client, a.clientphone, a.state,  b.description,b.datetime
                FROM mf_task a, mf_customer b
                WHERE a.clientphone = b.phone
								AND date(datetime)=curdate()
								AND state!='2'
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
								)
								ORDER BY datetime ASC
                LIMIT ${pageStart},${pages} ` // 最新的描述
        const _sqltodaynum = `SELECT count(id) as num
                FROM mf_task
                WHERE state!='2'
                AND operater='${right}'
                 AND date(tasktime)=curdate() 
 	              ` // 最新的描述的个数
        const sqltodaytask = query(_sqltoday)
        const sqltaodynum = query(_sqltodaynum)
        return Promise.all([sqltodaytask, sqltaodynum])
        break
    }
  }
}
/* 添加任务结果和任务计划 */
const addResultAndPlan = (val) => {
  const { state, clientphone, description } = val
  const _sqlstate = `update mf_task set state='${state}' where clientphone=${clientphone}`
  if (state !== 2) {
    const _sqladd = `insert into mf_customer (phone, description, datetime, category) values (?,?,?,?)`
    let result = [description[0].clientphone, description[0].description, description[0].datetime, description[0].category]
    let plan = [description[1].clientphone, description[1].description, description[1].datetime, description[1].category]
    const querystate = query(_sqlstate)
    const queryresult = query(_sqladd, result)
    const queryplan = query(_sqladd, plan)
    return Promise.all([querystate, queryresult, queryplan])
  } else {
    const _sqladd = `insert into mf_customer (phone, description, datetime, category) values (?,?,?,?)`
    let result = [description[0].clientphone, description[0].description, description[0].datetime, description[0].category]
    const querystate = query(_sqlstate)
    const queryresult = query(_sqladd, result)
    return Promise.all([querystate, queryresult])
  }
}
module.exports = {
  getAllTask,
  addResultAndPlan
}
