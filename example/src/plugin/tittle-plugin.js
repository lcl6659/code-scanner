import { isWeChat } from '@/utils/util'
document.setTitle = function (t) {
  document.title = t
  var i = document.createElement('iframe')
  i.src = '//m.baidu.com/favicon.ico'
  i.style.display = 'none'
  i.onload = function () {
    setTimeout(function () {
      i.remove()
    }, 9)
  }
  document.body.appendChild(i)
}
export default function install(Vue) {
  Vue.mixin({
    created() {
      if (this.$options.title) {
        if (isWeChat() && this.$options.title) {
          document.title = this.$options.title
        }
      }
    },
  })
}
