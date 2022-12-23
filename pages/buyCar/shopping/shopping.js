var appInstance = getApp();
var api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysWidth: 0,
    choiceCommIsShow: false,
    selectIndex: 0,
    isSure: false,
    autoplay: false,
    data: {
      price:0
    }
  },

  onLoad: function(options) {
    wx.showToast({
      title: '加载中...',
      icon: "loading",
      mask: true
    })
    let that = this;
    let parameter = {
      userid_locked: wx.getStorageSync('userid_locked'),
    }
    api.form_('buycar/car_detail', parameter, null, function success(res) {
      console.log(res.data)
      that.setData({
        data: res.data.data
      })
    }, function fail(e) {
      console.log(e)
    });
  },

  onShow: function() {
    this.setData({
      sysWidth: appInstance.globalData.sysWidth
    });
  },
  choiceComm: function() {
    this.setData({
      choiceCommIsShow: true
    })
  },
  choiceSure: function() {
    let that = this;
    var data = {
      data: that.data.data.classify_img[that.data.selectIndex],
      price:that.data.data.price,
      subtitle: that.data.data.subtitle,
      title: that.data.data.title,
      footsPrice: that.data.data.foot_price,
      zero_sku: that.data.data.zero_sku,
      goods_id: that.data.data.goods_id
    }
    var str = JSON.stringify(data);
    wx.redirectTo({
      url: '../payMethod/payMethod?data=' + str
    })
  },
  choiceClose: function() {
    this.setData({
      choiceCommIsShow: false,
      isSure: true
    })
  },
  selectColor: function(e) {
    this.setData({
      selectIndex: e.target.dataset.index
    })
  }
})