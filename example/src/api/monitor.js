export const captureHttpException = (error) => {
  if (error.response && error.response.status !== 422) {
    let errInfo = error.response.data || {}
    errInfo._host = error.config.baseURL
    errInfo._method = error.config.method
    errInfo._url = error.config.url
    window.Sentry.captureException(
      `勿惊，业务接口错误监控： ${JSON.stringify(errInfo)}`,
    )
  } else if (error.request) {
    window.Sentry.captureException(`没有返回 response 错误 ${error.message}`)
  } else {
    window.Sentry.captureException(
      `接口没有返回 error.response 和 error.request： ${error.message}`,
    )
  }
}
