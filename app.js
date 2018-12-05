//app.js
App({
  globalData: {
    userInfo: null,
  },
  onLoad: function () {
    console.log(app.phone)  
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res =>{
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: '',
            method: 'POST',
            data: {
              // x: '',
              // y: ''
              code: res.code//将code发给后台拿token
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              // 存token
              console.log('token=' + res.data.data.token)
              that.globalData.token = res.data.data.token;//拿到后将token存入全局变量  以便其他页面使用
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
    })
  },
})