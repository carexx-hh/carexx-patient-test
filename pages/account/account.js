// pages/account/account.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'0.00' //初始金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 获取存储在本地的token
  onLoad: function (options) {
    var that = this;
    that.setData({
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
    var that=this;
    // 请求账户余额
    wx.request({
      url: app.globalData.baseUrl + '/useraccount/by_userId',
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.accountBalance%1===0){    //如果为整数，后面加'.00'
          that.setData({
            money: res.data.data.accountBalance+'.00'
          })
        }else{
        that.setData({
          money: res.data.data.accountBalance       //否则数据直接展示
        })
      }}
    });
  },
  // 进入明细页面查看个人钱包明细
  todeposit(){
      wx.navigateTo({
          url: '/pages/withdraw-deposit/withdraw-deposit?money=' + this.data.money,
          success: (result)=>{
              
          },
          fail: ()=>{},
          complete: ()=>{}
      });
  },
  // 进入明细页面查看个人钱包明细
  click_details:function(){
    wx.navigateTo({
      url: '../detail/detail',
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