//自动导入APP类型进来这个APP是app对象类型
import { App } from 'vue'
/* app.config.globalProperties
app方法里面有一个API是上面的可以加全局属性，方法
是可以在vue任何地方，包括模板里面直接使用的
比如下面定义一个全局的方法$TimeFilters---是可以任何地方使用的
这样以后任何地方使用到时间格式化----直接调用函数即可
不需要一个个组件里面去修改了，只要修改一处配置全部修改
一般全局的属性以$符号开头，区分平台组件里面的方法名
*/

//这个里面是时间格式化的全局属性封装抽取
//因为这个是从main.ts里面抽取出去的里面会有一个参数就是vue实例

/* 既然里面功能是用dayjs实现的那个utils里面的工具库函数全局封装
那把那个函数导入进来即可 */
import { formatUtcString } from '@/utils/date-format'
export default function formatTime(app: App) {
  app.config.globalProperties.$TimeFilters = {
    //为什么后面是一个对象不是函数，因为对象里面可以放很多不同的函数
    //这样一个属性调用，可以调用里面不同功能的函数实现不同的功能
    //如果是函数它只有函数这一个功能
    formatTime(value: string) {
      //这个才是正题格式化时间函数---value参数是传过来字符串时间
      //你不传参数时间这个函数往什么对象上格式用
      /* 接下来就是对时间进行格式化，因为对时间做格式化是一个非常常见的功能
网上有很多第三方库写好了API直接放入进去使用
但是那些代码要放到utils工具文件夹里面去-----这样方便日后维护
*/
      return formatUtcString(value)
    },
    FilterDate() {
      console.log('这个函数是用来筛选日期的')
    }
  }
}
