//index.js
//获取应用实例
var app = getApp()
const util = require('../../utils/util.js');  
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    // 轮播   此处为小程序固定配置参数
    imgUrls: [
      'images/index1.png',
      'images/index2.png'
             ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    indicatoractivecolor:"#f9f9f9",
    indicatorcolor:"rgba(249,249,249,.4)",
    circular: true,
    //位置
    province: '',  //省
    city: '',      //市
    district:'',   //地区
    latitude: '',   //纬度
    longitude: '',   //经度
    // 左边scroll
    hospitallist: 0, //医院列表
    servicelist:'',  //服务项目
    height:'',
    menu: [],          //菜单
    project:[],        //服务项目
    windowHeight: 0,    // 窗口高度
    navbarHeight: 0,     //nav高度
    bannerHeight: 0,      //banner高度
    scrollViewHeight: 0 ,   //左边scroll高度
    instId:'',              //机构ID
  },  
  onShow: function () {
    this.setData({
      token: wx.getStorageSync('token')      // 获取本地存储的token
    })
    var address = app.datads;
    var that=this;
    if(address==undefined){  //如果address没有值则执行此操作
      that.setData({
        district: that.data.district
      }, function () {
        //获取地区下面的医院机构
        wx.request({
          url: app.globalData.baseUrl + '/careinst/all',
          method: 'post',
          data: {
            instRegion: that.data.district
          },
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
            var instId = res.data.data[that.data.hospitallist].id
            console.log(res)
            console.log(instId)
            that.setData({
              menu: res.data.data,
              instId: instId
            }, function () {
              // 获取医院的服务项目
              wx.request({
                url: app.globalData.baseUrl + '/careservice/list_all_service',
                method: 'post',
                data: {
                  instId: instId
                },
                header: {
                  'content-Type': 'application/x-www-form-urlencoded',
                  'auth-token': that.data.token
                },
                success: function (res) {
                  console.log(res)
                  that.setData({
                    project: res.data.data,
                  })
                  console.log(res)
                }
              })
            })
          }
        })
      })
    }else{
      that.setData({
        district: address
      }, function () {
        //获取用户自己选择地区之后的机构
        wx.request({
          url: app.globalData.baseUrl + '/careinst/all',
          method: 'post',
          data: {
            instRegion: that.data.district
          },
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
            var instId = res.data.data[that.data.hospitallist].id
            console.log(res)
            console.log(instId)
            that.setData({
              menu: res.data.data,
              instId: instId
            }, function () {
              // 服务项目
              console.log(res.data.data.instName)
              wx.request({
                url: app.globalData.baseUrl + '/careservice/list_all_service',
                method: 'post',
                data: {
                  instId: instId
                },
                header: {
                  'content-Type': 'application/x-www-form-urlencoded',
                  'auth-token': that.data.token
                },
                success: function (res) {
                  console.log(res)
                  that.setData({
                    project: res.data.data,
                  })
                  console.log(res)
                }
              })
            })
          }
        })
      })
    }
  },
  //事件处理函数 
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              that.setData({
                userInfo: res.userInfo,   //个人信息
                region: res.userInfo.province + '/' + res.userInfo.city   //地址
              })
              //  登录
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  if (res.code) {
                    wx.request({
                      url: app.globalData.baseUrl + '/auth/patient_login',
                      method: 'POST',
                      data: {
                        code: res.code,//将code发给后台拿token
                        nickname: that.data.userInfo.nickName,  //微信昵称
                        avatar: that.data.userInfo.avatarUrl,    //头像
                        sex: that.data.userInfo.gender,           //性别
                        region: that.data.region                 //地址
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                      },
                      success: function (res) {
                        console.log(res)
                        console.log('token=' + res.data.data.token)
                        // token保存到本地
                        wx.setStorageSync('token', res.data.data.token)
                      },
                    })
                  } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                  }
                }
              })
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }else{  //如果监测到用户为首次进入该程序，则需要跳转到‘我的’页面进行信息授权
          wx.showModal({
            content: '需要获取您的用户信息',
            showCancel:false,
            confirmText:'去授权',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../mine/mine',
                })
              }
            }
          })
        }
      },
    });
    // 把token存data
   this.setData({
     token: wx.getStorageSync('token')
   })
   
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
      let bannerHeight = res[0].height;  //获取banner的高度
      let tiaoHeight = res[1].height;    //获取中间部分的高度
      let scrollViewHeight = this.data.windowHeight - bannerHeight - tiaoHeight;  //获取左边scroll的高度并赋值到data
      this.setData({
        height: scrollViewHeight
      });
    }); 
  },
  // 点击左边医院进行查询服务项目
  turnMenu: function (e) {
    var that=this;
    var type = e.target.dataset.index;
    that.setData({
      hospitallist: type
    },function(){
      // 查询所有医疗机构
      wx.request({
        url: app.globalData.baseUrl + '/careinst/all',
        method: 'post',
        data: {
          instRegion: that.data.district
        },
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          var instId = res.data.data[that.data.hospitallist].id
          that.setData({
            menu: res.data.data,
            instId:instId
          }, function () {
            // 服务项目
            wx.request({
              url: app.globalData.baseUrl + '/careservice/list_all_service',
              method: 'post',
              data: {
                instId: instId
              },
              header: {
                'content-Type': 'application/x-www-form-urlencoded',
                'auth-token': that.data.token
              },
              success: function (res) {
                that.setData({
                  project: res.data.data,
                })
              }
            })
          })
        }
      })
    })
  },
  
  // 用户授权获取地理位置
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
            showCancel:false,
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
        // 机构医院
        wx.request({
          url: app.globalData.baseUrl + '/careinst/all',
          method: 'post',
          data: {
            instRegion: vm.data.district
          },
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': vm.data.token
          },
          success: function (res) {
            var instId = res.data.data[vm.data.hospitallist].id
            console.log(res)
            console.log(instId)
            vm.setData({
              menu: res.data.data,
              instId: instId
            },function(){
              // 服务项目
              wx.request({
                  url: app.globalData.baseUrl + '/careservice/list_all_service',
                  method: 'post',
                  data: {
                         instId: instId
                   },
              header: {
              'content-Type': 'application/x-www-form-urlencoded', 
              'auth-token': vm.data.token
              },
            success: function (res) {
                vm.setData({
                  project: res.data.data,
                })
            console.log(res)
            }
          })
            })
          }
        })
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },
  // 点击服务项目进行订单预约
  tapClick: function (event){
    var that=this;
    var name = event.currentTarget.dataset.name  //服务名称           
    var money = event.currentTarget.dataset.money   //服务金额                                
    var service = event.currentTarget.dataset.serviceid   //服务id
    var serviceExplain = event.currentTarget.dataset.serviceexplain    //服务备注
    var instId = that.data.instId         //机构ID                                  
    console.log(name, money, service, serviceExplain, instId)
    var app = getApp(); //此处为把参数通过getAPP（）传参到预约订单的页面
    app.dataname = name;
    app.datamoney = money
    app.dataservice = service;
    app.dataserviceExplain = serviceExplain
    app.datainstId = instId
    wx.navigateTo({
      url: '../Project-reservation/Project-reservation',
    })
  },
}) 
