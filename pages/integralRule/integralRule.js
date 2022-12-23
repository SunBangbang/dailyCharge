var api = require('../../utils/api.js')
Page({
  data: {
    data: ''
  },

  onLoad: function(options) {
    let that = this;
    api.form_('Agreement/integral_agreement', {}, null, function success(res) {
      that.setData({
        data: res.data.data.agreement
      })
    }, function fail(e) {
      console.log(e)
    })
  }
})