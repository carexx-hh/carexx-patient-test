// pages/search-hospital/search-hospital.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    project:[]
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
    var instId = app.instId;
    var instName = app.instName;
    var that=this;
    that.setData({
      instId: instId,
      instName: instName
    },function(){
      wx.request({
        url: app.globalData.baseUrl + '/careservice/list_all_service',
        method: 'post',
        data: {
          instId: instId
        },
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          that.setData({
            project: res.data.data,
          })
        }
      })
    })

  },
  clickproject:function(event){
    var name = event.currentTarget.dataset.name
    var money = event.currentTarget.dataset.money
    var service = event.currentTarget.dataset.serviceid
    var serviceExplain = event.currentTarget.dataset.serviceexplain
    app.datainstId=this.data.instId
    app.dataname = name;
    app.datamoney = money
    app.dataservice = service;
    app.dataserviceExplain = serviceExplain
    wx.navigateTo({
      url: '../Project-reservation/Project-reservation',
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