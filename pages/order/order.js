// pages/order/order.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchtab: [{
      name: '全部',
      _type: 'all'
    }, {
      name: '待排班',
      _type: 'wait'
    },
    {
      name: '进行中',
      _type: 'ongoing'
      }, {
        name: '已完成',
        _type: 'done'
      }
    ],
    currentTab: 0,
    coupons: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      coupons: this.loadCoupons()
    });
  },

  //tab切换函数，让swiper当前滑块的current的index与tab头部index一一对应
  switchNav: function (e) {
    var index = e.target.dataset.current;
    if (this.data.currentTab == index) {
      return false;
    } else {
      this.setData({
        currentTab: index
      });
    }
  },
  //滑动swiper切换，让swiper当前滑块的current的index与tab头部index一一对应
  tabChange(e) {
    this.setData({
      currentTab: e.detail.current
    })
  },
  //自定义数据函数
  loadCoupons: function () {
    let switchtab = this.data.switchtab,
      coupons = [
      {
        id: "0",
        price:"240",
        title:"护工一对一",
        time:"2018.06.16",
        kind:"待排班",
        operation:"取消订单",
        _type: "all"
      },
      {
        id: "0",
          price: "360",
          title: "护工一对一",
          time: "2018.06.16",
          kind: "进行中",
          operation:"支付并结束",
          backgroundColor:'#5791FD',
          border:'none',
          width:'194rpx',
          height:'60rpx',
          color:'#fff',
        _type: "all",
      }, 
      {
        id: "0",
          price: "160",
          title: "护工一对多",
          time: "2018.06.16-2018.06.18",
          kind: "已完成",
          operation:"查看详情",
         _type: "all",
      }, 
      {
        id: "1",
          price: "240",
          title: "护工一对一",
          time: "2018.06.16",
          kind: "待排班",
          operation:"取消订单",
          _type: "wait"
      }, 
      {
        id: "1",
          price: "240",
          title: "护工一对多",
          time: "2018.06.16",
          kind: "待排班",
          operation:"取消订单",
          _type: "wait"
      }, 
      {
        id: "2",
          price: "360",
          title: "护工一对一",
          time: "2018.06.16",
          kind: "进行中",
          operation:"支付并结束",
          backgroundColor:'#5791FD',
          border:'none',
          width:'194rpx',
          height:'60rpx',
          color:'#fff',
        _type: "ongoing"
        },
        {
          id: "3",
          price: "160",
          title: "护工一对一",
          time: "2018.06.16-2018.06.18",
          kind: "已完成",
          operation:"查看详情",
          _type: "done"
        }];
    //根据tab头部的数据来重建一个数组，使数组的内容与tab一一对应
    var result = new Array();
    for (var n = 0; n < switchtab.length; n++) {
      let minArr = []
      for (var i = 0; i < coupons.length; i++) {
        //根据类型来区分自定义的内容属于哪个tab下面的
        if (coupons[i]._type == switchtab[n]._type) {
          minArr.push(coupons[i]);
        }
      }
      result.push(minArr)
    }
    return result;
  },
  btntap:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  operationClick:function(){
     wx.navigateTo({
       url: '../Order-details-pay/Order-details-pay',
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