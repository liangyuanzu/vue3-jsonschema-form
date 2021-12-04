const { mergeProps } = require('@vue/runtime-core')

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [['@vue/babel-plugin-jsx', { mergeProps: false }]]
}
