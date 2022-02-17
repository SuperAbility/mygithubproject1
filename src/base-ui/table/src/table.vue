<!--vue在3.2版本开始之后的版本把<script setup></script>顶层
setup标签从实验性的特性变成正式的了
就是比如你用前端vue,react,angular这些框架的脚手架在开发项目
发现你目前的这些版本低于第三方库比如（elementPlus,vant)这些组件库
的版本号----时候不能用库里面的功能怎么办：

第一步：卸载当前的vue -----npm uninstall vue

第二步：重新安装最新的版本npm install vue@next
如果重新安装最新版本通不过
那就强制安装这个版本  npm install vue@next --force

这个里面是所有后台管理系统二级菜单里面的表格展示数据公共封装组件
id: 45,
name: 'zhangsan',
relname: '张三',
cellphone: 13652799562,
enable: 1,
departmentId: 1,
role: 1,
creatAt: '2021-10-18T20:09:15.00Z',
updateAt: '2021-10-20T20:09:15.00Z'-->
<template>
  <!--在el-table外面包裹一层div的作用是为了调整表格距离网页两边的边距
 @selection-change="selectionChange"当用户勾选行的时候
 会触发这个事件

  -->
  <div class="tableContent">
    <!--现在对table表格组件提出更高的需求：
除了里面有一个el-table表格展示数据之外，在这个el-table上面有个header
用来对表格整体的数据新增，删除，刷新等操作的组件


el-table底部还要有一个footer做分页器展示的组件
-->
    <!--表格上面一块进行表格数据的功能扩展
  但是每个表格头部组件里面结构长得都不一样是使用者动态决定里面是哪些结构
  像这种同一区域里面结构不同的展示----插槽-->
    <div class="tableUpHeader">
      <slot name="header">
        <!--一般像表格头部长得90%结构都一样的所以可以给一个全局的默认结构
也就是你们默认结构数据也是由外界别人传进来的-->
        <div class="title">
          {{ title }}
        </div>
        <!--这一块是表格上面头部区域除了左侧标题剩下右侧那块处理数据
         按钮结构-->
        <div class="handler">
          <slot name="headerHandler"></slot>
        </div>
      </slot>
    </div>
    <el-table
      :data="userData"
      border
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <!--来一个打钩的列显示与隐藏
      注意Table-column组件里面针对序号和选择框都给出了
      用type="index"和type="selection"来实现不需要你重复造轮子了
      而且打钩的这一列是没有label标题的，你看到打钩的一列有标题的吗-->
      <el-table-column
        v-if="showSelectColumn"
        type="selection"
        align="center"
        width="60"
      >
      </el-table-column>
      <!--拿到父组件里面定义的配置文件对象之后进行就是遍历展示
      这样以后公共抽取的像form表单组件和table表格组件里面的
    每个组件成部分展示的标签，全是通过外界配置项对象动态生成了
    不需要再这个里面写上很多标签加上标签属性去设置
    就一个组件库标签遍历生成------就这是把标签属性全部抽到配置项里面
    动态生成标签这样布局的高效率开发
       :prop="propItem.prop"
          :label="propItem.label"
          :width="propItem.minWidth"
          这样是把一个配置项里面每个属性进行单独绑定
          其实关于配置项对象里面每个属性全部绑定可以用v-bind="propItem "
          一行代码底下几百行代码
      -->
      <!--这个就是表格里面的id列有的显示有的不显示单独用组件库做一个出来
根据你在user.vue外界父组件里面中定义的属性showIndexColumn动态决定
这个要不要显示-------v-if="showIndexColumn"就动态决定这一列
根据外界父组件传递这个属性值true or false来决定显示还是隐藏-->
      <!--如果设置了type="index"则显示该行的索引（从 1 开始计算）；
      也就是这个index是从1开始自动计算的不需要后端接口单独写个id
      传给你遍历出来放在prop中显示 -->


      <!--   <el-table-column
        v-if="showIndexColumn"
        type="index"
        label="序号"
        align="center"
        width="60"
      ></el-table-column>
 -->
      <!--也就是说表格里面的由配置项生成的表格里面公共的部分el-table-column
下面看大的代码肯定保留
只是在公共的部分上面写一个id组件而已，跟原生的HTML搭建页面结构原理一样-->
      <template v-for="propItem in propList" :key="propItem.prop">
        <!--el-table-column里面列表格里面文字对齐方式通过align属性调整
这个propItem里面数据并不是每次都以普通文本方式展现
可以是全部按钮-----所以这个里面数据应该放到插槽里面
由用组件父组件在table子组件里面传递
el-table-column里面是可以传递插槽的----
这个是elementplus组件库定义好的功能
        -->
        <el-table-column v-bind="propItem" align="center">
          <!--el-table-column 里面插槽可以替换原来显示默认的文本标签展示
        方式
        并且里面展示的是接口数据，不能写成123，应该
        是由外界作用域插槽传递数据进来
#default="scope"-----表格每一行的数据
通过作用域插槽scope外界传递进来拿
{scope.row}}---就是组件库里面插槽里面的参数{row,column,$index}
row代表一行的数据是一个对象
scope.row[propItem.prop]---这样写就是具体每行展示的数据来源
 -->
          <template #default="scope">
            <!-- scope其实就是userData接口里面每一个对象数据
            作用域插槽的目的就是为了拿到接口数据 -->
            <!--     {{ scope.row[propItem.prop] }}这句话一写
        代表表格里面插槽里面的数据全部是统一改变的
        要么全部是安妮，全部是普通文本，全部是超链接-----就不能对插槽里面
        其中一列或者多列数据进行个性化设置
           {{ scope.row[propItem.prop] }}
        -->

            <!--那怎么把插槽里面的数据进行单独抽选几列出来个性化设置
