const axios = require('axios')

const token = 5381

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

// 请求拦截器
const POST_METHOD = ['POST', 'post', 'PUT', 'put']
const GET_METHOD = ['GET', 'get', 'DELETE', 'delete']
const TIME_OUT = 3 * 1000
const BASE_URL = ''

class HttpRequest {
  constructor () {}
  getInsideConfig (options) {
    let config = {
      timeout: TIME_OUT,
      headers: {
        referer: 'https://y.qq.com/',
        origin: 'https://y.qq.com/'
      }
    }
    if (options.method && GET_METHOD.includes(options.method)) {
      config = {
        ...config,
        params: Object.assign({}, commonParams, options.params)
      }
    } else if (options.method && POST_METHOD.includes(options.method)) {
      config = {
        headers: {
          ...config.headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    }
    return Object.assign(config, options)
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        // 添加全局的loading..
        // 请求头携带token
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      (response) => {
        const { data } = response
        // console.log('返回数据处理', response)
        return response
      },
      (error) => {
        console.log('error==>', error)
        return Promise.reject(error)
      }
    )
  }

  request (options) {
    const instance = axios.create()
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

const http = new HttpRequest()
module.exports = http
