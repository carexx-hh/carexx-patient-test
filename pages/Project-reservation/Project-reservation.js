// pages/Project-reservation/Project-reservation.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    servicename:'',  //服务名称
    money: '',        //服务金额
    service: '',      
    instId: '',       //机构ID
    serviceExplain: '',     //服务备注
    timearray: [],          //时间
    objectArray: [],        //日期
    pickerArray: [],         //病区
    objectpickerArray: [],   
    inpatientAreaId: [],      //病区ID
    pickerindex: 0,           //病区选中状态
    timeindex: 0,            //时间选中状态
    date: '',                
    remark: '',                 //病人备注
    mobile: false,           //手机号填写状态
    name: false,              //名字填写状态
    bed: false,                //床号填写状态
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前时间戳
    var newdata=new Date()
    y = newdata.getFullYear(),
    m = newdata.getMonth() + 1,
    d = newdata.getDate();
    // 转换为正常时间显示
    var newsdata= y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    this.setData({
      date:newsdata
    })
    // 此处为首页传参过来再重新定义
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
    // 获取病区
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
            for(var i=0;i<res.data.data.length;i++){
                console.log(res.data.data[i].inpatientArea)
                inpatientArea.push(res.data.data[i].inpatientArea)
                inpatientAreaId.push(res.data.data[i].id)
            }
            that.setData({
                pickerArray:inpatientArea,
                inpatientAreaId: inpatientAreaId
            })
        }
      }),
      // 获取开始时间
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
            timeArray.push(ResultStart, ResultEnd) //开始时间中的俩个时间点，赋值到数组
            console.log(timeArray)
            that.setData({
              timearray: timeArray
            })
      
        }
      })
  },
  // 获取患者选择的病区
  bindPickerChange: function (e) {
    this.setData({
      pickerindex: e.detail.value
    })
  },
  // 获取患者显示的开始日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 获取患者显示的开始时间
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
    if (this.data.mobile.length === 11) {     //如此处手机号码不正确，为false，不能下单
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
    if (this.data.name.length =='') {  //如此处用户没有填写，为false，不能下单
      this.setData({
        name: false
      });
    } else{
      this.setData({
        name:true
      });
    }
  },
  // 获取患者填写的床号
  bedInput(e) {
    this.setData({
      bed: e.detail.value
    });
    if (this.data.bed.length == '') {          //如此处用户没有填写，为false，不能下单
      this.setData({
        bed: false
      });
    } else {
      this.setData({
        bed: true
      });
    }
  },
  // 确认预约提交订单
  formSubmit:function(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)  //e.detail.value为表单数据，url请求时的参数
    var that = this;
    var instId = that.data.instId;                  //机构id
    var serviceId = that.data.service;              //服务id
    var patientName = e.detail.value.input_name;     //病人姓名
    var phone = e.detail.value.input_phone;          //电话号码
    var inpatientAreaId = e.detail.value.input_bq;    //病区id
    var accurateAddress = e.detail.value.input_bed;   //病床
    var orderRemark = e.detail.value.input_text;       //订单备注
    var serviceStartTime = e.detail.value.input_datastart + " " + e.detail.value.input_starttime + ':00';      //服务开始时间
    // 用来判断用户资料是否填写完整
    var bed = that.data.bed;   //床号
    var mobile = that.data.mobile;  //手机号
    var name = that.data.name;   //姓名
    if (bed != true || mobile != true || bed != true){  //如果此处都为false，则执行以下操作（提示框）
      wx.showToast({
        title:'请先完善资料',
        icon: 'none',
        duration: 1500
      })
    }else{
      // 提交订单
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
          if(res.data.code==200){ //返回状态为200的操作
            wx.showModal({
              cancelColor: '#333333',
              confirmText: '查看订单',
              cancelText: '返回首页',
              content: '预约成功',
              confirmColor: '#5489FD',
              success(res) {
                if (res.confirm) {  //点击确认按钮
                  wx.switchTab({
                    url: '../order/order',
                  })
                } else if (res.cancel) {  //点击取消按钮
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            })
          } else if (res.data.code == 500){   //返回为500时的状态显示
            wx.showToast({
              title: res.data.errorMsg,
              icon:'none'
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
      token: wx.getStorageSync('token')  //从本地获取token，赋值到data
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