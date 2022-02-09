// 获取签名方法
const getSecuritySign = require('./sign.js')
const http = require('./axios.js')

const ERR_OK = 0
const token = 5381

// 歌曲图片加载失败时使用默认图片
const fallbackPicUrl =
  'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'

// 获取一个随机数值
const getRandomVal = (prefix = '') => {
  return prefix + (Math.random() + '').replace('0.', '')
}

// 获取一个随机 uid
const getUid = () => {
  const t = new Date().getUTCMilliseconds()
  return '' + ((Math.round(2147483647 * Math.random()) * t) % 1e10)
}

// 注册后端路由
function registerRouter (app) {
  registerRecommend(app)
}

// 注册推荐列表接口路由
const registerRecommend = (app) => {
  app.get('/api/getRecommend', (req, res) => {
    // 第三方服务接口 url
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    // 构造请求 data 参数
    const data = JSON.stringify({
      comm: { ct: 24 },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: { async: 1, cmd: 2 },
        module: 'playlist.HotRecommendServer'
      },
      focus: {
        module: 'music.musicHall.MusicHallPlatform',
        method: 'GetFocus',
        param: {}
      }
    })

    // 随机数值
    const randomVal = getRandomVal('recom')
    // 计算签名值
    const sign = getSecuritySign(data)

    // 发送 get 请求
    http
      .request({
        url: url,
        params: {
          sign,
          '-': randomVal,
          data
        },
        method: 'get'
      })
      .then((_res) => {
        const { data } = _res
        if (data.code === ERR_OK) {
          // 处理轮播图数据
          const focusList = data.focus.data.shelf.v_niche[0].v_card
          const sliders = []
          const jumpPrefixMap = {
            10002: 'https://y.qq.com/n/yqq/album/',
            10014: 'https://y.qq.com/n/yqq/playlist/',
            10012: 'https://y.qq.com/n/yqq/mv/v/'
          }
          // 最多取 10 条数据
          const len = Math.min(focusList.length, 10)
          for (let i = 0; i < len; i++) {
            const item = focusList[i]
            const sliderItem = {
              id: item.id,
              pic: item.cover
            }
            // 单个轮播图数据包括 id、pic、link 等字段
            if (jumpPrefixMap[item.jumptype]) {
              sliderItem.link =
                jumpPrefixMap[item.jumptype] + (item.subid || item.id) + '.html'
            } else if (item.jumptype === 3001) {
              sliderItem.link = item.id
            }
            sliders.push(sliderItem)
          }

          // 处理推荐歌单数据
          const albumList = data.recomPlaylist.data.v_hot
          const albums = albumList.map(
            ({ content_id, username, title, cover }) => ({
              id: content_id,
              username,
              title,
              pic: cover
            })
          )
          res.json({
            code: ERR_OK,
            result: {
              sliders,
              albums
            }
          })
        } else {
          res.json(data)
        }
      })
  })
}

module.exports = registerRouter
