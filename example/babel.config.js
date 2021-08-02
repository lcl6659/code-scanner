module.exports = {
  presets: [['@vue/app', { useBuiltIns: 'entry' }]],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true,
      },
      'vant',
    ],
    [
      'import',
      {
        libraryName: 'components',
        camel2DashComponentName: false,
        style: true,
      },
    ],
    [
      'import',
      {
        libraryName: 'vcomp',
        libraryDirectory: 'lib',
        camel2DashComponentName: false,
        style: true,
      },
      'vcomp',
    ],
  ],
}
