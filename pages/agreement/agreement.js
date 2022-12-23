var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    api.form_('Agreement/statement', {}, null, function success(res) {
      that.setData({
        data: res.data.data.agreement
      })
    }, function fail(e) {
      console.log(e)
    })

  }
})