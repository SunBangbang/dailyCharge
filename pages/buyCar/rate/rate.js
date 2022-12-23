// pages/buyCar/rate/rate.js
var api = require('../../../utils/api.js')
Page({

  data: {
    rate_list:[],
    data:'',
  },

  onLoad: function (options) {
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked')
    }
    api.form_('buycar/buy_process', data, null, function success(res) {
      console.log(res.data)
      var list = res.data.data.rank;
        list.sort(function(a,b){return a.course<b.course?1:-1});
        that.setData({
          rate_list: list,
          data:res.data.data
        })
    }, function fail(e) {
      console.log(e)
    });
  },

  recommend: function(){
    wx.navigateTo({
      url: "../recommend/recommend"
    })
  },

  toEndPay:function(e){
    // wx.showToast({
    //   title: '支付尾款开发中...',
    //   icon: 'none'
    // })
    wx.navigateTo({
      url: '../shopping/shopping',
    })
  }
  
})