var appInstance = getApp();
var api = require('../../utils/api.js')
Page({
  data: {
    sysWidth: 0,
    choiceCommIsShow: false,
    selectIndex: 0,
    num: 1,
    isSure: false,
    data: {},
    isShortage: false,
    goods_id: "",
    showDetail: false,
    scroll_top: 0
  },

  onLoad: function(options) {
    var id = options.id;
    this.setData({
      goods_id: id
    })

  },
  laodData: function() {
    let that = this;
    let data = {
      goods_id: that.data.goods_id,
      userid_locked: wx.getStorageSync('userid_locked')
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    api.form_("shop/goods_detail", data, null, function success(res) {
      wx.hideLoading();
      if (res.data.code == 1) {
        that.setData({
          data: res.data
        })
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'error',
          mask: true
        })
      }
      that.checkButton();

    }, function fail(e) {
      console.log(e)
    })
  },
  onShow: function() {
    this.setData({
      sysWidth: appInstance.globalData.sysWidth
    });

    this.laodData();
  },
  choiceComm: function() {
    this.setData({
      choiceCommIsShow: true
    })
  },
  choiceSure: function() {
    let that = this;
    if (that.data.isShortage) {
      wx.showToast({
        title: '库存不足',
        icon: 'loading'
      })
    } else {
      var data = {
        data: that.data.data.sku[that.data.selectIndex],
        goods_detail: that.data.data.goods_detail,
        addr: that.data.data.addr,
        number: that.data.num,
      }
      var str = JSON.stringify(data);
      wx.navigateTo({
        url: '../Dexchange/Dexchange?data=' + str
      })
    }
  },
  choiceClose: function() {
    this.setData({
      choiceCommIsShow: false,
      isSure: true
    })
  },
  reduceNum: function() {
    var num = this.data.num - 1;
    if (num <= 0) return;
    this.setData({
      num: num
    })
    this.checkButton();
  },
  addNum: function() {
    var num = this.data.num + 1;
    this.setData({
      num: num
    })
    this.checkButton();
  },
  selectColor: function(e) {
    this.setData({
      selectIndex: e.target.dataset.index
    })

    this.checkButton();
  },
  checkButton: function() {
    if (this.data.data.sku[this.data.selectIndex].wstock < this.data.num || this.data.data.sku[this.data.selectIndex].stock == 0) {
      this.setData({
        isShortage: true
      })
    } else {
      this.setData({
        isShortage: false
      })
    }
  },
  scrollFun: function(e) {
    if (this.data.check_index == 0) {
      if (this.data.windowHeight + 50 > this.data.goodsHeight) {
        return;
      }
    } else {
      if (this.data.windowHeight + 50 > this.data.goods1Height) {
        return;
      }
    }
    if (this.data.scroll_top < e.detail.scrollTop) {
      this.setData({
        showDetail: true
      })
    } else if (e.detail.scrollTop <= 100) {
      this.setData({
        showDetail: false
      })
    }

    this.setData({
      scroll_top: e.detail.scrollTop
    })
  }
})