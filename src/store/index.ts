//第一步从Vuex中把store这个类型拿到这个类型是用来限制vuex整体这个对象
//里面类型的
//防止usestore名字重复起个别名
import { createStore, Store, useStore as useVuexStore } from 'vuex'

/* 应该把登录所有相关的数据放到vuex中进行管理
包括一些网络请求等登录逻辑也应该放到vuex中
当然vuex中的数据会很多就要分模块进行开发
*/
//定义vuex中的state类型----这个其实就是Module<S, R>中的R根模块里面的state类型

//加入vuex中的类型过多，就会在store文件夹下创立一个types.ts文件专门里面
//放vuex类型的----把类型代码抽取出去
// interface IRootState{
//   data:number
//    name:string
//     age:number

// }
//把抽出去的ts类型再导入进来
import { IRootState, IStoreType } from './types'
import loginModule from './login/login'



/* ******************在根vuex中把外界的模块一个个拿过来************** */
//1-----用户管理数据vuex模块
import systemModule from './main/system/system'






const store = createStore<IRootState>({
  //state应该规定类型，这样别人就不能乱传数据进去了
  //最新版本vuex中state后面跟的是一个函数()=>{}不是一个对象了注意
  //当然在做login登录相关逻辑的时候应该再vuex中单独建立一个文件夹login
  //里面写login的逻辑
  state() {
    return {
      data: 123,
      name: '123',
      age: 18
    }
  },
  getters: {},
  mutations: {},
  actions: {},
  //记住凡是vuex里面的外部模块定义好了都要在根模块里面注册就是真正可以
  //login登录模块使用vuex功能了
  modules: { loginModule,systemModule }
})
/* 在vuex中封装一个函数主要解决用户刷新vuex数据没了,token丢失
或者用户直接输入网址登录也通过token验证的bug问题
*/
//对store里面元素进行初始化在MAIN.TS中调用
// export function setupStore() {
//   store.commit('loginModule/loadLocallogin')
// }

/* 为了让vuex支持TS语法更好用点，封装了一个函数支持usestore()类型 */
export function useStore(): Store<IStoreType> {
  return useVuexStore()
}

export default store
