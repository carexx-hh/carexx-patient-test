// pages/mine/mine.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},  //个人信息初始值
    hasUserInfo: false,    //个人信息获取状态
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phone: '未绑定', //个人信息电话号码初始值
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.userInfo) {  //查看是否获得用户权限
      this.setData({
        userInfo: app.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.getUserInfo({
        success: res => {
          app.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // 调用微信接口获取用户信息
  getUserInfo: function (e) {
    var that=this;
    app.userInfo = e.detail.userInfo  //赋值到全局
    that.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    },function(){
      wx.getUserInfo({
        lang: "zh_CN",
        success: res => {
          var region = res.userInfo.province + res.userInfo.city
          //  登录
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (res.code) {
                wx.request({
                  url: app.globalData.baseUrl + '/auth/patient_login',
                  method: 'POST',
                  data: {
                    code: res.code,
                    nickname: that.data.userInfo.nickName,
                    avatar: that.data.userInfo.avatarUrl,
                    sex: that.data.userInfo.gender,
                    region:region
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                  success: function (res) {
                    console.log(res)
                    console.log('token=' + res.data.data.token)
                    console.log('openId=' + res.data.data.openId)
                    wx.setStorageSync('token', res.data.data.token)           //把token和openID保存到本地
                    wx.setStorageSync('openId', res.data.data.openId)
                    that.phone();
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
    })
  },
  //点击跳转到设置手机号的页面
  bindphone:function(event){
      console.log(event)
    wx.navigateTo({
      url: '../set-phone/set-phone',
    })
  },
  //点击跳转到设置的页面
  setbind: function (){
    var app = getApp()
    var phone = this.data.phone
    app.phone = phone
    console.log(app.phone)
    wx.navigateTo({
      url: '../set/set',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    if (wx.getStorageSync('token')){   //刷新页面时监测是否获得token
    //如果有token进行手机号码请求
    wx.request({
      url: app.globalData.baseUrl + '/user/get_user_info',
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.mobile==null){  // 如果没有绑定过手机号显示未绑定
          that.setData({
            phone:'未绑定'
          })
        }else{  //否则显示已绑定过的手机号
          that.setData({
            phone: res.data.data.mobile
          })
        }
      }
    }); 
    }
    
  },
  // 此处是在页面已经获取到用户信息的时候监测是否绑定过手机号
phone:function(){
  var that=this;
  wx.request({
    url: app.globalData.baseUrl + '/user/get_user_info',
    method: 'get',
    header: {
      'content-Type': 'application/x-www-form-urlencoded',
      'auth-token': wx.getStorageSync('token')
    },
    success: function (res) {
      console.log(res)
      if (res.data.data.mobile == null) {
        that.setData({
          phone: '未绑定'
        })
      } else {
        that.setData({
          phone: res.data.data.mobile
        })
      }
    }
  });
},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})