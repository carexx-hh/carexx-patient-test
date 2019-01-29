var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    open: false,
    flag: true,
    token: wx.getStorageSync('token'),
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
  toggle: function () {
    this.setData({
      open: !this.data.open,
      flag: !this.data.flag
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/play_cards/getScore',
      method: 'post',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          listData: res.data.data
        })
      }
    });
  },
  input1: function (e) {
    this.setData({
      input1: e.detail.value
    })
  },
  input2: function (e) {
    this.setData({
      input2: e.detail.value
    })
  },
  input3: function (e) {
    var input1 = this.data.input1;
    var input2 = this.data.input2;
    var input3 = e.detail.value;
    var sum = Number(input1) + Number(input2) + Number(input3);
    console.log(sum)
    var input_last = 0 - sum
    this.setData({
      input3: e.detail.value,
      inputValue4: input_last,
      input4: input_last
    })
  },
  input4: function (e) {
    this.setData({
      input4: e.detail.value,
    })
  },
  click_btn:function(){
    var that=this;
    var input1=that.data.input1;
    var input2 = that.data.input2;
    var input3 = that.data.input3;
    var input4 = that.data.input4;
    var str=input1+','+input2+','+input3+','+input4
    if (input1 !== undefined && input2 !== undefined && input3 !== undefined && input4 !== undefined){
    wx.request({
      url: app.globalData.baseUrl + '/play_cards/addScore/' +str,
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        if(res.data.code==200){
          wx.request({
            url: app.globalData.baseUrl + '/play_cards/getScore',
            method: 'post',
            header: {
              'content-Type': 'application/x-www-form-urlencoded',
              'auth-token': that.data.token
            },
            success: function (res) {
              console.log(res)
              that.setData({
                listData: res.data.data,
                inputValue1:'',
                inputValue2: '',
                inputValue3: '',
                inputValue4: '',
                input1: '',
                input2: '',
                input3: '',
                input4: '',
              })
            }
          });
        }
      }
    });
    }
  },
  click_charts: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/play_cards/resetScore',
      method: 'post',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.request({
            url: app.globalData.baseUrl + '/play_cards/getScore',
            method: 'post',
            header: {
              'content-Type': 'application/x-www-form-urlencoded',
              'auth-token': that.data.token
            },
            success: function (res) {
              console.log(res)
              that.setData({
                listData: res.data.data
              })
              if(res.data.code==200){
                wx.showToast({
                  title: '清除成功',
                  icon: 'success',
                  duration: 1500,
                })
              }
            }
          });
        }
      }
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