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
      'images/index1.png',
      'images/index2.png'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
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
    servicelist:'',
    height:'',
    menu: [],
    project:[],
    windowHeight: 0,
    navbarHeight: 0,
    bannerHeight: 0,
    scrollViewHeight: 0 ,
    instId:'',
  },  
  onShow: function () {
    this.setData({
      token: wx.getStorageSync('token')
    })
    var address = app.datads;
    var that=this;
    if(address==undefined){
      that.setData({
        district: that.data.district
      }, function () {
        //机构
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
        //机构
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
                userInfo: res.userInfo,
                region: res.userInfo.province + '/' + res.userInfo.city
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
                        nickname: that.data.userInfo.nickName,
                        avatar: that.data.userInfo.avatarUrl,
                        sex: that.data.userInfo.gender,
                        region: that.data.region
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                      },
                      success: function (res) {
                        console.log(res)
                        console.log('token=' + res.data.data.token)
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
        }else{
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
      let bannerHeight = res[0].height;
      let tiaoHeight = res[1].height;
      let scrollViewHeight = this.data.windowHeight - bannerHeight - tiaoHeight;
      this.setData({
        height: scrollViewHeight
      });
    }); 
  },
  turnMenu: function (e) {
    var that=this;
    var type = e.target.dataset.index;
    that.setData({
      hospitallist: type
    },function(){
      // that.getLocation();
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
  tapClick: function (event){
    var that=this;
    // console.log(event.currentTarget.dataset)
    var name = event.currentTarget.dataset.name
    var money = event.currentTarget.dataset.money
    var service = event.currentTarget.dataset.serviceid
    var serviceExplain = event.currentTarget.dataset.serviceexplain
    var instId = that.data.instId
    console.log(name, money, service, serviceExplain, instId)
    var app = getApp();
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
