/*
 * 该文件是运行在 Node.js 端的，获取数据的基本的思路就是后端代理，即提供接口路由供前端页面使用，然后在路由内部，我们接收到前端请求后，再发送 HTTP 请求到第三方服务接口，携带相应的请求参数，包括签名的参数字段等等。
 * 对于从第三方接口返回的数据，我们会做一层数据处理，最终提供给前端的数据前端可以直接使用，无需再处理。这样也比较符合真实企业项目的开发规范，即数据的处理放在后端做，前端只做数据渲染和交互。
 */

const axios = require('axios')

// 获取签名方法
const getSecuritySign = require('./sign')

const ERR_OK = 0
const token = 5381

// 歌曲图片加载失败时使用默认图片
const fallbackPicUrl = 'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'

// 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  needNewCode: 0,
  format: 'json',
  platform: 'yqq.json'
}

// 获取一个随机数值
function getRandomVal(prefix = '') {
  return prefix + (Math.random() + '').replace('0.', '')
}

// 获取一个随机 uid
function getUid() {
  const t = (new Date()).getUTCMilliseconds()
  return '' + Math.round(2147483647 * Math.random()) * t % 1e10
}













