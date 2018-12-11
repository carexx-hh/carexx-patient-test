//index.js
//获取应用实例
var app = getApp()
const util = require('../../utils/util.js');  
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    // 轮播
    imgUrls: [
      'images/index.png',
      'images/index.png',
      'images/index.png',],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    indicatoractivecolor:"#f9f9f9",
    indicatorcolor:"rgba(249,249,249,.4)",
    circular: true,
    //位置
    province: '',
    city: '',
    district:'',
    latitude: '',
    longitude: '',
    // 左边scroll
    hospitallist: 0,
    height:'',
    menu: [],
    project:[
      { id: 0, name: '护工一对一', money: '280', src:'images/o-o.png'},
      { id: 1, name: '护工一对多', money: '260', src:'images/o-m.png' },
      { id: 2, name: '月嫂', money: '420', src:'images/yue-s.png' },
    ],
    windowHeight: 0,
    navbarHeight: 0,
    bannerHeight: 0,
    scrollViewHeight: 0 ,
  },  
  //事件处理函数 
  onLoad: function (options) {
    var that = this
    qqmapsdk = new QQMapWX({
      key: '22QBZ-ST5AI-KUTGL-5L3JZ-D42F6-SMBY5' //这里自己的key秘钥进行填充
    });
    let vm = this;
    vm.getUserLocation();
  // 左边scroll高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    let query = wx.createSelectorQuery().in(this);
    query.select('#banner').boundingClientRect();
    query.select('#tiao').boundingClientRect();
    query.exec((res) => {
      let bannerHeight = res[0].height;
      let tiaoHeight = res[1].height;
      let scrollViewHeight = this.data.windowHeight - bannerHeight - tiaoHeight;
      this.setData({
        height: scrollViewHeight
      });
    });
    
   
    // // 服务项目
    // wx.request({
    //   url: app.globalData.baseUrl + '/careservice/list_all_inst',
    //   method: 'post',
    //   data: {
    //     instId:1
    //   },
    //   header: {
    //     'content-Type': 'application/x-www-form-urlencoded', // 默认值
    //     'auth-token': app.globalData.token
    //   },
    //   success: function (res) {
    //     // that.setData({
    //     //   menu: res.data.data
    //     // })
    //     console.log(res)
    //   }
    // })
  },
  turnMenu: function (e) {
    var type = e.target.dataset.index;
    console.log(type)
    this.setData({
      hospitallist: type
    })
  },
  loadmore() {
    this.setData({
      hidden: false
    })
  }, 
  onShow: function (){
    var that=this;
    var address = app.datads;
    that.setData({
      district:address 
    })
    wx.request({
      url: app.globalData.baseUrl + '/careinst/all',
      method: 'post',
      data: {
        instRegion: that.data.district
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': 'jo7lusmjW7W3j6ussuaHs2P9jedrb233'
      },
      success: function (res) {
        that.setData({
          menu: res.data.data
        })
      }
    })
    this.hospitalmenu();
  },
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        // console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel){
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if(res.authSetting['scope.userLocation'] == undefined){
          //调用wx.getLocation的API
          vm.getLocation();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  //获取当前地理位置
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude,
          district: district
        })
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },
  tapClick: function (event){
    var name = event.currentTarget.dataset.name
    var money = event.currentTarget.dataset.money
    var app = getApp();
    app.dataname = name;
    app.datamoney = money
    // console.log(app.dataname, app.datamoney)
    wx.navigateTo({
      url: '../Project-reservation/Project-reservation',
    })
  },
  hospitalmenu:function(){
    var that=this;
    console.log(this.data)
    // 机构医院
    
  },
}) 
