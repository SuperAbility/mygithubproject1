const path=require('path');
// const Components = require('unplugin-vue-components/webpack')
// const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')



module.exports = {
  lintOnSave: false,
  // publicPath: './',
  //方式一：直接通过CLI提供给我们的选项来配置vue下面webpack里面的配置

  /* 方式二：通过configureWebpack修改webpack的配置：

* 可以是一个对象，直接会被合并；
* 可以是一个函数，会接收一个config，可以通过config来修改配置； */
  configureWebpack: {
    resolve: {
      alias: {
        components: '@/components'
      }
    }
  },
/* 登录接口进行网络请求的时候出现跨域访问的问题解决方案：
在开发阶段跨域的问题是通过webpack-----proxy解决
在部署到服务器上面跨域的问题----通过ngix解决
*/
devServer:{
  proxy: {
    '^/api': {
      //接口地址http://152.136.185.210:7878/api/hy66
      target: 'http://152.136.185.210:7878/api/hy66',
      pathRewrite: {
        '^/api':''
      },
      changeOrign:true
  }
  },
  // historyApiFallback:true

},



  /* 自动引用elementplus的按需组件样式和组件 */
  //    plugins: [
  //   Components({
  //     resolvers: [ElementPlusResolver()],
  //   }),
  // ],


  // configureWebpack: (config) => {
  //   config.resolve.alias = {
  //     '@': path.resolve(__dirname, 'src'),
  //     views: '@/views'
  //   }
  // },
  /* 方式三：通过chainWebpack修改webpack的配置：

 * 是一个函数，会接收一个基于
  [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain)
  的config对象，可以对配置进行修改；链式编程多个set里面是多个对webapck里面的配置 */
  // chainWebpack: (config) => {
  //   config.resolve.alias.set
  //     ('@', path.resolve(__dirname, 'src')).set('views', '@/views')

  // }

}
