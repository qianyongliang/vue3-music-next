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
  constructor (baseURL = BASE_URL) {
    this.baseURL = baseURL
    this.queue = {} // 队列中有请求时 显示loadong界面, 反之同理
  }

  getInsideConfig (options) {
    let config = {
      timeout: TIME_OUT,
      headers: {
        referer: 'https://y.qq.com/',
        origin: 'https://y.qq.com/'
      }
    }
    if (options.method && GET_METHOD.includes(options.method)) {
      config = Object.assign(config, options)
      config.params = Object.assign({}, commonParams, config.params)
      return config
    } else if (options.method && POST_METHOD.includes(options.method)) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      return Object.assign(config, options)
    }
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        // 请求头携带token
        // 添加全局的loading...
        // Spin.show() ---遮罩组件
        // 队列中有请求时 显示loadong界面, 反之同理
        if (!Object.keys(this.queue).length) {
          // Spin.show()
        }
        this.queue[url] = true
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      (response) => {
        delete this.queue[url]
        const { data } = response
        // console.log('返回数据处理', response)
        return response
      },
      (error) => {
        delete this.queue[url]
        console.log('error==>', error)
        return Promise.reject(error)
      }
    )
  }

  request (options) {
    const instance = axios.create()
    options = this.getInsideConfig(options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

const http = new HttpRequest()
module.exports = http
