import { get } from './base'

interface IPromise {
  [key: string]: {
    [key: string]: any
  }[]
}

export const getTopList = (): Promise<IPromise> => {
  return new Promise((resolve, reject) => {
    get('/api/getTopList')
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
