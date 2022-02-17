//这个里面就是放login组件里面的那个验证规则rules的逻辑代码
//在Login-account组件里面的所有输入框验证规则逻辑代码全部放到这个里面来
   export const rules = {
      //这里面就是针对表单中哪些双向绑定的属性进行限制，比如输入框里面用户名name
      //要验证,这里面验证字段是一个数组，里面全是验证规则，全是一个个对象
      /*
 name: [
   对象原因是每个规则会有一些额外提示功能所以写到对象里面
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 5,
            message: 'Length should be 3 to 5',
            trigger: 'blur',
          },
        ],

*/
      name: [
        //1------这个是用户名的输入框值验证的第一个规则
        {
          //必传的
          required: true,
          //不符合规则提示信息
          message: '用户名必传',
          //触发验证规则时间 blur---失去焦点的时候验证规则
          //change：只要修改了内容获得焦点
          //时候验证规则----就是你输入名字时候验证规则还是离开输入框验证
          tigger: 'blur'
        },

        //2------这个是用户名的输入框值验证的第2个规则
        {
          //对name这个属性进行正则验证规定长度
          pattern: /^[a-z0-9A-Z]{5,10}$/,
          message: '用户名必须是5-10个字母或者数字',
          //这个在用户输入完在验证
          tigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: '密码是必传的',
          tigger: 'blur'
        },
        -{
          pattern: /^[a-z0-9A-Z]{5,}$/,
          message: '密码必须是3位以上的数字',
          //这个在用户输入完在验证
          tigger: 'blur'
        }
      ]
    }
