const mysql = require('mysql')
const config = require('../config/config.js')

const pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
})

const query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log('rows:' + JSON.stringify(rows))
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}
module.exports = {
  query
}
