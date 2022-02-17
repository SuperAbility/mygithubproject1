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
      field: 'name',
      type: 'input',
      label: '角色名称',
      rules: [],
      placeholder: '请输入角色名'
    },
    {
      field: 'intro',
      type: 'input',
      label: '权限介绍',
      rules: [],
      placeholder: '请输入权限介绍'
    },

    {
      field: 'createTime',
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
    }
  ]
}
