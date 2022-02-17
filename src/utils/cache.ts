//把缓存看成一种工具库里面的工具函数进行封装
class LocalCache {
  //1-----保存缓存的方法value: any可能是对象字符串数字所以any
  setCache(key: string, value: any) {
    //因为 window.localStorage.setItem里面value值要求是个字符串
    //但是我们上面定义的value传递过来的可能是任意类型的值
    //那怎么把参数any类型转换成字符串类型JSON.stringify()
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  //2-------获取缓存的方法只需要key就可以了不需要value，获取缓存是通过key获取
  getCache(key: string) {
    //但是这样拿到的value应该是字符串的
    //  return window.localStorage.getItem(key)
    //所以先获取value在进行判断
    const value = window.localStorage.getItem(key)
    if (value !== null) {
      //value值有可能获取不到的，所以要在value有值就是获取到对应本地缓存换成的时候
      //返回value值JSON.parse的意思上面保存缓存的方法中
      //是把任意类型value转换成字符串，比如对象转换成字符串了
      //那么你在获取value值的时候如果想要的是一个对象，而不是对象字符串
      //这个时候就要通过JSON.parse(value)把这个对象字符串value转换成对象
      return JSON.parse(value)
    }
  }
  //3------删除缓存
  deleteCache(key: string) {
    window.localStorage.removeItem(key)
  }
  //清空缓存---里面不用传参数
  clearCache() {
    window.localStorage.clear()
  }
}
export default new LocalCache()
