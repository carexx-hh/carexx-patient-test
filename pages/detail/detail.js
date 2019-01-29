// pages/detail/detail.js
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
    var that = this;
    that.setData({
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
    var that=this;
    wx.request({
      url: app.globalData.baseUrl + '/accountdetail/list',
      method: 'post',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        var timestamp = [];
        for (var i = 0; i < res.data.data.length; i++) {
          timestamp.push(new Date(res.data.data[i].payTime));
          var arr = [];
          for (var j = 0; j < timestamp.length; j++) {
              y = timestamp[j].getFullYear(),
              m = timestamp[j].getMonth() + 1,
              d = timestamp[j].getDate();
            arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp[j].toTimeString().substr(0, 8));
          }
        }
        var timestamp1 = [];
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].payAmt%1===0){
            timestamp1.push((res.data.data[i].payAmt+'.00'))
          }else{
            timestamp1.push(res.data.data[i].payAmt)
          }
        }
        that.setData({
          coupons: res.data.data,
          time: arr,
          timestamp1: timestamp1
        })
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