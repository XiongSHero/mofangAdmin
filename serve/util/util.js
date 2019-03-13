const crypto = require('crypto')
module.exports = {
  md5 (str) {
    if (typeof str !== 'string') str = String(str)
    return crypto.createHash('md5').update(str).digest('hex')
  },
  monthDay (date) {
    const ms = Date.parse(date)
    const dateGet = new Date(ms)
    return '' + (dateGet.getMonth() + 1) + '月' + dateGet.getDate() + '日'
  }
}
