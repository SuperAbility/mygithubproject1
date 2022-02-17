//axios所以的封装代码都在这个ts文件里面
/*
第一步要想使用某个第三方插件就必须先把它的包从模块中取出
这个import就是带名字的
因为要用axios包赋值一个axios对象（axios本身就是axios的实例）
接下来就是靠axios这个包里面的方法函数进行请求
*/
import axios from 'axios'
/*
axios.get()
axios.post()
axios.request()
axios这些的请求方法返回的是一个Promise对象

http://152.136.185.210:7878/api/hy66注意这个是公共的接口baseURl部分

*/
/* axios的配置选项
http://httpbin.org/比如这个网址是一样的每次都这样写麻烦

*/
axios.defaults.baseURL='http://httpbin.org'

axios.get('http://152.136.185.210:7878/api/hy66/home/multidata', {})
  .then(res => {

console.log(res);
  })
/*
上面baseURL全局配置完之后底下请求就可以简写
有个https://httpbin.org网站里面可以测试接口，模拟一系列接口请求
*/
axios.get('/get', {
  //传递参数到服务器
  params: {
    name: '模拟网络请求',
    age:35
  }
}).then(res => {

console.log(res);
})

//模拟post请求
axios.post('/post', {
 //一般post请求数据是放到data对象中
  data: {
    name: "这是一个测试post请求",
    age:28
  }

}).then(res => {
  console.log(res);

})


/* new Promise<string>((resolve, reject) => {
resolve(123)//这个决定res类型所以res是字符串里面传的是number就错误

}).then(res => {


})
 */

//如果想把多个网络请求的数据全部一次性拿到的话用axios.all
axios.all([
   axios.get('/get',{params:{name:'网络请求1',age:18}}),
   axios.post('/post',{data:{name:'网络请求2',age:38}}),
]).then(res => {
  console.log(res);
})

//请求拦截 发送服务器请求成功的是发送你的网络配置,失败就是错误信息
axios.interceptors.request.use((config) => {
//发送请求到服务器上之前可以携带token进行验证拦截
  //可以进行一些等待动画转圈圈动画效果
  //其实这个里面就是把发送给服务器的网络请求配置属性在这个里面修改
  //把最新的配置config返回给服务器
  console.log("发送服务器配置请求成功");

  return config

}, (err) => {
  console.log("发送服务器配置请求失败");

})
//响应拦截-----就是服务器把返回的数据data返回来过程中拦截
axios.interceptors.response.use((res) => {
//一般响应成功是返回的数据，但是是经过axios处理的数据不是真实数据
  //真实数据是res.data所以你在这个里面就可以统一设置每次
  console.log("响应数据成功");

  //服务器返回的统一数据格式
  return res.data


}, err => {
      console.log("响应数据失败");
return err
})
