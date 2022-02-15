import { get } from './base'

interface IPromise {
  [key: string]: {
    [key: string]: any
  }[]
}

export const getTopList = () => {
  return new Promise<IPromise>((resolve, reject) => {
    get('/api/getTopList')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
