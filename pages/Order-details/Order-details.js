// pages/Order details/Order details.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:'',
    project:'',
    number:'',
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
    var that = this;
    var orderNo = app.orderNo;
    var orderStatus = app.orderStatus;
    if (orderStatus == 6 || orderStatus ==5){
      that.setData({
        isShow:true
      })
    }else{
      that.setData({
        isShow: false
      })
    };
    that.setData({
      orderNo: orderNo,
      orderStatus: orderStatus
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
          if (res.data.data[0].orderAmt % 1 === 0){
            that.setData({
              xshow:true
            })
          }else{
            that.setData({
              xshow: false
            })
          }
          if (res.data.data[0].proofType==1){
            that.setData({
              number: res.data.data[0].receiptNo
            })
          } else if (res.data.data[0].proofType == 2){
            that.setData({
              number: res.data.data[0].invoiceNo
            })
          } else if (res.data.data[0].proofType == null) {
            that.setData({
              number: '无'
            })
          }
          var serviceDays = ((res.data.data[0].orderServiceEndTime - res.data.data[0].serviceStartTime) / 86400000).toFixed(1)
          timestamp1=new Date(res.data.data[0].serviceStartTime);
            y = timestamp1.getFullYear(),
            m = timestamp1.getMonth() + 1,
            d = timestamp1.getDate();
          var starttime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp1.toTimeString().substr(0, 8);
          timestamp2 = new Date(res.data.data[0].orderServiceEndTime);
            k = timestamp2.getFullYear(),
            f = timestamp2.getMonth() + 1,
            w = timestamp2.getDate();
          var endtime = k + "-" + (f < 10 ? "0" + f : f) + "-" + (w < 10 ? "0" + w : w) + " " + timestamp2.toTimeString().substr(0, 8);
          that.setData({
            project:res.data.data[0],
            starttime: starttime,
            endtime: endtime,
            serviceDays: serviceDays
          })
        }
      });
    })
  },
  btnClick:function(){
    var app=getApp();
    var that=this;
    if (that.data.orderStatus==1){
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/cancel/' + that.data.orderNo,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          if (res.data.code == 200) {
            wx.showModal({
              content: '取消成功',
              cancelText:'返回首页',
              confirmText:'查看订单',
              confirmColor: '#5489FD',
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../order/order',
                  })
                } else if (res.cancel) {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            })
    }
    }
  })
    } else if (that.data.orderStatus ==4){
      var app=getApp()
      app.orderNo = that.data.orderNo
      wx.navigateTo({
        url: '../order-confirm/order-confirm',
      })
    }
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