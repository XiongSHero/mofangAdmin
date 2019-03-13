const Koa = require('koa')
const app = new Koa()
const cors = require('koa-cors')
const bodyparser = require('koa-bodyparser')
const indexRoute = require('./router/index')
const config = require('./config/config')
/* 跨域 */
app.use(cors())
app.use(bodyparser())

/* 路由 */
app.use(indexRoute.routes()).use(indexRoute.allowedMethods())
app.listen(config.port, function () {
  console.log('serve Vist At localhost:3002')
})
