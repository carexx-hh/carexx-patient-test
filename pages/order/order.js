// pages/order/order.js
const util = require('../../utils/util.js')
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchtab: [
    {
    name: '全部',
    orderStatus:1||4||6
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
    current:0,
    coupons:[],
    serviceStartTime:[],
    windowHeight:'',
    height:'',


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
  switchNav: function (e){
    var that = this;
    var index = e.target.dataset.index;
    that.setData({
        current: index
    });
    if (index == 1) {
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
          for (var i = 0; i < res.data.data.length; i++) {
            timestamp4.push(new Date(res.data.data[i].serviceStartTime));
            var arr = [];
            for (var j = 0; j < timestamp4.length; j++) {
              y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
              arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
            } 
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
    } else if (index == 0) {
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/list_order',
        method: 'POST',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          var timestamp4 = [];
          for (var i = 0; i < res.data.data.length; i++) {
            timestamp4.push(new Date(res.data.data[i].serviceStartTime));
            var arr = [];
            for (var j = 0; j < timestamp4.length; j++) {
              y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
              arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
            }
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
    } else if (index == 2) {
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
          for (var i = 0; i < res.data.data.length; i++) {
            timestamp4.push(new Date(res.data.data[i].serviceStartTime));
            var arr = [];
            for (var j = 0; j < timestamp4.length; j++) {
                y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
              arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
            }
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
    } else if (index == 3) {
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
          for (var i = 0; i < res.data.data.length; i++) {
            timestamp4.push(new Date(res.data.data[i].serviceStartTime));
            var arr = [];
            for (var j = 0; j < timestamp4.length; j++) {
              y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
              arr.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
              // arr.push(timestamp4[j].toLocaleDateString().replace(/\//g, "-") + " " + timestamp4[j].toTimeString().substr(0, 8));
            }
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
  btntap:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  operationClick:function(event){
    var that = this;
    var orderNo = event.currentTarget.dataset.orderno;
    var orderstatus = event.currentTarget.dataset.orderstatus;
    if (orderstatus==1){
      var app = getApp();
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/cancel/' + orderNo,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          if (res.data.code == 200) {
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
                        for (var i = 0; i < res.data.data.length; i++) {
                          timestamp4.push(new Date(res.data.data[i].serviceStartTime));
                          var arr = [];
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
    } else if (orderstatus==4){
      var app = getApp();
      app.orderNo = orderNo;
      wx.navigateTo({
        url: '../order-confirm/order-confirm',
      })
    } else if (orderstatus == 5 || orderstatus == 6){
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
  onShow: function () {
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
  clickDetails:function(event){
    var that = this;
    var orderNo = event.currentTarget.dataset.orderno;
    var orderStatus = event.currentTarget.dataset.orderstatus;
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