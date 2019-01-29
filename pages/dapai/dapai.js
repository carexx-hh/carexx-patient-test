var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    people:'4人',
    array:['4人','5人'],
    index:0,
    token: wx.getStorageSync('token'),
  },
  bindChange: function (e) {
    var array=this.data.array;
    this.setData({
      index: e.detail.value,
      people: array[e.detail.value]
    })
  },
  click_btn:function(){
    var that=this;
    if (!wx.getStorageSync('people') && that.data.people == '4人'){
      wx.navigateTo({
        url: '../dapai1/dapai1',
      })
      wx.setStorageSync('people', that.data.people)
    }else if (wx.getStorageSync('people') && that.data.people == '4人' && wx.getStorageSync('people') == that.data.people) {
      wx.navigateTo({
        url: '../dapai1/dapai1',
      })
      wx.setStorageSync('people', that.data.people)
    } else if (wx.getStorageSync('people') && that.data.people == '4人' && wx.getStorageSync('people') !== that.data.people){
      wx.request({
        url: app.globalData.baseUrl + '/play_cards/resetScore',
        method: 'post',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 200) {
            wx.navigateTo({
              url: '../dapai1/dapai1',
            })
            wx.setStorageSync('people', that.data.people)
          }
        }
      });
    }
    // ////////////////
    if (!wx.getStorageSync('people') && that.data.people == '5人') {
      wx.navigateTo({
        url: '../dapai2/dapai2',
      })
      wx.setStorageSync('people', that.data.people)
    } else if (wx.getStorageSync('people') && that.data.people == '5人' && wx.getStorageSync('people') == that.data.people) {
      wx.navigateTo({
        url: '../dapai2/dapai2',
      })
      wx.setStorageSync('people', that.data.people)
    } else if (wx.getStorageSync('people') && that.data.people == '5人' && wx.getStorageSync('people') !== that.data.people) {
      wx.request({
        url: app.globalData.baseUrl + '/play_cards/resetScore',
        method: 'post',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 200) {
            wx.navigateTo({
              url: '../dapai2/dapai2',
            })
            wx.setStorageSync('people', that.data.people)
          }
        }
      });
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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