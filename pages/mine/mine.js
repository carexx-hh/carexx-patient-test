// pages/mine/mine.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phone:'未绑定',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.userInfo) {
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
  getUserInfo: function (e) {
    var that=this;
    app.userInfo = e.detail.userInfo
    that.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    },function(){
      wx.getUserInfo({
        lang: "zh_CN",
        success: res => {
          var region = res.userInfo.province + '/' + res.userInfo.city
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
                    wx.setStorageSync('token', res.data.data.token)
                    wx.setStorageSync('openId', res.data.data.openId)
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
  bindphone:function(event){
    // var app =getApp()
    // var phone = event.currentTarget.dataset.phone
    // app.phone=phone
    // console.log(app.phone)
    wx.navigateTo({
      url: '../set-phone/set-phone',
    })
  },
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
    var phone = this.data.phone
    wx.setStorageSync('phone', phone)
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