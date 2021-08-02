import { isObject } from 'lodash'

/**
 * 手动打点
 * @param {Object} 打点数据: name(错误名称), message(错误显示信息)
 */
export function sentryTrack({ name, message, tags = {} } = {}) {
  if (name && message) {
    const trackData = new Error(message)
    trackData.name = name
    if (isObject(tags)) {
      window.Sentry &&
        window.Sentry.withScope(function (scope) {
          const { level, ...otherTags } = tags
          level && scope.setLevel(level)
          scope.setTags(otherTags)
          window.Sentry.captureException(trackData)
        })
    } else if (tags) {
      throw Error('打点传递参数的tags应该为对象!')
    }
  } else {
    throw Error(
      `打点传递参数格式不对，正确格式为：{name: ${name}, message: ${message}}`,
    )
  }
}

export const configSentry = (_id) => {
  _id && window.Sentry && window.Sentry.setUser({ id: _id })
  // 新监控平台
  try {
    _id && window.JGMonitor && window.JGMonitor.setUsername(_id)
  } catch (error) {
    window.JGMonitor.captureException(error)
  }
}
