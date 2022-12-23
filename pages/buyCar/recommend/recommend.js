var api = require('../../../utils/api.js')
Page({
  data: {
    data: '',
    user_id: ''
  },
  onLoad: function(options) {
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked')
    }
    console.log(11111111111111111111111)
    api.form_('buycar/share_car_code', data, null, function success(res) {
      console.log(res)
      that.setData({
        data: res.data.data,
        user_id: res.data.data.url.match(/qrcar\/(\S*)\.png/)[1]
      })
    }, function fail(e) {
      console.log(e)
    });
  },
  //转发
  onShareAppMessage: function (res) {
    // let userid = wx.getStorageSync("userid_locked");
    if (res.from === 'button') { }
    return {
      title: '买车体验充电',
      path: '/pages/index/index?user_id=' + this.data.user_id,
      imageUrl: this.data.share_img,
      success: function (res) {
      }
    }
  }
})