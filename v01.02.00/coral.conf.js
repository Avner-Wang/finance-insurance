'use strict';

module.exports = {
  name: '/insurance', // baseName
  // proxy: 'http://localhost:3008', // 反向代理服务器
  proxy: 'http://m.mtime.cn/Service/callback.mi/Showtime/',
  path: ['/insuranceApi/api/v1/', '/api/'], // api路径
}
