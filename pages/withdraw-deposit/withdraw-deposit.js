// pages/withdraw deposit/withdraw deposit.js
var app =   getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      money:'',
      payAmt:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      this.setData({
          money: Number(options.money)
      })
      console.log(this.data.money)
  },
  /**
   * inputPayAmt
   */
  inputPayAmt(e){
      console.log(e)
      console.log(e.detail.value)
      this.setData({
          payAmt:e.detail.value
      })
  },
  /**
   * 提现
   */
  
  withdraw(){
      let payAmt= this.data.payAmt;
      let money= this.data.money;
      let openId,token;
      if(!payAmt){
          wx.showToast({
              title: '请输入提现金额'
          });
          return;
            
      }else if(payAmt>money){
          wx.showToast({
              title: '余额不足'
          });
          return;
      }
      console.log(app)
      try {
          openId = wx.getStorageSync('openId')
          token = wx.getStorageSync('token')
          if (!openId) {
              // Do something with return value
              wx.showToast({
                  title: 'openId不存在'
              });
              return;
                
          }
          if (!token) {
              // Do something with return value
              wx.showToast({
                  title: 'token不存在'
              });
              return;
                
          }
      } catch (e) {
          // Do something when catch error
          console.log(e)
      }
      wx.request({
          url: 'https://test-m.carexx.cn/useraccount/refund',
          data: {
              openId,
              payAmt
          },
          header: {
              'content-type':'application/x-www-form-urlencoded',
              'auth-token':token
              },
          method: 'post',
          dataType: 'json',
          responseType: 'text',
          success: (res)=>{
              console.log(res)
              if(res.data.code==200)
              wx.redirectTo({
                  url: '/pages/withdraw-deposit-result/withdraw-deposit-result',
              });
              else wx.showToast({
                  title: 'err,code:'+res.data.code
              });
          },
          fail: ()=>{
              wx.showToast({
                  title: '提现失败，请稍候再试'
              });
          },
          complete: ()=>{}
      });
  },
    /**
     * 全部提现
     */
    allwithdraw(){
      this.setData({
          payAmt:this.data.money
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