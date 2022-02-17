/* 就是把user.vue里面JS部分代码进行抽取
凡是跟表单结构动态生成的配置抽到search.config.ts文件中
凡是跟表格生成有关的所有配置都抽到这个conten.config.ts中

所谓一个组件里面配置抽取-----配置就是生成某个固定区域页面结构的一些对象

配置抽取就是抽取的那些构成页面结构的对象

比如表单里面生成的Input------就是靠searchFormConfig{}这个对象生成的
所以把这个从user.vue文件中抽取到配置文件中

同理生成表格的配置对象也是一样抽取到这个里面来

*/
/* 对于表格里面那些数据的展示prop和label需要每个去写
存在大量重复代码
而且组件配置项太多的问题要把el-table-column写在标签上面的配置属性
在这个里面定义一个配置对象-----写到对象里面

这样以后不同组件使用表格，表格组件标签里面只要传表格配置对象就可以快速搞定

*/
//这个其实和当初表单里面那些表单input,select组件快速生成采取的手段是一样的
//是利用
/*   <el-table-column prop="id" label="编号" min-width="180" />
就是把el-table-就是把el-table-colum上面的
配置项属性全部变成对象遍历过去展示
这样才是动态的生成表格数据
*/
/* 要想表格插槽里面的数据整体不是一起修改，能够自定义修改哪列
或者哪几列------方法插槽名字不能写固定的
要在插槽配置对象里面加一个属性slotName
就是把表格里面数据列要修改的那几列配置项里面加一个slotName属性
这样到时候插槽只改这三列其他不改
*/
/*表格的最右侧一般是显示对表格的操作列，但这个列可能有的组件有，有的组件没有
这个列里面一般就是编辑和删除2个按钮
老师用的是这一列是用之前配置对象里面加一个对象生成不是直接在table.vue中
再写一个el-table-column

也就是这个里面编辑和删除按钮是根据权限来决定要显示哪个，或者哪几个
所以里面是要给插槽的----
**********************************************************************
为什么序号列和勾选列没用配置对象这样搭建
而这个右侧操作列却用配置对象搭建了原因：

1-------记住序号和勾选列里面的项数据是可以直接从el-table标签属性上面人家
自带的type属性中的index和secltion属性直接搭建的
凡是可以从组件库直接搭建的列不需要传配置项搭建----直接用el-table-column

2------而操作这一列的列数据结构是el-table表格组件里面属性type中没有定义的
要自己定义--------凡是组件库里面没有定义列的数据自己定义的---就是通过配置项

而且配置项才可以利用作用域插槽选中其中某一列进行单独设置插槽扩展
编辑操作按钮是根据权限来的
slotName: 'status'
**********************************************************************
*/
/* 就是每个表格前面的列显示不显示通过定义一个变量配置项来实现
你在这个user界面里面把这个变量显示为true那序号一列就会显示
如果在另外一个页面    const showIndexColumn = false或者不定义这个属性
那序号一列就会隐藏----------就实现了多页面通过一个属性
去配置单独的列显示隐藏
    */
//记住在一个现有结构基础上进行扩展组件，这个组件再不同的组件里面显示和隐藏‘
//方式不一样--------凡是诸如此类的组件设计都是在运用这些组件的父组件里面定义变量
//用v-if绑定这些变量动态决定显示还是隐藏----上面序号列如此
//接下来有的表格前面有打钩的一列有的组件由这列，有的没有这列----做法和序号一样

//现在不是把表格本身加上下两部分结构全部合成一个整体结构吗
//所以里面放的是这些结构里面所有的配置

export const TableContentConfig = {
  title: '用户列表',
  propList: [
    { prop: 'id', label: '序号', 'min-width': 100 },
    { prop: 'name', label: '用户名', 'min-width': 100 },
    { prop: 'relname', label: '真实姓名', 'min-width': 100 },
    { prop: 'cellphone', label: '手机号码', 'min-width': 100 },
    { prop: 'enable', label: '状态', 'min-width': 100, slotName: 'status' },
    { prop: 'departmentId', label: '部门', 'min-width': 100 },
    {
      prop: 'creatAt',
      label: '创建时间',
      'min-width': 200,
      slotName: 'creatAt'
    },
    {
      prop: 'updateAt',
      label: '更新时间',
      'min-width': 200,
      slotName: 'updateAt'
    },

    {
      label: '操作',
      minWidth: '120',
      slotName: 'operation'
    }
  ],
  showIndexColumn: true,
  showSelectColumn: true
}
