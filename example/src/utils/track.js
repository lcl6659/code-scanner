import {
  logEvent as pushEvent,
  setUserProps,
  // setUserId,
  init as trackInit,
} from 'jlgldb-track'
import { config } from '@/config'
import { userInfoHandler } from '@/storeCacher'
import store from '@/store'
import { isGGR } from '@/utils'
import { BRIDGE } from '@/bridge'

export const track = (
  evtName = '',
  opts = {},
  userproperty = {},
  useBaseProps = true,
  callback
) => {
  let { baseTrackProps } = store.getters
  let eventProps = useBaseProps
    ? {
        ...baseTrackProps,
        ...opts,
      }
    : { ...opts }
  let { _id } = userInfoHandler || {}
  let userTrackProps = store.state.userTrackProps
  let userProps = {
    UID: _id,
    'User ID': _id,
    ...userproperty,
    ...userTrackProps,
  }
  if (isGGR()) {
    BRIDGE.log({
      event: evtName,
      props: eventProps,
    })
  } else {
    setUserProps(userProps)
    console.log(evtName, eventProps)
    pushEvent(evtName, eventProps, callback)
  }
}

export const initTrack = (_id) => {
  let userID = _id || 'NA'
  trackInit(config.amplitudeid, userID)
}
