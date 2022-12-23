var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      data: JSON.parse(options.data)
    })
  },
  //转化手机中间隐藏
  geTel: function(tel) {
    var reg = /^(\d{3})\d{4}(\d{4})$/;
    return tel.replace(reg, "$1****$2");
  },
  // 地址跳转
  addess: function() {
    wx.navigateTo({
      url: '../allAddress/allAddress',
    })
  }
})