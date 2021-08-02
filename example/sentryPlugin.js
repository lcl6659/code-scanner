const { DefinePlugin } = require('webpack')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const RemovePlugin = require('remove-files-webpack-plugin')

const gitRevisionPluginInstance = new GitRevisionPlugin()

// https://github.com/getsentry/sentry-webpack-plugin
const sentryPlugin = ({ env, repo, urlPrefix }) => {
  const release = gitRevisionPluginInstance.commithash() // ** release 版本一定是在 h5/leads/amway 下面发的commit hash，本地测试可以直接 build dev 环境
  const SentryWebpackPluginInstance = new SentryWebpackPlugin({
    include: './build/share/js',
    release,
    setCommits: {
      repo,
      commit: release,
      auto: false,
    },
    deploy: {
      env,
    },
    urlPrefix, // urlPrefix是线上看js的完整路径，必须要设置正确,不然还是会看不到源码
  })
  // test 这里最后只写 production 和 rc 即可, 值和package.json中的值保持一致
  const SentryPlugin =
    ['production', 'prerelease'].indexOf(env) > -1
      ? [
          SentryWebpackPluginInstance,
          // 编译后去掉.map文件 要注意最后要将生成的map文件处理掉，不要留在生产环境，这样做是不安全的。
          new RemovePlugin({
            after: {
              test: [
                {
                  folder: 'build/share',
                  method: (absoluteItemPath) => {
                    return new RegExp(/\.map$/, 'm').test(absoluteItemPath)
                  },
                  recursive: true,
                },
              ],
            },
          }),
          new DefinePlugin({
            'process.env.RELEASE': JSON.stringify(release),
          }),
        ]
      : []

  return [...SentryPlugin]
}

module.exports = sentryPlugin
