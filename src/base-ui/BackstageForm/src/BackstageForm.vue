<template>
  <div class="BackForm">
    <!--有的表单上面有header这块标题内容有的没有该怎么处理
其实就是公共部分的提取---用插槽-->
    <div class="header">
      <slot name="header"></slot>
    </div>
    <el-form :label-width="labelWidth">
      <el-row>
        <!--拿到了父组件定义的根据input多少数组里面全是input属性验证规则的对象
        导入从而遍历出来动态决定这个里面有几个遍历出来摆放就行了
比如在其他菜单项里面遇到这块直接把这个公共组件导入
把配置项里面的对象修改再遍历不就是立马另外一个这个做出来了
        -->
        <template v-for="item in formItems" :key="item.label">
          <el-col v-bind="collLayOut">
            <!--表单标签里面的属性动态传值也分2种：
一种就是:label="item.label":rules="item.rules"
label和rules这两个属性都是在配置项对象里面定义好的，所以props直接传递过去
接收外界不同父组件传值决定

第二种就是：像itemStyle这个属性根本就不在定义的好配置项对象中
但是它也是表单里面的额外样式
所以用:style动态的绑定属性，传递样式，不需要再每个配置项里面定义
就能达到全局一样风格的效果

          -->
            <el-form-item
              :label="item.label"
              :rules="item.rules"
              :style="itemStyle"
            >
              <!--<el-input ></el-input>这个不能写成固定的要动态的-->
              <!--就要采用类型if判断枚举方法单独加载不同的组件
  因为password也是input里面的所以v-if="item.type==='input'||item.type==='password'"
  判断2个
             -->
              <template
                v-if="item.type === 'input' || item.type === 'password'"
              >
                <!--只要是条件里面的类型之一都放到el-input中
但是password要显示隐藏密码属性 :show-password="item.type==='password'"
这个属性要不要加到el-input上面看他的类型是否password
                -->
                <!--  v-model="name"这个属性的作用是使得所有表单标签
上面用户输入的value值获取到

但是还是那句话这个表单是整个项目中公共的表单，它里面任何属性值
都应该由用这个表单的组件传递过来决定

比如现在用这个封装的表单是user.vue里面上面name属性不应该是在
这个Backstageform.vue里面定义一个变量去接收，这样外界所有用到
这个表单的组件里面的v-model都是一样的值XXXXX

也就是V-model中的值还是定义在props属性里面由用它的父组件
去动态传递 -->
                <!--  v-model="formData[`${item.filed}`]"的意思是根据
formitem里面的filed这个字段区分
每个formData定义这些的绑定value值进行一一匹配
从而实现你在任意表单上面绑定接收value的那些属性对应的就是那些定义的
对应的Input

同时formData这个是所有表单value值属性合体
那怎么区分哪个值取出来放到哪个表单value中了
就是利用formData[id]-----formDta.id
记住在JS中取出对象里面的值一个是点.语法（这种里面的值不能是动态的是对象里
这个里面写固定的不能由外界传递修改

而数组取对象里面的值好处在于里面值可以由外界传递
"formData[`${item.filed}`]"formData现在
就是取出里面id,username.....这些属性对吧---放到
对应的input输入框中绑定
而field属性如果后面的值就是formData里面一个个属性
那么v-model="formData[`${item.filed}`]"
这一句话既可以把formData对象里面接收value值
属性和formitem里面对象一个个匹配起来
又可以取出对应值-----一举二得
 -->
                <!--   v-model="formData[`${item.field}`]"
  第二种实现数据绑定的方案：这一块其实可以不用双向绑定
  把这句代码v-model="formData[`${item.field}`]"
  全部换成  :model-value="modelValue[`${item.field}`]"
  普通的传值单向绑定，就是直接从中间层公共大表单组件
  把formData这个对象传递过来
