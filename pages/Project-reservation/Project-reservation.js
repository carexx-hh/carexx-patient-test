// pages/Project-reservation/Project-reservation.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:getApp().phone,
    name:'',
    money:'',
    array: ['08：00', '20：00'],
    objectArray: [
      {
        id: 0,
        name: '08:00'
      },
      {
        id: 1,
        name: '20:00'
      }],
    multiArray: [['一科室', '二科室'], ['健康护理1区', '健康护理2区']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '一科室'
        },
        {
          id: 1,
          name: '二科室'
        }
      ], [
        {
          id: 0,
          name: '健康护理1区'
        },
        {
          id: 1,
          name: '健康护理2区'
        }
      ]
    ],
    multiIndex: [0,0],
    index: 0,
    date: '2016-09-01',
    time: '12:01',
    onFocus:false,    //textarea焦点是否选中
    isShowText:false, //控制显示 textarea 还是 text
    remark:'',
    isShowText:true,       //用于存储textarea输入内容
    mobile:false,
    name:false,
    bed:false,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var dataname = app.dataname;
    var datamoney = app.datamoney;
    this.setData({
      name: dataname,
      money: datamoney
    })
  },

  // textarea事件
  onShowTextare() {       //显示textare
    this.setData({
      disabled:false,
      isShowText: false,
      onFacus: true
    })
  },
  onShowText() {       //显示text
    this.setData({
      disabled:true,
      isShowText: true,
      onFacus: false
    })
  },
  onRemarkInput(event) {               //保存输入框填写内容
    var value = event.detail.value;
    this.setData({
      remark:value,
    });
  },
  // 
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['健康护理1区', '健康护理2区', '健康护理3区', '健康护理4区', '健康护理5区'];
            break;
          case 1:
            data.multiArray[1] = ['重病1区', '重病2区', '重病3区'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  //去绑定手机
  go_Phone:function(){
     wx.navigateTo({
       url: '../set-phone/set-phone',
     })
  },
  // 双向绑定mobile
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value
    });
    if (this.data.mobile.length === 11) {
      this.setData({
        mobile: true
      });
    } else if (this.data.mobile.length < 11) {
      this.setData({
        mobile: false
      });
    }
  },
  // 双向绑定name
  nameInput(e) {
    this.setData({
      name:e.detail.value
    });
    if (this.data.name.length =='') {
      this.setData({
        name: false
      });
    } else{
      this.setData({
        name:true
      });
    }
  },
  bedInput(e) {
    this.setData({
      bed: e.detail.value
    });

    if (this.data.bed.length == '') {
      this.setData({
        bed: false
      });
    } else {
      this.setData({
        bed: true
      });
    }
  },
  formSubmit:function(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let phone=wx.getStorageSync('phone')
    if(phone==='未绑定'){
      wx.showModal({
        cancelColor: '#333333',
        confirmText:'去绑定',
        confirmColor:'#5489FD',
        content: '预约前需先绑定手机号',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../set-phone/set-phone',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.request({
        url: '',
        method:'post',
        
      })
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