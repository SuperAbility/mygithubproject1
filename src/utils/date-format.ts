//时间格式化工具的函数工具库的封装
//第一个参数utcString---是服务器返回过来的时间字符串
//2.第二个参数是最后要格式化成什么样子
//别人参数可传可不传，所以在上面定义一个变量
//dayjs这种第三方库使用非常简单安装完了，直接导入函数就可以使用
//这个类里面的方法
import dayjs from 'dayjs'
/* 要想支持utc格式时间转换，必须先导入一个utc函数从它库里面插件中 */
import utc from 'dayjs/plugin/utc'
//把utc加入到utc里面去---dayjs里面扩展方法扩展一个工具进去
dayjs.extend(utc)
const DATA_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
//这个是针对服务器返回的utc时间格式进行处理
export function formatUtcString(
  utcString: string,
  formatType: string = DATA_TIME_FORMAT
) {
  /* 1-----这个里面一方面是自己手写转换代码
第二个用dayjs库去实现格式化转换
注意在项目中用什么库就用Npm 安装什么库

*/
  //utc格式dayjs的使用，就是把默认dayjs不支持utc转换
  //先把utc拿出来加入到dayjs,再用dayjs.utc（）
  //使用是把前面utc字符串进行转换的结果调用 format函数对
  //格式化成什么类型的类型进行格式化
  return dayjs.utc(utcString).format(formatType)
}
//如果服务器返回的时间格式是时间戳的话在用下面这个函数
export function formatTimeStamp(
  timestamp: number,
  formatType: string = DATA_TIME_FORMAT
) {
  /* 1-----这个里面一方面是自己手写转换代码
第二个用dayjs库去实现格式化转换
注意在项目中用什么库就用Npm 安装什么库

*/
  //utc格式dayjs的使用，就是把默认dayjs不支持utc转换
  //先把utc拿出来加入到dayjs,再用dayjs.utc（）
  //使用是把前面utc字符串进行转换的结果调用 format函数对
  //格式化成什么类型的类型进行格式化
  return dayjs.unix(timestamp).format(formatType)
}
