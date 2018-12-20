// pages/search-result/search-result.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: wx.getStorageSync('token')
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
    this.setData({
      token: wx.getStorageSync('token')
    })
    var inputVal = app.inputVal;
    var that = this;
    that.setData({
      inputVal: inputVal
    },function(){
      wx.request({
        url: app.globalData.baseUrl + '/careinst/all',
        method: 'post',
        data: {
          instName: inputVal
        },
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          that.setData({
            project: res.data.data,
          },function(){
            if (that.data.project == '') {
              wx.showToast({
                title: '无搜索结果',
                icon: 'none',
                duration: 1500
              })
            }
          })
        }
      })
    });
  },
  clickproject:function(e){
    var instId = e.currentTarget.dataset.id;
    app.instId = instId;
    wx.navigateTo({
      url: '../search-hospital/search-hospital',
    })
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