:model-value="modelValue[`${item.field}`]"
     @upadate:modelValue="hadleValueChange"
     这两句话合起来就是v-model的作用
     只不过现在把v-model语法糖拆解下来，单独一句句处理
   -->
                <el-input
                  :placeholder="item.placeholder"
                  v-bind="item.otherOptions"
                  :show-password="item.type === 'password'"
                  :model-value="modelValue[`${item.field}`]"
                  @update:modelValue="hadleValueChange($event, item.field)"
                ></el-input>
              </template>
              <template v-else-if="item.type === 'select'">
                <el-select
                  :placeholder="item.placeholder"
                  style="width: 100%"
                  v-bind="item.otherOptions"
                  :model-value="modelValue[`${item.field}`]"
                  @update:modelValue="hadleValueChange($event, item.field)"
                >
                  <!--里面的选项也是要根据配置传递来的数据遍历出来-->
                  <el-option
                    v-for="option in item.options"
                    :value="option.value"
                    :key="option.value"
                    >{{ option.title }}
                  </el-option>
                </el-select>
              </template>
              <template v-else-if="item.type === 'datepicker'">
                <!--那怎么把item.otherOptions这些特殊的属性全部绑定到标签上
              用v-bind:对象-->
                <el-date-picker
                  style="width: 100%"
                  v-bind="item.otherOptions"
                  :model-value="modelValue[`${item.field}`]"
                  @update:modelValue="hadleValueChange($event, item.field)"
                ></el-date-picker>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <!--表单下面有按钮无按钮的还是用插槽-->
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue'
//把这个公共组件里面的类型导入进来
import { IFormItem } from '../types'
export default defineComponent({
  /* 那props怎么根据传递的属性数组类型来确定里面放什么东西了
在Vue3+ts语法中有一个PropType类型
  */
  props: {
    /* 其实在前端公共的组件里面所有标签上面的属性接收的值都应该定义在这个props里面
这样才能由不同外界组件动态决定变化
formData老师改变了顺序先在父组件里面把所有传递的值定义到一个对象里面去了
再有子组件定义属性接收
*/

    /* 虽然说现在在父组件里面定义的formData响应式对象和
表单输入框一个个值全部双向绑定起来了，也OK了

但是ESLINT检测工具 v-model="formData[`${item.field}`]"
对这行代码检测会报错“no/vue-nomo prop *不可变的prop错误
什么意思：意思就是你现在是通过在表单组件修改表单组件props里面
定义的属性formData对象来实现的功能

但是官方定义在子组件中不要修改props中属性值---破坏了数据单向数据流的
设计原则
单向数据流设计原则：
就是父组件传递给子组件里面子组件接收的数据
都应该在子组件script标签里面用emit（）发射事件
给父组件，让父组件去修改里面值
/

   formData: {
      type: Object,
      require: true
    },
    //参数是formitems
    formItems: {
      type: Array as PropType<IFormItem[]>,
      //vue3+ts里面规定如果default后面是一个数组或者对象必须用箭头函数
      //可以用到里面的上下文this
      default: () => []
    },
    /* 那怎么把表单里面的表单项里面的label宽度变成动态的用props传递属性 */
    //1-------以下这种通过props去接收父组件值对象 formData
    //是不考虑单向数据流设计原则，子组件直接修改父组件里面传递值
    /*  formData: {
      type: Object,
      require: true
    }, */
    //2-----第二种考虑数据单向流设计原则,父组件里面子组件
    //上面用v-model:"formData"组件的双向绑定
    //这个时候这个里面传过来值就不是formData而是
    //Vue组件双向绑定系统提供的这个关键字属性了 modelValue
    modelValue: {
      type: Object,
      require: true
    },
    //页面出现formitems:[object,object]错误原因
    //底下这个formitems属性没哟定义
    formItems: {
      type: Array as PropType<IFormItem[]>,
      default: () => []
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    itemStyle: {
      //由于每个表单项的样式风格都一样，所以itemStyle这个属性不需要放到配置参数
      //属性数组中每个对象里面去了-----这个是设计每个item不一样的
      //既然全部一样就把itemStyle这个属性单独设置到props里面
      type: Object,
      default: () => ({ padding: '10px 35px' })
    },
    //高阶组件里面的所有属性都不要写到这个公共组件都应该props出去让外界
    //传值决定，这样这个组件才是一个完全灵活的组件
    //比如响应式布局就是在el-col上面加属性要抽到外面决定
    collLayOut: {
      type: Object,
      default: () => ({
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6,
        xl: 4
      })
    }
  },
  //vue官方在单向数据流设计规则，要求子组件上面使用v-model:
  //组件双向绑定的同时，提供子组件里面接收子组件上面双向绑定
  //值得属性modelValue之外
  //还提供了子组件里面双向绑定有个系统发射的事件update:modelValue
  //现在就是要在这个子组件里面利用这个系统提供的事件发射给父组件
  //实现数据都是在父组件修改
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    /* //当然不是把这个 v-model="formData[`${item.field}`]"
换成v-model="modelValue[`${item.field}`]这么简单
这样做和刚才一样还是子组件上面改变父组件里面的值
*/
    /*
 -------这个是用reactive对象的写法
    const formData = computed({
      //用了ref之后在这个里面不能直接这样写了get: () => props.modelValue,
      //否则和之前一样
      get: () => props.modelValue,
      //也就是把父组件传递过来对象放到get里面
      //页面上使用的是子组件set里面吗拿到父组件里面传递过来值
      //newvalue=父组件传递过来数据
      //父组件传递过来数据在子组件里面用一个变量去接收
      //页面上放的是子组件里面这个新的变量不是父组件值
      //这样一层数据中转就不违背单向数据流设计原则了
      set: (newValue) => {
        emit('update:modelValue', newValue)
      }
    }) */
    /* 现在来一个ref绑定对象这个里面的写法
把原来对象解构出来放到一个{}空对象中变成新对象---复制一个对象
给formData
const formData=ref(props.modelValue)---这样写把原来对象直接拿过来
赋值给formData这样写和刚才的reactive对象中computed计算属性代码一样不行
还是修改的是props.modelValue这个和双向绑定无关
const formData=ref({...props.modelValue})
也就是这个{...props.modelValue}这个对象的修改和原来props.modelValue对象无关联

就是一个对象如果复制一份对象之后，复制的对象修改不会影响原来对象
*/
    /* 看清楚这个formData后面对象是拷贝出来的
    所以后面对象怎么修改formData都不会修改
    const formData = ref({ ...props.modelValue })
 const formData = computed(() => ({ ...props.modelValue }))
    */
    // const formData = ref({ ...props.modelValue })
    /*    watch(
      () => props.modelValue as any,
      (newValue) => {
        console.log(newValue)
        formData.value = { ...newValue }
      }
    ) */

    //现在监听的是子组件状态数据变化，要想办法把子组件状态变化
    //传递给父组件就OK了
    // watch(formData, (newValue) => emit('update:modelValue', newValue), {
    //   deep: true
    // })
    //上面写有点问题因为输入框东西输入的是FormData对象里面的属性发生改变
    //所以要深度监听才行
    const hadleValueChange = (value: any, field: string) => {
      emit('update:modelValue', { ...props.modelValue, [field]: value })
    }

    return {
      /* formData */
      hadleValueChange
    }
  }
})
</script>

<style scoped lang="less">
.BackForm {
  /* 利用el-form-item的margin: bottom 22px;
  人为的顶部加上22px就均匀了 */
  padding-top: 22px;
}
</style>
