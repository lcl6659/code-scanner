import { isWeChat } from '@/utils'
import * as QUERY from '@/config/query'
import { MP_SOURCE } from '@/config'
import countBy from 'lodash/countBy'

const getChannel = () =>
  !isWeChat() ? 'Web' : QUERY.SOURCE === MP_SOURCE ? 'XCX' : 'Wechat'

export default {
  state: {
    oid: '',
    Source: QUERY.SOURCE,
    Channel: getChannel(),
    // 是否需要展示添加学习顾问的挽留弹层
    needBindFollow: true,
    tutorList: [],
  },
  getters: {
    loginBaseTrackOpts(state) {
      return {
        Source: state.Source,
        Channel: state.Channel,
      }
    },
    tutorBaseTrackOpts(state) {
      return {
        Channel: state.Channel,
        OID: state.tutorList.map((item) => item.oid).join(';'),
        Ttype: state.tutorList
          .map((item) => (item.tutorWechat ? 'Personal' : 'Enterprise'))
          .join(';'),
        TID: state.tutorList.map((item) => item.tid).join(';'),
        Subject: state.tutorList.map((item) => item.subjectType).join(';'),
        AssignType: state.tutorList.map((item) => item.assignType).join(';'),
        Numbers:
          countBy(state.tutorList, (item) => {
            return item.tutorBindSet
          })?.false || 0,
      }
    },
    addressBaseTrackOpts(state) {
      return {
        OID: state.oid,
        Channel: state.Channel,
      }
    },
  },
  mutations: {
    set_needBindFollow(state, payload) {
      state.needBindFollow = payload
    },
    set_tutorList(state, payload) {
      state.tutorList = payload
    },
    //低质流量手动获取班主任信息
    set_manualActiveTutor(state, payload) {
      let tutorList = JSON.parse(JSON.stringify(state.tutorList))
      tutorList = tutorList.map((item) => {
        if (item.subjectType === payload.subjectType) {
          item = payload
        }
        return item
      })
      state.tutorList = tutorList
    },
    cacheQuery(state, payload) {
      const { query, keys } = payload
      keys.forEach((key) => {
        const value = query[key]
        if (value && state[key] !== value) {
          state[key] = value
        }
      })
    },
  },
  actions: {},
}
