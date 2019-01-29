// Component/nav.js
var app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    open:false,
    flag:true,
    token: wx.getStorageSync('token'),
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggle:function(){
      this.setData({
        open: !this.data.open,
        flag: !this.data.flag
      })
    },

  }
})
