//真正的网络请求的地方
import axios from 'axios'
/* 抽出去的类型放的文件，要从那个文件里面把类型再导入进来
才能保证代码正常运行
 */
import { axiosRquestInterceptors, axiosRquestConfig } from './type'
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
//就是在配置config里面加个hook属性，但是AxiosRequestConfig这个里面根本没有
//hook传hook报错，所以就要自己定义类型
//HOOK和拦截器Interceptors一个意思
//拦截器都要设置成可选的，否则实例里面拦截器每次都要四个一起传才行
//其实用到几个拦截器是根据情况的或者这个网络请求根本就用不到拦截器功能
//所以拦截器选项是可选的

/* 把TS声明的类型和封装的逻辑放在一起会乱，所以TS的类型声明单独抽出去 */
//封装的逻辑部分

//从element中导入loading组件实现动画
/* 最新的版本el-loading它的类型不是老师上课讲的 ILoadingOptions
而是ILoadingInstance这个类型，而且路径也变了

遇到第三方库如果里面不能直接取出类型的，就要手动的去node_modules里面
找到库的文件夹去找到类型文件导入进来
*/
import { ILoadingInstance } from 'element-plus/lib/components/loading/src/loading.type'
import { ElLoading } from 'element-plus'
/* 要去找一下ILoadingOptions这个类型在哪里，因为这个在element-plus里面导入不成功 */
const isLoading = true //设置这个常量是针对showLoading的true状态统一修改
class axiosRquest {
  instance: AxiosInstance
  //这样在这个实例中别人就可以传入intercep拦截器属性了
  //如果没有拦截器这个属性应该可以不传这个也是可选的
  interceptors?: axiosRquestInterceptors
  /* 因为要移除loading在请求成功所以要把loading保存 */
  loading?: ILoadingInstance
  /* 在axios第三库封装的结构体里面每增加一个变量，都事先在上面声明一下保存状态 */
  showLoading: boolean
  /* 既然 AxiosRequestConfig类型里面没有拦截器四种类型配置属性
那么就想办法让一个类型继承AxiosRequestConfig 那这个类型就可以替换掉
AxiosRequestConfig
上面axiosRquestConfig里面属性进行扩展继承自拦截器类型
那么这个config里面就可以传拦截器相关属性了
  */
  constructor(config: axiosRquestConfig) {
    this.instance = axios.create(config)
    //??前面值如果是undefinde或者null就给个true
    this.showLoading = config.showLoading ?? isLoading
    //对interceptors进行保存
    /*1-------- 记住这个里面是每个实例一个对象，所以在构造器里面的刚才封装的拦截器
都是每个实例对应一个拦截器
不是全局的拦截器-----------------全局的拦截器是全局的实例都可以共用的拦截器

    */
    this.interceptors = config.interceptors
    //在请求网络实例对象中放上不同的拦截器
    //比如这次放的是请求成功拦截器this.interceptors.requestInterceptor
    //比如这次放的是响应成功拦截器this.interceptors.reponseInterceptor
    this.instance.interceptors.request.use(
      //凡是interceptors都是可选的牵涉到都要设置可选项
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    //把响应拦截器全部封装,这样拦截器就是根据别人传进来的拦截器灵活变化
    //而不是固定的
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
    /* -------------------------------------------------------------------------------
    上面是局部的实例对应的自己拦截器-----底下是全局拦截器 */

    //2------------还是在构造器里面添加全局的拦截器
    //每个实例都会调用construcetor构造器，都会创建里面的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        //是否显示动画loading还是在请求成功里面做
        if (this.showLoading) {
          //如果需要动画里面就写这段话
          /* 在请求成功之前添加loading提示，请求完了移除这个组件
        用的是elementplus组件里面loading组件 */
          //那请求结束的状态是什么了？----是在服务器响应数据成功了就请求结束了
          this.loading = ElLoading.service({
            lock: true,
            text: '正在请求当中！',
            background: 'rgba(150,150,150,0.5)'
          })
        } else {
          //如果不需要动画
          this.loading?.close()
        }

        // console.log('所有实例都有的成功拦截器---请求')

        return config
      },
      (err) => {
        console.log('所有实例都有的失败拦截器---请求')
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        //请求完成了移除loading

        this.loading?.close()

        // console.log('所有实例都有的成功拦截器---响应')
        /*  return res这个res不是真正请求数据，是一个axios封装的对象
所以可以全局里面把每次请求到的是真正的数据
       */
        /* 服务器第二种返回的错误是一个空data,给个returnCode状态码错误
判断是在响应的成功里面处理不是失败里面：
原因是:HttpErrorCode这种错误状态只能用响应失败里面的err去取所以放到响应失败里面
       returnCode：这个字段在res.data里面所以放到响应成功里面去做
        */
        const data = res.data
        /*  if (data.returnCode === '-1001') {
          console.log('请求失败')
        } else {
          // return res.data
          return res
        } */
        return res
      },
      (err) => {
        console.log('所有实例都有的失败拦截器---响应')
        //请求失败完成了移除loading
        this.loading?.close()
        if (err.response.status === 404) {
          console.log('请求页面失败')
        }

        return err
      }
    )
  }
  //3----各自网络请求里面的拦截器控制，第一步底下这个config类型不能是默认的
  //里面不能传拦截器,返回值void改成promise
  //这个里面拿到数据是什么类型是请求者自己决定所以给个泛型
  request<T = any>(config: axiosRquestConfig<T>): Promise<T> {
    /* 怎么把封装里面的网络请求数据在外面能够获取到
就是把这个request里面的代码全部剪切掉用return new Promise进行回调
    */
    return new Promise((resolve, reject) => {
      /* 网络请求loading加载的第三种情况：
就是有的请求需要loading动画提示，有的请求不需要loading动画提示
怎么区分？
其实最简单方法就是在请求加入一个属性showLoading:true来控制
axiosRquestConfig里面没有showLoading
利用之前axiosRquestConfig第三方类型继承 axiosRquestInterceptors
只要在这个类型声明加一个showLoading属性即可
*/
      //在request请求对showLoading的值进行处理
      if (config.showLoading === false) {
        this.showLoading = config.showLoading
      }

      //先判断发送网络请求里面有没有requestInterceptor这个函数
      if (config.interceptors?.requestInterceptor) {
        //如果所有的请求是携带的同一个token就在这个全局拦截里面去做
        config = config.interceptors.requestInterceptor(config)
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          //1---------单个请求对数据的处理
          //也可以处理请求的结果
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }

          //因为上面showLoading是false了下一个请求也没有loading，所以每次请求结束的
          //时候要把这个showLoading再设置成true
          this.showLoading = isLoading

          //真实返回的结果是resolve函数返回出去的
          resolve(res)
        })
        .catch((err) => {
          //在请求错误里面也要设置成true
          this.showLoading = isLoading
          reject(err)
        })
    })
    //比如请求的时候有一些共用的逻辑要写到拦截器里面
    //但是每个请求对应的拦截器拦截内容是不一样的
  }
  /* 当然别人可能传的get post 请求所以要继续封装 */
  get<T = any>(config: axiosRquestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }
  post<T = any>(config: axiosRquestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
  delete<T = any>(config: axiosRquestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
  patch<T = any>(config: axiosRquestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}
//封裝的网络请求要导出去外面才能拿到这个函数进行请求结果
export default axiosRquest
