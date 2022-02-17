//这个里面把main.ts里面那些组件库里面的代码全部抽到这个里面来
// import 'element-plus/dist/index.css'

//记住在组件根实例app的类型是APP
import 'element-plus/dist/index.css'
import { App } from 'vue'
//注意哦vue3改版之后elementPLus里面的图标要想显示是通过导入的方式显示的
//不是像以前i标签里面写一个class 导入一个类就显示了
//就是每个图标就是一个组件，要导入注册
import { Calendar, Cellphone } from '@element-plus/icons'
//按需引入，别忘记组件中用了新的这个里面没有组件库组件要往这个里面添加
//才会有效果
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElAlert,
  ElAside,
  ElForm,
  ElFormItem,
  ElInput,
  ElAutocomplete,
  ElAvatar,
  ElBacktop,
  ElBadge,
  ElTabs,
  ElTabPane,
  ElIcon,
  ElCheckbox,
  ElLink,
  ElContainer,
  ElHeader,
  ElMain,
  ElMenu,
  ElSubMenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElPagination
} from 'element-plus'

const components = [
  //icon图标组件的注册
  Cellphone,
  ElButton,
  ElTable,
  ElTableColumn,
  ElAlert,
  ElAside,
  ElAutocomplete,
  ElAvatar,
  ElBacktop,
  ElBadge,
  ElTabs,
  ElTabPane,
  ElIcon,
  Calendar,
  ElForm,
  ElFormItem,
  ElInput,
  ElCheckbox,
  ElLink,
  ElContainer,
  ElHeader,
  ElMain,
  ElMenu,
  ElSubMenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElPagination
]
export default function (app: App): void {
  for (const cpn of components) {
    app.component(cpn.name, cpn)
  }
}
