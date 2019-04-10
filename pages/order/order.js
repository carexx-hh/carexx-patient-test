// pages/order/order.js
const util = require('../../utils/util.js')
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchtab: [     //头部tab值
    {
    name: '全部',
    orderStatus:1||4||6     //状态
    },
    {
    name: '待排班',
    orderStatus: 1
    },
    {
    name: '进行中',
    orderStatus: 4
      }, 
    {
    name: '已完成',
    orderStatus: 6
    }
    ],
    current: 0,  //头部修饰所用select的值
    coupons:[],  //获取的列表
    serviceStartTime:[],  //获取的开始时间
    windowHeight:'',  //窗口高度
    height: '',   //scroll-view所需要的高度


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token')  //从本地获取token
    });
  },
  //点击头部nav的请求
  switchNav: function (e){
    var that = this;
    var index = e.target.dataset.index;
    that.setData({
        current: index
    });
    if (index == 1) {  //状态为待排班时
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/list_order',
        method: 'POST',
        data: {
          orderStatus: 1
        },
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
            var timestamp4 = [];
                var arr = [];
            for (var i = 0; i < res.data.data.length; i++) {  //把所有的数据中的开始时间先存到timestamp4数组里
                timestamp4.push(new Date(res.data.data[i].serviceStartTime));
            }
            for (var j = 0; j < timestamp4.length; j++) {  //把开始时间处理完赋值到arr数组
                y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
              arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));       
            } 
          if (res.data.data == '') {  //判断无数据时显示去预约的按钮和页面
            that.setData({
              isShow: true
            })
          } else {
            that.setData({
              isShow: false
            })
          };
          that.setData({
            coupons: res.data.data,  //数据赋值到data
            serviceStartTime: arr
          })
        }
      });
    } else if (index == 0) {   //状态为全部时   （以下逻辑处理同上）
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/list_order',
        method: 'POST',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
            var timestamp4 = [];
                var arr = [];
            for (var i = 0; i < res.data.data.length; i++) {
                timestamp4.push(new Date(res.data.data[i].serviceStartTime));
            }
            for (var j = 0; j < timestamp4.length; j++) {
                y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
                arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
            }
          if (res.data.data == '') {
            that.setData({
              isShow: true
            })
          } else {
            that.setData({
              isShow: false
            })
          };
          that.setData({
            coupons: res.data.data,
            serviceStartTime: arr
          })
          console.log(that.data.serviceStartTime)
        }
      })
    } else if (index == 2) {   //状态为进行中时   （以下逻辑处理同上）
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/list_order',
        method: 'POST',
        data: {
          orderStatus: 4
        },
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
            var timestamp4 = [];
                var arr = [];
            for (var i = 0; i < res.data.data.length; i++) {
                timestamp4.push(new Date(res.data.data[i].serviceStartTime));
            }
            for (var j = 0; j < timestamp4.length; j++) {
                y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
              arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
            }
          if (res.data.data == '') {
            that.setData({
              isShow: true
            })
          } else {
            that.setData({
              isShow: false
            })
          };
          that.setData({
            coupons: res.data.data,
            serviceStartTime: arr
          })
        }
      });
    } else if (index == 3) {   //状态为已完成时   （以下逻辑处理同上）
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/done_order',
        method: 'POST',
        data: {
          orderStatus: 6
        },
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
            var timestamp4 = [];
                var arr = [];
            for (var i = 0; i < res.data.data.length; i++) {
                timestamp4.push(new Date(res.data.data[i].serviceStartTime));
            }
            for (var j = 0; j < timestamp4.length; j++) {
              y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
              arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
            }
          if (res.data.data == '') {
            that.setData({
              isShow: true
            })
          } else {
            that.setData({
              isShow: false
            })
          };
          that.setData({
            coupons: res.data.data,
            serviceStartTime: arr
          })
        }
      })
    }
  },
  //如果没有数据则点击去预约跳转到首页
  btntap:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  //此处为在不同状态下点击事件（取消订单、去支付、查看详情）
  operationClick:function(event){
    var that = this;
    var orderNo = event.currentTarget.dataset.orderno;
    var orderstatus = event.currentTarget.dataset.orderstatus;
    if (orderstatus==1){  //判断状态进行不同的点击事件（此处的状态为后台传参，详情可见showdoc数据字典）   此处为取消订单
      var app = getApp();
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/cancel/' + orderNo,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          if (res.data.code == 200) { //返回code为200的执行操作
                wx.showLoading({
                  title: '加载中...',
                  mask: true,
                  success: function (res) {
                    setTimeout(function () {
                      wx.hideLoading()
                    }, 2000);
                    wx.showToast({
                      title: '取消成功',
                      icon: 'success',
                      success: function () {
                    that.setData({
                      current: 0
                    })
                    // 当取消订单成功后重新请求数据刷新页面  （此处逻辑处理同上）
                    wx.request({
                      url: app.globalData.baseUrl + '/customerorder/list_order',
                      method: 'POST',
                      header: {
                        'content-Type': 'application/x-www-form-urlencoded',
                        'auth-token': that.data.token
                      },
                      success: function (res) {
                        console.log(res)
                        var timestamp4 = [];
                          var arr = [];
                        for (var i = 0; i < res.data.data.length; i++) {
                          timestamp4.push(new Date(res.data.data[i].serviceStartTime));
                          for (var j = 0; j < timestamp4.length; j++) {
                            y = timestamp4[j].getFullYear(),
                              m = timestamp4[j].getMonth() + 1,
                              d = timestamp4[j].getDate();
                            arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
                          }
                        }
                        that.setData({
                          coupons: res.data.data,
                          serviceStartTime: arr
                        })
                      }
                    });
                  },
                })
              }
            })
          };
        }      
      })
    } else if (orderstatus==4){  //此处为跳转到支付页面
      var app = getApp();
      app.orderNo = orderNo;
      wx.navigateTo({
        url: '../order-confirm/order-confirm',
      })
    } else if (orderstatus == 5 || orderstatus == 6){  //此处为跳转到订单详情页面
      var app = getApp();
      app.orderNo = orderNo;
      app.orderStatus = orderstatus;
      wx.navigateTo({
        url: '../Order-details/Order-details',
      })
    }
     
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {   //页面刷新时默认请求全部的数据，头部nav为全部  （此处逻辑处理同上）
    var that = this;
    that.setData({
      current:0
    })
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/list_order',
        method: 'POST',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          console.log(res)
          var timestamp4 = [];
          for( var i=0;i<res.data.data.length;i++){
            timestamp4.push(new Date(res.data.data[i].serviceStartTime));
            var arr=[];
            for (var j = 0; j < timestamp4.length;j++){
                y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
              arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
            }
          }
          if(res.data.data==''){
            that.setData({
              isShow:true
            })
          }else{
            that.setData({
              isShow: false
            })
          };
          that.setData({
            coupons: res.data.data,
            serviceStartTime:arr
          })
        }
      });
    }, 
    //点击列表跳到订单详情页（这里不分状态）
  clickDetails:function(event){
    var that = this;
    var orderNo = event.currentTarget.dataset.orderno;  //需要传的订单号
    var orderStatus = event.currentTarget.dataset.orderstatus;  //需要传的订单状态
    console.log(orderStatus)
    var app = getApp();
    app.orderNo = orderNo;
    app.orderStatus = orderStatus;
    wx.navigateTo({
      url: '../Order-details/Order-details',
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