那就是插槽里面的数据还是要放到一个插槽里面
    <slot :name="scope.column">而且插槽的名字不能写成固定值
    因为固定值改的话是改整体不是改局部
    插槽的名字应该是动态绑定上面作用域插槽里面列名
    根据列的名字来决定改哪几列
-->
            <!--其实就是把要修改的那一列或者几列数据在配置项里面
用slotName属性添加进去做为整体插槽的区分
专业到时候插槽名字是动态的获取到整个对象里面有slotName对象的那几列
就行设置，其他几列还是默认值
-->

            <!--现在可以达到数据整体设置风格以及局部设置哪一列或者多列通过插槽里面的插槽名字了
单独控制了
但是状态一栏或者事件里面的数据是假的，怎么拿到真正的状态数据
要在这个最里面插槽里面把行里面数据就是接口里面的数据包含状态,时间这些真正的数据
再传出去到修改插槽组件里面
:row="scope.row"作用域插槽可以拿到组件上面的数据
也可以把数据传递出去上一层
-->
            <slot :name="propItem.slotName" :row="scope.row">
              {{ scope.row[propItem.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>

      <!--表格的最右侧一般是显示对表格的操作列，但这个列可能有的组件有，有的组件没有
这个列里面一般就是编辑和删除2个按钮

-->
    </el-table>
    <!--分页的功能组件--其实每个页面表格底部长什么样子也不太一样，要使用者
    自己来决定还是插槽-->
    <div class="tableDownFooter">
      <slot name="footer">
        <!--一般像表格底部长得90%结构都一样的所以可以给一个全局的默认结构
        默认结构就是elementplus上面的Pagination 分页整个组件
有了组件库像分页的页面结构都不用手动去写了，组件库里面配置好好的
        -->

        <!--
分页器elementPlus属性介绍
v-model:currentPage="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
         :total="400"------总的条数
          -->

        <el-pagination
          :currentPage="page.currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount1"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  //在公共组件使用props目的是为了把user.vue这些使用公共表格组件的组件
  //里面网络请求的数据拿进来展示
  props: {
    title: {
      type: String,
      default: ''
    },
    //这一块是el-table表格上面拿到接口数据进行里面每个表格项的展示数据
    userData: {
      type: Array,
      default: () => []
    },
    /* table里面要接收外界传递过来每个接口JSON数据数组统计值
totalCount1

    */
    totalCount1: {
      type: Number,
      default: 0
    },
    //这一块是里面表格每一列数据展示配置项的数据
    propList: {
      type: Array,
      default: () => []
    },
    //这个table里面要定义一个变量去接收那个变量决定显示不显示
    showIndexColumn: {
      type: Boolean,
      default: false
    },
    //动态决定表格前面的打钩一列显示与隐藏
    showSelectColumn: {
      type: Boolean,
      default: false
    },
    /* 这个是定义page-content上面table组件上面v-model:page="pageInfo"
这个双向绑定为了，table组件上面分页器里面属性
能够和page-content中网络请求数据同步变化

    */
    page: {
      type: Object,
      default: () => ({ currenrPage: 0, pageSize: 10 })
    }
  },
  //通过组件双向绑定update:page把这个事件发射出去，这样在
  //page-content中的table组件上面才能和这个里面分页器数据保持一致
  emits: ['selectionChangeToParent', 'update:page'],
  setup(props, { emit }) {
    //这个方法是用来监听用户的勾选哪一行的事件
    /* selectionChange这个事件其实里面参数是一个数组【】
  value值是记录每个用户点击一个按钮就把哪一行对象加入数组中
  用户取消勾选就把对应行数据从数组中删除
  这样一个操作----我们都知道表格里面行数据---就是构成table组件的
  el-table上面接口返回的那个data数组
  所以value值是记录接口里面的对象随着勾选对应的增加和减少
  */
    const selectionChange = (value: any) => {
      console.log(value) //这个里面数据是放到table组件里面的
      //但是要是真正想拿数据是用table的这些父组件
      //所以在table子组件中要把数据传给父组件发射出去用emit
      emit('selectionChangeToParent', value)
    }
    //分页器组件里面的相关定义变量和方法
    /* 这个是下拉选择多少页码页面要发生改变的事件监听
pageSzie---页码大小

    */
    const handleSizeChange = (pageSzie: number) => {
      //pageSzie可以获取你每次选择页面上面的数字30 50 70
      console.log(`${pageSzie} items per page`)
      /*props.page是组件双向绑定上面你每次操作组件的值对象  */
      console.log(
        props.page,
        'props.page是原来选择页码的值，而后面传的 pageSzie是修改后的值'
      )
      emit('update:page', { ...props.page, pageSzie })
    }
    /* 这个监听每次点击1 2 3这些页面跳转的事件
currentPage是当前页---获取点击第几页
    */
    const handleCurrentChange = (currentPage: number) => {
      /*props.page是组件双向绑定上面你每次操作组件的值对象  */
      console.log(props.page, '这个双向绑定的什么值')
      emit('update:page', { ...props.page, currentPage })
    }

    return {
      selectionChange,

      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style scoped lang="less">
.tableContent {
  padding: 20px;
  border-top: 20px solid #f5f5f5;
}
.tableUpHeader {
  display: flex;
  height: 45px;
  padding: 0 5px;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 20px;
    font-weight: 700;
  }

  .handler {
    align-items: center;
  }
}

.tableDownFooter {
  margin-top: 15px;

  .el-pagination {
    text-align: right;
  }
}
</style>
