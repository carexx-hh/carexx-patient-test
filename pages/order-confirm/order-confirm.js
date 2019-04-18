// pages/order-confirm/order-confirm.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data:{
    items: [
      { name: '微信支付', value: 'wechat', checked: 'true'  },  //俩种支付方式。微信支付为页面初始值的默认选项
      { name: '钱包支付', value: 'wallet'},
    ],
    payStyle: '微信支付',
  },
  //点击选择支付方式
  radioChange: function (e) {
    console.log('选择的支付方式是：', e.detail.value)
    var that=this;
    that.setData({
      payStyle: e.detail.value  //支付方式赋值到data
      })
  },
  //点击支付时的操作
  btnClick:function(){
    var that=this;
    if (that.data.payStyle == '微信支付'){  //选择微信支付时
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/pay',
        method: 'post',
        data: {
          openId: wx.getStorageSync('openId'),  //需要传的参数openID和订单号
          orderNo: that.data.orderNo
        },
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 200) {  //返回200时调用微信接口
            wx.requestPayment({  //此处为调用微信接口必须的参数（详情可见微信小程序文档）
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': res.data.data.signType,
              'paySign': res.data.data.paySign,
              'success': function (res) {  //支付成功后跳转到订单页面
                console.log(res);
                wx.switchTab({
                  url: '../order/order',
                })
              },
              'fail': function (res) {
                console.log('fail:' + JSON.stringify(res));
              }
            })
          }
        }
      });
    } else if (that.data.payStyle == '钱包支付'){  //选择钱包支付时
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/account_pay',
        method: 'post',
        data: {
          orderNo: that.data.orderNo  
        },
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          console.log(res)
          if(res.data.code==200){  //支付成功时跳转到支付成功的页面
            app.price=that.data.price
            wx.navigateTo({
              url: '../pay-success/pay-success',
            })
          }else{
            wx.showToast({
              title: res.data.errorMsg,
              image: './images/cancel.png',
              duration: 2500
            })
          }
        }
      });
    }
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  //页面初始化时把本地存储的token和openID放到data里
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
    },function(){  //页面刷新时请求页面的数据
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/detail/' + that.data.orderNo,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          console.log(res)
          var price = res.data.data[0].orderAmt;
          if(price%1===0){    //判断金额是否为整数从而判断是否要显示小数点
             show_1:true
          }else{
            show_1:false
          }
          timestamp1 = new Date(res.data.data[0].serviceStartTime); //开始时间
            y = timestamp1.getFullYear(),
            m = timestamp1.getMonth() + 1,
            d = timestamp1.getDate();
          var starttime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp1.toTimeString().substr(0, 8);
          var nowtimestamp = (new Date()).valueOf();
          var endtimestamp = res.data.data[0].scheduleServiceEndTime;
          while (nowtimestamp <= endtimestamp){
            endtimestamp = endtimestamp - 1000 * 60 * 60 * 12;
          }
          endtimestamp = endtimestamp + 1000 * 60 * 60 * 12;
          timestamp2 = new Date(endtimestamp);  //结束时间
            k = timestamp2.getFullYear(),
            f = timestamp2.getMonth() + 1,
            w = timestamp2.getDate();
            // 重新赋值到starttime和endtime
          var endtime = k + "-" + (f < 10 ? "0" + f : f) + "-" + (w < 10 ? "0" + w : w) + " " + timestamp2.toTimeString().substr(0, 8);
          //服务时间
          var newdata = (endtimestamp - res.data.data[0].serviceStartTime)/86400000;
          console.log(res.data.data[0].serviceStartTime, endtimestamp, newdata)
          that.setData({  //保存到data里
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