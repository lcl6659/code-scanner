import { cacheQueryKeys, getAllQuery } from '@/utils'
import API from '@/api/api'
// import { setGeneralUserInfo } from '@/pages/GeneralPage/utils'
import { userInfoHandler } from '@/storeCacher'
import * as QUERY from '@/config/query'
import { MP_SOURCE } from '@/config'
import { setUserId } from 'jlgldb-track'
/**
 * 获取用户信息Auth
 *
 * @export
 * @param {any} {to, next}
 */

export default async function isUserAuthorized({ to, next }) {
  const checkQuery = async (queryObj, pathName) => {
    const _handleAuth = ({ Auth }) => {
      let ifNormal = !!Auth
      if (ifNormal) {
        const keys = ['Auth', 'auth']
        keys.forEach((key) => cacheQueryKeys.add(key))
        Auth = Auth && decodeURIComponent(Auth)
        userInfoHandler.setUserInfo({ Auth })
      }
      return ifNormal
    }
    const _handleUid = ({ uid, source }, pathName) => {
      const pathNames = ['general-advisor']
      const ifNormal =
        uid && source === MP_SOURCE && pathNames.includes(pathName)
      ifNormal && setUserId(uid)
      return ifNormal
    }
    const _handleSmsuid = async ({ smsuid }) => {
      let ifNormal = !!smsuid
      if (ifNormal) {
        cacheQueryKeys.add('smsuid')
        const [err, data] = await API.getUserInfoBySmsuid(
          { smsuid },
          {
            headers: {
              Authorization: '',
            },
          },
        )
        if (!err && data) {
          userInfoHandler.setUserInfo(data)
        } else {
          ifNormal = false
        }
      }
      return ifNormal
    }
    const _checkIfLogin = () => !!userInfoHandler.ifLogin

    const checkList = [
      _handleAuth.bind(null, queryObj),
      _handleUid.bind(null, queryObj, pathName),
      _handleSmsuid.bind(null, queryObj),
      _checkIfLogin,
    ]

    const sumup = async (checkList) => {
      let ifNormal = false
      for (let i = 0; i < checkList.length; i++) {
        ifNormal = await checkList[i]()
        if (ifNormal) break
      }
      return ifNormal
    }
    return sumup(checkList)
  }

  const { UID, SOURCE } = QUERY
  const { Auth, smsuid } = getAllQuery()

  const ifNormal = await checkQuery(
    { Auth, uid: UID, smsuid, source: SOURCE },
    to.name,
  )
  if (ifNormal) {
    return next()
  } else {
    next({
      path: '/general/login',
      query: {
        ...to.query,
        backurl: encodeURIComponent(location.href),
      },
    })
  }
}
