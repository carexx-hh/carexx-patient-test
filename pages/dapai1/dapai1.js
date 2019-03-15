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
    input1:'',
    input2:'',
    input3:'',
    input4:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getApp().setWatcher(that);
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
    wx.request({
      url: app.globalData.baseUrl + '/play_cards/queryUserName',
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          inputname1: res.data.data[0].userName,
          inputname2: res.data.data[1].userName,
          inputname3: res.data.data[2].userName,
          inputname4: res.data.data[3].userName,
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
    this.setData({
      input3: e.detail.value
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
          that.setData({
            inputValue1: '',
            inputValue2: '',
            inputValue3: '',
            inputValue4: '',
            input1: '',
            input2: '',
            input3: '',
            input4: '',
            newValue1: '',
            newValue2: '',
            newValue3: '',
            newValue4: '',
          })
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
  input_name1:function(e){
    var that=this;
    that.setData({
      input_name1: e.detail.value
    })
    wx.request({
      url: app.globalData.baseUrl + '/play_cards/addUserName/1/'+e.detail.value,
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
      }
    });
  },
  input_name2: function (e) {
    var that = this;
    that.setData({
      input_name2: e.detail.value
    })
    wx.request({
      url: app.globalData.baseUrl + '/play_cards/addUserName/2/' + e.detail.value,
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
      }
    });
  },
  input_name3: function (e) {
    var that = this;
    that.setData({
      input_name3: e.detail.value
    })
    wx.request({
      url: app.globalData.baseUrl + '/play_cards/addUserName/3/' + e.detail.value,
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
      }
    });
  },
  input_name4: function (e) {
    var that = this;
    that.setData({
      input_name4: e.detail.value
    })
    wx.request({
      url: app.globalData.baseUrl + '/play_cards/addUserName/4/' + e.detail.value,
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
      }
    });
  },
  watch: {
    input1: {
      handler(newValue1) {
        console.log(newValue1);
        this.setData({
          newValue1: newValue1,
        })
        var input1 = this.data.input1;
        var input2 = this.data.input2;
        var input3 = this.data.input3;
        var input4 = this.data.input4;
        if (input2 !== '' && input3 !== '' && input1 !== ''){
           this.setData({
             inputValue4: 0 - (Number(this.data.newValue1) + Number(this.data.input2) + Number(this.data.input3)),
           })
        } else if (input2 !== '' && input4 !== '' && input1 !== '') {
          this.setData({
            inputValue3: 0 - (Number(this.data.newValue1) + Number(this.data.input2) + Number(this.data.input4)),
          })
        } else if (input3 !== '' && input4 !== '' && input1 !== '') {
          this.setData({
            inputValue2: 0 - (Number(this.data.newValue1) + Number(this.data.input3) + Number(this.data.input4)),
          })
        }
      },
      deep: true
    },
    input2: {
      handler(newValue2){
        console.log(newValue2);
        this.setData({
          newValue2: newValue2,
        })
        var input2 = this.data.input2;
        var input1 = this.data.input1;
        var input3 = this.data.input3;
        var input4 = this.data.input4;
        if (input1 !== '' && input3 !== '' && input2 !== '') {
          this.setData({
            inputValue4: 0 - (Number(this.data.newValue2) + Number(this.data.input1) + Number(this.data.input3)),
            input4: 0 - (Number(this.data.newValue2) + Number(this.data.input1) + Number(this.data.input3)),
          })
        } else if (input1 !== '' && input4 !== '' && input2 !== '') {
          this.setData({
            inputValue3: 0 - (Number(this.data.newValue2) + Number(this.data.input1) + Number(this.data.input4)),
            input3: 0 - (Number(this.data.newValue2) + Number(this.data.input1) + Number(this.data.input4)),
          })
        } else if (input3 !== '' && input4 !== '' && input2 !== '') {
          this.setData({
            inputValue1: 0 - (Number(this.data.newValue2) + Number(this.data.input3) + Number(this.data.input4)),
            input1: 0 - (Number(this.data.newValue2) + Number(this.data.input3) + Number(this.data.input4)),
          })
        }
      },
      deep: true
    },
    input3: {
      handler(newValue3) {
        console.log(newValue3);
        this.setData({
          newValue3: newValue3,
        })
        var input3 = this.data.input3;
        var input2 = this.data.input2;
        var input1 = this.data.input1;
        var input4 = this.data.input4;
        if (input1 !== '' && input2 !== '' && input3 !=='') {
          this.setData({
            inputValue4: 0 - (Number(this.data.newValue3) + Number(this.data.input2) + Number(this.data.input1)),
            input4: 0 - (Number(this.data.newValue3) + Number(this.data.input2) + Number(this.data.input1)),
          })
        } else if (input2 !== '' && input4 !== '' && input3 !== '') {
          this.setData({
            inputValue1: 0 - (Number(this.data.newValue3) + Number(this.data.input2) + Number(this.data.input4)),
            input1: 0 - (Number(this.data.newValue3) + Number(this.data.input2) + Number(this.data.input4)),
          })
        } else if (input1 !== '' && input4 !== '' && input3!== '') {
          this.setData({
            inputValue2: 0 - (Number(this.data.newValue3) + Number(this.data.input1) + Number(this.data.input4)),
            input2: 0 - (Number(this.data.newValue3) + Number(this.data.input1) + Number(this.data.input4)),
          })
        }
      },
      deep: true
    },
    input4: {
      handler(newValue4) {
        console.log(newValue4);
        this.setData({
          newValue4: newValue4,
        })
        var input4 = this.data.input4;
        var input2 = this.data.input2;
        var input3 = this.data.input3;
        var input1 = this.data.input1;
        if (input1 !== '' && input2 !== '' && input4 !== '') {
          this.setData({
            inputValue3: 0 - (Number(this.data.newValue4) + Number(this.data.input1) + Number(this.data.input2)),
            input3: 0 - (Number(this.data.newValue4) + Number(this.data.input1) + Number(this.data.input2)),
          })
        } else if (input2 !== '' && input3 !== '' && input4 !== '') {
          this.setData({
            inputValue1: 0 - (Number(this.data.newValue4) + Number(this.data.input2) + Number(this.data.input3)),
            input1: 0 - (Number(this.data.newValue4) + Number(this.data.input2) + Number(this.data.input3)),
          })
        } else if (input1 !== '' && input3 !== '' && input4 !== '') {
          this.setData({
            inputValue2: 0 - (Number(this.data.newValue4) + Number(this.data.input1) + Number(this.data.input3)),
            input2: 0 - (Number(this.data.newValue4) + Number(this.data.input1) + Number(this.data.input3)),
          })
        }
      },
      deep: true
    },
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