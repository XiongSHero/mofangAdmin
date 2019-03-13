const config = {
  // 启动端口
  port: 3002,

  // 数据库配置
  database: {
    DATABASE: 'mofang_admin',
    USERNAME: 'root',
    PASSWORD: 'root',
    PORT: '3306',
    HOST: 'localhost'
  },
  // 客户意愿 [0, 1, 2, 3] 分别是已成交，有意向，已拒绝，未联系
  DESIRE: ['0', '1', '2', '3']
}

module.exports = config
