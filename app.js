//app.js
App({
  globalData: {
    userInfo: '',
    baseUrl: 'https://test-m.carexx.cn',
    region: null,
    token: ''
  },
  onLoad: function () {
  },
  onLaunch: function () {
    var that = this;
    this.getuserinfo();
  },
  // 获取用户信息
  getuserinfo:function(){
    var that=this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']){
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              that.globalData.userInfo = res.userInfo
              that.globalData.region = res.userInfo.province + '/' + res.userInfo.city
              //  登录
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  if (res.code) {
                    //发起网络请求
                    wx.request({
                      url: this.globalData.baseUrl+'/auth/login',
                      method: 'POST',
                      data: {
                        code: res.code,//将code发给后台拿token
                        nickname: that.globalData.userInfo.nickName,
                        avatar: that.globalData.userInfo.avatarUrl,
                        sex: that.globalData.userInfo.gender,
                        region: that.globalData.region
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                      },
                      success: function (res) {
                        // 存token
                        console.log('token=' + res.data.data.token)
                        that.globalData.token = res.data.data.token;
                        console.log(this.globalData.token)//拿到后将token存入全局变量  以便其他页面使用
                      },
                    })

                  } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                  }
                }
              })
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            } 
          })
        }
      },
    })
  } ,
  
})