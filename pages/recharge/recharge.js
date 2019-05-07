// pages/recharge/recharge.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:1,
    price:300,  //初始的充值金额
  },
  // 改变充值金额的点击事件
  changePrice: function (e) {
    console.log(e.target.dataset.text); //获取到用户选择的金额
    this.setData({
      num: e.target.dataset.num||'6',
      price: e.target.dataset.text||''
    })
    console.log(this.data.num)
    console.log(this.data.price)
  },
  // 获取用户在'其他金额'里输入的值
  moneyInput:function(e){
    this.setData({
      price:e.detail.value,
    })
    console.log(typeof this.data.price)
  },
  // 确认充值的点击事件
  click_confirm:function(){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/useraccount/recharge',
      method: 'post',
      data:{
        openId: wx.getStorageSync('openId'),
        payAmt:that.data.price
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        if(res.data.code==200){  //同样返回200时调起微信的支付接口
          　wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
             'nonceStr': res.data.data.nonceStr,
             'package': res.data.data.package,
             'signType': res.data.data.signType,
             'paySign': res.data.data.paySign,
             'success': function (res) {
              console.log(res);
               wx.redirectTo({  //支付完成后跳转到账户页面
                url: '../account/account',
              })
              },
            'fail': function (res) {
              console.log('fail:' + JSON.stringify(res));
            }
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token')  //获取本地的token
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