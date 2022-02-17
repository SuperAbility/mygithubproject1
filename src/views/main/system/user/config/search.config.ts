//应该把组件里面的配置JS单独建立一个配置文件夹摆放
//这样以后组件里面的配置文件方便管理
import myBackstageForm, {
  IFormItem,
  IForm
} from '@/base-ui/BackstageForm/index'
export const searchFormConfig: IForm = {
  labelWidth: 'auto',
  collLayOut: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 4
  },
  itemStyle: {
    padding: '10px 35px'
  },
  /* 你外界定义一些变量去接收配置文件对应Input框属性一一对应
外界定义的属性怎么和配置文件里面对象匹配起来
是在每个配置对象里面再定义一个属性
  */
  /* 也就是真正成型的作品是：
 定义表单的时候表单里面字段是根据实际搜索的有意义字段
 进行定义的，就是一般用户不会搜索abc  密码 大神这些字段当做
 搜索表格数据的----所以这些没意义的字段不要定义
 ----定义表单的时候注意一下字段和搜索的匹配逻辑性-----------------

 */
  formItems: [
    {
      field: 'id',
      type: 'input',
      label: 'id',
      rules: [],
      placeholder: '请输入id'
    },

    //里面就是一个个配置项就是利用Input标签上面的不同属性传值配置不同的input
    {
      field: 'username',
      type: 'input',
      label: '用户名',
      rules: [],
      placeholder: '请输入用户名'
    },
    //就是这些表单里面的field字段当时是想当然定义的并不是根据
    //表格里面字段实际情况搜索出来的
    //就是很少有人会通过password密码去搜索数据的---所以这些字段名字
    //要记得修改和搜索字段要进行匹配
    {
      field: 'realname',
      type: 'input',
      label: '真实姓名',
      rules: [],
      placeholder: '请输入真实姓名'
    },
    {
      field: 'cellphone',
      type: 'input',
      label: '电话号码',
      rules: [],
      placeholder: '请输入电话号码'
    },
    {
      field: 'enable',
      type: 'select',
      //这个下拉列表里面的项是不固定的不是写固定的
      label: '用户状态',
      rules: [],
      placeholder: '请选择用户状态',
      options: [
        { title: '启用', value: 1 },
        { title: '禁用', value: 0 }
      ]
    },
    {
      field: 'creatAt',
      type: 'datepicker',
      label: '创建时间',
      rules: [],
      //这个时间选择器里面不叫做placeholder
      //其实就是把一些特殊表单的类型用一个  otherOption包装一下
      otherOptions: {
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        type: 'daterange'
      }
    },
    {
      field: 'updateAt',
      type: 'datepicker',
      label: '更新时间',
      rules: [],
      //这个时间选择器里面不叫做placeholder
      //其实就是把一些特殊表单的类型用一个  otherOption包装一下
      otherOptions: {
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        type: 'daterange'
      }
    }
  ]
}
