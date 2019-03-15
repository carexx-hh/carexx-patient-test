// pages/Order details/Order details.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:'', //判断页面部分内容显示与否的状态
    project:'', //服务项目
    number:'',  //凭证号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 页面初始化获取本地存储的token
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
    var orderNo = app.orderNo;   // 订单号
    var orderStatus = app.orderStatus; // 订单状态
    if (orderStatus == 6 || orderStatus == 5) {  // 根据状态判断页面是否显示凭证类型和凭证号（此状态为前页面全局传参）
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
      // 请求订单列表
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/detail/' + that.data.orderNo,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          console.log(res)
          if (res.data.data[0].orderAmt % 1 === 0){  //判断金额是否为整数，是否展示小数点
            that.setData({
              xshow:true
            })
          }else{
            that.setData({
              xshow: false
            })
          }
          if (res.data.data[0].proofType==1){    //判断凭证类型（收据/发票）
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
          // 服务天数
          var serviceDays = ((res.data.data[0].orderServiceEndTime - res.data.data[0].serviceStartTime) / 86400000).toFixed(1)
          // 订单开始日期
          timestamp1=new Date(res.data.data[0].serviceStartTime);
            y = timestamp1.getFullYear(),
            m = timestamp1.getMonth() + 1,
            d = timestamp1.getDate();
          var starttime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp1.toTimeString().substr(0, 8);
          // 订单结束日期
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
  // 在待排班状态下进入详情页进行取消订单功能
  btnClick:function(){
    var app=getApp();
    var that=this;
    if (that.data.orderStatus==1){       //如果状态为1的话要执行的操作，此时可以取消订单
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/cancel/' + that.data.orderNo,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          if (res.data.code == 200) {  //数据请求成功返回为200时弹出的提示框
            wx.showModal({
              content: '取消成功',
              cancelText:'返回首页',
              confirmText:'查看订单',
              confirmColor: '#5489FD',
              success(res) {
                if (res.confirm) {       //点击确认要执行的操作
                  wx.switchTab({
                    url: '../order/order',
                  })
                } else if (res.cancel) {   //点击取消要执行的操作
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            })
    }
    }
  })
    } else if (that.data.orderStatus == 4) {      //如果状态为4的话要执行的操作，此时可以跳转到支付页面
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