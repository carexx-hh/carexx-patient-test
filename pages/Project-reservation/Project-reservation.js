// pages/Project-reservation/Project-reservation.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:getApp().phone,
    servicename:'',
    money:'',
    service:'',
    instId: '',
    serviceExplain: '',
    timearray: [],
    objectArray: [],
    pickerArray:[],
    objectpickerArray: [],
    inpatientAreaId:[],
    pickerindex: 0,
    timeindex: 0,
    date:'',
    remark:'',
    mobile:false,
    name:false,
    bed:false,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var newdata=new Date()
    y = newdata.getFullYear(),
    m = newdata.getMonth() + 1,
    d = newdata.getDate();
    var newsdata= y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    this.setData({
      date:newsdata
    })
    var dataname = app.dataname;
    var datamoney = app.datamoney;
    var dataservice = app.dataservice;
    var dataserviceExplain = app.dataserviceExplain;
    var datainstId = app.datainstId;
    var that=this;
    that.setData({
      servicename: dataname,
      money: datamoney,
      instId: datainstId,
      serviceExplain: dataserviceExplain,
      service: dataservice
    }),
   wx.request({
        url: app.globalData.baseUrl + '/inpatientarea/all/'+that.data.instId,
        method: 'GET',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success:function(res){
          console.log(res)
          var inpatientArea=[];
          var inpatientAreaId=[];
          for(var i=0;i<=res.data.data.length;i++){
            inpatientArea.push(res.data.data[i].inpatientArea)
            inpatientAreaId.push(res.data.data[i].id)
            that.setData({
              pickerArray:inpatientArea,
              inpatientAreaId: inpatientAreaId
            })
          }
        }
      }),
   wx.request({
        url: app.globalData.baseUrl + '/customerordertime/get_by_instId/' + that.data.instId,
        method: 'GET',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          var starttime = res.data.data[0].startTime
          var endtime = res.data.data[0].endTimeTime
          console.log(res)
          var
            S = starttime/1000,
            E = S+43200,
            T = new Date(1E3 * S),
            F = new Date(1E3 * E),
            Format = function (Q) { return Q < 10 ? '0' + Q : Q },
            ResultStart = Format(T.getHours()) + ':' + Format(T.getMinutes());
            ResultEnd = Format(F.getHours()) + ':' + Format(F.getMinutes());
            console.log(ResultStart, ResultEnd)
            var timeArray=[]
            timeArray.push(ResultStart, ResultEnd)
            console.log(timeArray)
            that.setData({
              timearray: timeArray
            })
      
        }
      })
  },

  // textarea事件
  // onShowTextare() {       //显示textare
  //   this.setData({
  //     disabled:false,
  //     isShowText: false,
  //     onFacus: true
  //   })
  // },
  // onShowText() {       //显示text
  //   this.setData({
  //     disabled:true,
  //     isShowText: true,
  //     onFacus: false
  //   })
  // },
  // onRemarkInput(event) {               //保存输入框填写内容
  //   var value = event.detail.value;
  //   this.setData({
  //     remark:value,
  //   });
  // },
  bindPickerChange: function (e) {
    this.setData({
      pickerindex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      timeindex: e.detail.value
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
    var that = this;
    var instId = that.data.instId;
    var serviceId = that.data.service;
    var patientName = e.detail.value.input_name;
    var phone = e.detail.value.input_phone;
    var inpatientAreaId = e.detail.value.input_bq;
    var accurateAddress = e.detail.value.input_bed;
    var orderRemark = e.detail.value.input_text;
    var serviceStartTime = e.detail.value.input_datastart +" "+e.detail.value.input_starttime+':00';
    var bed=that.data.bed;
    var mobile=that.data.mobile;
    var name=that.data.name;
    if (bed != true || mobile != true || bed != true){
      wx.showToast({
        title:'请先完善资料',
        icon: 'none',
        duration: 1500
      })
    }else{
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/add_appointOrder',
        method: 'POST',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        data: {
          instId:that.data.instId,
          serviceId:serviceId,
          patientName:patientName,
          phone:phone,
          inpatientAreaId:inpatientAreaId,
          accurateAddress: accurateAddress,
          orderRemark:orderRemark,
          serviceStartTime:serviceStartTime,
        },
        success: function (res) {
          console.log(res)
          if(res.data.code==200){
            wx.showModal({
              cancelColor: '#333333',
              confirmText: '查看订单',
              cancelText: '返回首页',
              content: '预约成功',
              confirmColor: '#5489FD',
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../order/order',
                  })
                } else if (res.cancel) {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            })
          }else if (res.data.code == 400){
            wx.showModal({
              cancelColor: '#333333',
              confirmText: '再次预约',
              cancelText: '取消',
              content: '预约失败',
              confirmColor: '#5489FD',
              success(res) {
                if (res.confirm) {
                  wx.hideToast()
                } else if (res.cancel) {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            })
          }

        }
      })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
    that.setData({
      token: wx.getStorageSync('token')
    })
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