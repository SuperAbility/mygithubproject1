//这个里面专门定义这个base-ui相关的类型
//这个传递的就是formitem里面菜单项里面的所有属性
type IFormType = 'input' | 'password' | 'select' | 'datepicker'
export interface IFormItem {
  //首先每个输入框不可能都是文本，可能是选择器，时间，上传文件等等肯定要有类型
  field: string
  type: IFormType
  label: string
  rules?: any[]
  placeholder?: any
  //决定下拉列表里面项的类型
  options?: any[]
  //针对一些特殊的属性来一个otheroptions
  otherOptions?: any
}
/* 把所有表单里面的属性由外界传递的属性合并到一起 */
export interface IForm {
  //这个field字段属性的作用就是把配置文件里面对象和外界定义的值一一对应起来
  formItems: IFormItem[]
  labelWidth?: string
  itemStyle?: any
  collLayOut?: any
}
