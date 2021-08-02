import { setUserId } from 'jlgldb-track'
import { configSentry } from './sentryTrack'
import API from '@/api/api'
import { isWeChat } from '@/utils'

export const userInfoSideEffect = (_id) => {
  if (_id) {
    isWeChat() && API.bindAuthSelf({ uid: _id })
    setUserId(_id)
    configSentry(_id)
    // initTrack(_id)
  }
}
