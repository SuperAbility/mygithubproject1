//这个文件存在的意义就是把vuex里面过多的类型代码抽取到里面来方便管理
//定义完类型记得导出
/* 在根vuex类型文件里面开始封装自己函数usestore后面的类型 */
import { ILoginState } from './login/loginTypes'
import { ISystemState } from './main/system/systemType'
export interface IRootState {
  data: number
  name: string
  age: number
}

//Root里面根类型
//为了让其他地方在引用这个类型的时候知道里面有哪些模块类型
//你每次定义一个模块都要把模块类型导入进来
export interface IRootWithModule {
  loginModule: any

  systemModule: ISystemState
}

export type IStoreType = IRootState & IRootWithModule
