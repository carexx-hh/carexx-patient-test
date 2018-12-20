// pages/order-confirm/order-confirm.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '微信支付', value: 'wchat', checked: 'true'  },
      { name: '钱包支付', value: 'wallet'},
    ]
  },
  radioChange: function (e) {
    console.log('选择的支付方式是：', e.detail.value)
  },
  btnClick:function(){
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success(res) {
        console.log(res)
       },
      fail(res) { 
        console.log(res)}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: wx.getStorageSync('token'),
      openId: wx.getStorageSync('openId')
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
    var that = this;
    var orderNo = app.orderNo;
    that.setData({
      token: wx.getStorageSync('token'),
      openId: wx.getStorageSync('openId'),
      orderNo: orderNo
    },function(){
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/detail/' + that.data.orderNo,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          console.log(res)
          var price = res.data.data[0].orderAmt+4;
          timestamp1 = new Date(res.data.data[0].serviceStartTime);
          y = timestamp1.getFullYear(),
            m = timestamp1.getMonth() + 1,
            d = timestamp1.getDate();
          var starttime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp1.toTimeString().substr(0, 8);
          timestamp2 = new Date(res.data.data[0].scheduleServiceEndTime);
            k = timestamp2.getFullYear(),
            f= timestamp2.getMonth() + 1,
            w = timestamp2.getDate();
          var endtime = k + "-" + (f < 10 ? "0" + f : f) + "-" + (w < 10 ? "0" + w : w) + " " + timestamp2.toTimeString().substr(0, 8);
        
          var newdata = (res.data.data[0].scheduleServiceEndTime - res.data.data[0].serviceStartTime)/86400000;
          console.log(res.data.data[0].serviceStartTime, res.data.data[0].scheduleServiceEndTime,newdata)
          that.setData({
            project: res.data.data[0],
            starttime: starttime,
            endtime: endtime,
            price: price,
            newdata:newdata
          })
        }
      });
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