// 获取签名方法
const getSecuritySign = require('./sign.js')
const http = require('./axios.js')
const pinyin = require('pinyin')

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
  registerSingerList(app)
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

// 注册歌手列表接口路由
const registerSingerList = (app) => {
  app.get('/api/getSingerList', (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
    const HOT_NAME = '热'

    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: {
          area: -100,
          sex: -100,
          genre: -100,
          index: -100,
          sin: 0,
          cur_page: 1
        }
      }
    })
    const randomKey = getRandomVal('getUCGI')
    const sign = getSecuritySign(data)

    http
      .request({
        url: url,
        params: {
          sign,
          '-': randomKey,
          data
        },
        method: 'get'
      })
      .then((_res) => {
        const { data } = _res
        if (data.code === ERR_OK) {
          // 处理歌手数据
          const singerList = data.singerList.data.singerlist

          // 构造歌手 Map 数据结构
          const singerMap = {
            hot: {
              title: HOT_NAME,
              list: map(singerList.slice(0, 10))
            }
          }

          // 处理歌手数据，将其按字母归类到 Map 中
          singerList.forEach((item) => {
            // 把歌手名转成拼音
            const p = pinyin(item.singer_name)
            if (!p || !p.length) {
              return
            }
            // 获取歌手名拼音首字母
            const key = p[0][0].slice(0, 1).toUpperCase()
            if (key) {
              // 歌手map中没有该字母就添加
              if (!singerMap[key]) {
                singerMap[key] = {
                  title: key,
                  list: []
                }
              }
              // 每个字母下的歌手加入该字母中
              singerMap[key].list.push(map([item])[0])
            }
          })

          // 热门歌手
          const hot = []
          // 字母歌手
          const letter = []

          // 遍历处理 singerMap, 让结果有序
          for (const key in singerMap) {
            const item = singerMap[key]
            if (item.title.match(/[a-zA-Z]/)) {
              letter.push(item)
            } else if (item.title === HOT_NAME) {
              hot.push(item)
            }
          }

          // 按字母排序
          letter.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
          })

          res.json({
            code: ERR_OK,
            result: {
              singers: hot.concat(letter)
            }
          })
        } else {
          res.json(data)
        }
      })
  })
  // 做一层数据映射，构造单个 singer 数据结构, 返回一个数组
  const map = (singerList) => {
    return singerList.map(
      ({ singer_id, singer_mid, singer_name, singer_pic }) => ({
        id: singer_id,
        mid: singer_mid,
        name: singer_name,
        pic: singer_pic.replace(/\.webp$/, '.jpg').replace('150x150', '800x800')
      })
    )
  }
}

module.exports = registerRouter
