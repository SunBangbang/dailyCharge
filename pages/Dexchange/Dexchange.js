var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    var obj = JSON.parse(options.data)
    if (obj.addr) {
      that.setData({
        address: obj.addr
      })
    }
    that.setData({
      data: obj,
    })
  },
  onShow: function() {
    if (this.data.address) {
      this.getAddressById(this.data.address.addr_id);
    }
  },
  //地址
  choseAddress: function() {
    let that = this;
    if (that.data.address) {
      wx.navigateTo({
        url: '../allAddress/allAddress?isDex=true&addr_id=' + that.data.address.addr_id
      })
    } else {
      wx.navigateTo({
        url: '../allAddress/allAddress?isDex=true'
      })
    }

  },
  //确定兑换
  exchange: function(e) {
    let that =this;
    wx.showModal({
      title: '温馨提示',
      content: '确定兑换此商品？',
      success(res) {
        if (res.confirm) {
          let data = {
            addr_id: "",
            userid_locked: wx.getStorageSync("userid_locked"),
            sku_id: that.data.data.data.sku_id,
            goods_id: that.data.data.goods_detail.goods_id,
            num: that.data.data.number
          }

          if (that.data.data.goods_detail.classify == 2) {
            if (!that.data.address) {
              wx.showToast({
                title: '请选择地址',
                icon: 'loading',
                duration: 1000,
                mask: true
              })
              return;
            } else {
              data.addr_id = that.data.address.addr_id;
            }
          }
          api.form_('shop/buy_goods', data, e.detail.formId, function success(res) {
            if (res.data.code == "1") {
              wx.showToast({
                title: '兑换成功',
                icon: 'success',
                duration: 1000,
                success: function(res) {
                  setTimeout(function() {
                    wx.navigateBack({
                      delta: 2
                    })
                  }, 1000)
                }
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'loading',
                duration: 1000
              })
            }
          }, function fail(e) {
            console.log(e)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //列表渲染
  getAddressById: function(addr_id) {
    var isHave = false;
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked')
    }
    api.form_('shop/address', data, null, function success(res) {
      for (var i = 0; i < res.data.date.length; i++) {
        if (res.data.date[i].addr_id == that.data.address.addr_id) {
          isHave = true;
          that.setData({
            address: res.data.date[i]
          })
          break;
        }
      }

      if (!isHave) {
        that.setData({
          address: null
        })
      }
    }, function fail(e) {
      console.log(e)
    })
  }
})