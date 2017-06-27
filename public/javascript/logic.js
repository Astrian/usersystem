
var post_config = {
    "Content-Type": "application/json"
  }

// 登录页面
var login = new Vue({
  el: '.module_login',
  data: {
    loginInfo: {
      username: '',
      password: ''
    }
  },
  methods: {
    submitLoginInfo(){
      login.$http.post('/interface/login', {
        username: login.$data.loginInfo.username,
        password: login.$data.loginInfo.password
      }).then(res=>{
        window.location.href = '/home';
      }, res=>{
        modal.$data.display('无法登录', res.body.data)
      })
    }
  }
})

// 注册页面
var signup = new Vue({
  el: '.module_signup',
  data: {
    signupInfo: {
      username: '',
      password: '',
      confirmPassword: '',
      email: ''
    }
  },
  methods: {
    submitForSignup(){
        if(signup.$data.signupInfo.password != signup.$data.signupInfo.confirmPassword){
          modal.$data.display('无法注册', '无法确认您的密码输入正确（两次输入的密码不一致）。')
          return
        }
      signup.$http.post('/interface/signup', {
        username: signup.$data.signupInfo.username,
        password: signup.$data.signupInfo.password,
        email: signup.$data.signupInfo.email
      }).then(res=>{
        modal.$data.display('完成', '注册完毕，请使用新的帐户凭据进行登录。')
        var t=setTimeout(function(){
          window.location.href = '/';
        },1000)
      }, res=>{
        modal.$data.display('无法注册', res.body.data)
      })
    }
  }
})

// 用户信息
var user = new Vue({
  el: '.module_userinfo',
  data: {
    user: {}
  },
  methods: {}
})
function loadUserInfo(){
  // 当网页加载完毕后，自动加载用户数据
  user.$http.get('/interface/myinfo').then(res=>{
    user.$data.user = res.body.data
    infoModifier.$data.profile = res.body.data
    if(res.body.data.type == 1) nav.$data.showConsole = true
  },res=>{
    modal.$data.display('无法加载登录用户信息', res.body.data)
  })
}

// 导航栏
var nav = new Vue({
  el: '.module_nav',
  data:{
    showConsole: false,
    now: ''
  }
})

// 信息修改器
var infoModifier = new Vue({
  el: '.module_infoModifier',
  data:{
    profile:{},
    password: '',
    confirmPassword: ""
  },
  methods:{
    submitNewProfile(){
      if (infoModifier.$data.password != ''){
        if(infoModifier.$data.password != infoModifier.$data.confirmPassword){
          modal.$data.display('无法修改资料', '无法确认您的密码输入正确（两次输入的密码不一致）。')
          return
        }
      }
      infoModifier.$http.put('/interface/modifyprofile', {
        username: infoModifier.$data.profile.username,
        email: infoModifier.$data.profile.email,
        bio: infoModifier.$data.profile.bio,
        password: infoModifier.$data.password
      }).then(res=>{
        modal.$data.display('完成', '资料已修改，请等待页面刷新。')
        var t=setTimeout(function(){
          window.location.href = '/';
        },1000)
      },res=>{
        modal.$data.display('无法修改资料', res.body.data)
      })
    }
  }
})

// 用户管理器
var userModifier = new Vue({
  el: '.module_userModifier',
  data:{
    delUser: ''
  },
  methods:{
    delaccount(){
      userModifier.$http.delete('/interface/delspecificaccount?username='+userModifier.$data.delUser).then(res=>{
        modal.$data.display('完成', '该帐户已被删除。')
        var t=setTimeout(function(){
          window.location.href = '/console';
        },1000)
      },res=>{
        modal.$data.display('无法执行操作', res.body.data)
      })
    }
  }
})

// 删除帐户
var delaccount = new Vue({
  el: '.module_delAccount',
  data:{},
  methods:{
    delaccountOps(){
      delaccount.$http.delete('/interface/delmyaccount',{}).then(res=>{
        modal.$data.display('完成', '帐户已被安全删除，感谢使用。')
        var t=setTimeout(function(){
          window.location.href = '/';
        },1000)
      },res=>{
        modal.$data.display('无法删除帐户', modal.$data.display('无法修改资料', res.body.data))
      })
    }
  }
})

// 模态框
var modal = new Vue({
    el: '#modal',
    data: {
      title: '你好世界',
      description: '这是一个测试模态框',
      display(title, description) {
        this.title = title
        this.description = description
        $('#modal').modal('show')
      }
    }
  })
