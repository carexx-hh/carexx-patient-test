// pages/search/search.js
const app = getApp()
var that=this;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal:'',
    searchRecord:[],
    searchhot:[]
  
  },
  openHistorySearch: function () {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],//若无储存则为空
    })
  },
  searchSubmitFn: function (e) {
    var that = this;
    var inputVal = e.detail.value;
    var searchRecord = this.data.searchRecord;
    if (inputVal == '') {
      //输入为空时的处理
    }
    else {
      //将搜索值放入历史记录中,只能放前10条
      if (searchRecord.length < 7) {
        searchRecord.unshift(
          {
            value:inputVal,
            id: searchRecord.length
          }
        )
      }
      else {
        searchRecord.pop()//删掉旧的时间最早的第一条
        searchRecord.unshift(
          {
            value: inputVal,
            id: searchRecord.length
          }
        )
      }
      //将历史记录数组整体储存到缓存中
      wx.setStorageSync('searchRecord', searchRecord);
      if (inputVal !== '') {
        app.inputVal = inputVal,
        wx.navigateTo({ 
          url: '../search-result/search-result',
         })
      }
    }
    // wx.navigateTo({
    //   url: '../search-result/search-result'
    // });
    // console.log(searchRecord)
  },
  historyDelFn: function () {
    wx.removeStorage({
      key: 'searchRecord',
    })
    this.setData({
      searchRecord:[]
    })
  },
  // 删除单条记录
  // remove:function (event) {
  //   var searchRecord = this.data.searchRecord;
  //   var id = event.currentTarget.id;
  //   this.data.searchRecord.splice(id, 1);
  //   this.setData({
  //     searchRecord: this.data.searchRecord
  //   })
  //   wx.setStorageSync('searchRecord', searchRecord)
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: wx.getStorageSync('token')
    })
    this.openHistorySearch()
   
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
    that.setData({
      token: wx.getStorageSync('token')
    })
    wx.request({
      url: app.globalData.baseUrl + '/careinst/all',
      method: 'post',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        that.setData({
          searchhot: res.data.data,
        })
      }
    })
  },
  clickSearch:function(e){
    var that = this;
    var name = e.target.dataset.name;
    var instId = e.target.dataset.id;
    app.instName=name;
    app.instId = instId;
    wx.navigateTo({
      url: '../search-hospital/search-hospital',
    })
  },
  clickhistory:function(event){
    var instName = event.currentTarget.dataset.name
    app.inputVal = instName
    wx.navigateTo({
      url: '../search-result/search-result',
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