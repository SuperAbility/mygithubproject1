import { App } from 'vue'
import registerELAPP from './registerELAPP'
//把所有global里面函数统一在这个里面导入调用
import formatTime from './FormatTableTime'
/* 因为index.ts里面不是只做一个elementplus这个组件库样式那么简单
这个里面可能放全局的东西不止一个组件库
还有CSS动画库....，所以单独的看抽出去
*/
export function registerElementPlusAPP(app: App): void {
  //app.use(registerELAPP)-----就等于registerELAPP(app)
  //所以记住一句话在Vue框架里面，任何函数的调用都=app.use(函数名)
  app.use(registerELAPP)
  app.use(formatTime)
}
