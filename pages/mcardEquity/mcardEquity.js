var api = require('../../utils/api.js')
Page({
  data: {
    data: ''
  },
  onLoad: function(options) {
    let that = this;
    let data={
      userid_locked: wx.getStorageSync('userid_locked'),
      cal_id:options.card_id
    }
    api.form_('Agreement/month_agreement', data, null, function success(res) {
      that.setData({
        data: res.data.data.agreement
      })
    }, function fail(e) {
      console.log(e)
    })
  }
})