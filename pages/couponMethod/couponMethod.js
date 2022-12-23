var api = require('../../utils/api.js')
Page({
  data: {
data:''
  },
  onLoad: function (options) {
    let that =this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let data={
      type:1,
      userid_locked: wx.getStorageSync("userid_locked")
    }
    api.form_("Card/card_instruct", data, null, function success(res) {
      wx.hideLoading();
      that.setData({
        data: res.data.data
      })
    }, function fail(e) {
      console.log(e)
    })
  },

  
})