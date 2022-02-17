/* 你这种公共的项目在这个项目里面叫这个名字，下个项目里面如果还叫这个名字就会
和其他项目里面的名字组件冲突
一般像这种公共的组件前面都加一个前缀，用来区分项目
my---代表这个项目里面的前缀
*/
import myBackstageForm from './src/BackstageForm.vue'
//统一导出的时候把类型导出去
export * from './types/index'

export default myBackstageForm
