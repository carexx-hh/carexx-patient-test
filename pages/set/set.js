// pages/set/set.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
        phone:'', //定义电话号码初始值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: wx.getStorageSync('token')
    });
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
    var that = this;
    // 请求电话号码
    wx.request({
      url: app.globalData.baseUrl + '/user/get_user_info',
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
       
        if (res.data.data.mobile == null) {  //如果值为null则显示未绑定
          that.setData({
            phone: '未绑定'
          })
        } else {
          that.setData({   //否则显示data的值
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
    wx.reLaunch({
      url: '../mine/mine'
    })
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