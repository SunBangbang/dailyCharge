var api = require('../../utils/api.js')
Page({
  data: {
    data: {
      money: 0,
      currency: 0,
    },
    operator_phone: '',
    phone: '',
    active: [],
    nav: [],
    mask: false
  },

  close: function() {
    this.setData({
      mask: false
    })
  },

  // 签到下载app
  sign: function() {
    this.setData({
      mask: true
    })
  },

  onShow: function () {
    this.listData()
    //查询手机
    this.setData({
      mask: false,
      operator_phone: wx.getStorageSync('operator_phone')
    })
  },
  // 页面渲染
  listData: function () {
    var that = this;
    let data = {
      userid_locked: wx.getStorageSync("userid_locked")
    }
    api.form_('Money/wallet', data, null, function success(res) {
      console.log(res.data)
      if(res.data.data) {
        res.data.data.active.sort((a,b) => {return a.type - b.type}) // 轮播
      }
      that.setData({
        data: res.data.data,
        nav: res.data.data.button,
        active: res.data.data.active
        // phone: that.geTel(tel)
      })
    }, function fail(err) {
      wx.showToast({
        title: err.data.msg,
        icon: 'none'
      })
    })
  },
  
  // 导航
  navigtion: function (e) {
    let index = e.currentTarget.dataset.index
    let that = this
    if (that.data.nav[index].type == 1) {
      //充电记录
      if (that.data.nav[index].is_enter == 1) {
        wx.showToast({
          title: that.data.nav[index].msg,
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '../charge/charge'
        })
      }
    } else if (that.data.nav[index].type == 2) {
      //充值记录
      if (that.data.nav[index].is_enter == 1) {
        wx.showToast({
          title: that.data.nav[index].msg,
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '../recharge/recharge'
        })
      }
    } else if (that.data.nav[index].type == 3) {
      //我的卡包
      if (that.data.nav[index].is_enter == 1) {
        wx.showToast({
          title: that.data.nav[index].msg,
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '../cardBag/cardBag'
        })
      }
    } else if (that.data.nav[index].type == 4) {
      //积分商城
      if (that.data.nav[index].is_enter == 1) {
        wx.showToast({
          title: that.data.nav[index].msg,
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '../shoppongMall/shoppongMall'
        })
      }
    } else if (that.data.nav[index].type == 5) {
      //设备保修
      if (that.data.nav[index].is_enter == 1) {
        wx.showToast({
          title: that.data.nav[index].msg,
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '../repair/repair?ispersonalCenter=true'
        })
      }
    } else if (that.data.nav[index].type == 6) {
      if (that.data.nav[index].is_enter == 1) {
        wx.showToast({
          title: that.data.nav[index].msg,
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '../battery/battery?url=' + that.data.nav[index].url
        })
      }
    } else if(that.data.nav[index].type == 7) {
      // 天天车城
      if (that.data.nav[index].is_enter == 1) {
        wx.showToast({
          title: that.data.nav[index].msg,
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '../car/car'
        })
      }
    }
  },

  // 充值
  wxRecharge: function () {
    wx.navigateTo({
      url: '../wxRecharge/wxRecharge'
    })
  },

  // 客服电话
  mobie: function () {
    wx.makePhoneCall({
      phoneNumber: '4006888919'
    })
  },

  // 运维电话
  phone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.operator_phone
    })
  },

  // 签到
  signin: function () {
    wx.navigateTo({
      url: '../signin/signin'
    })
  },

  //分享页面 （轮播图片）
  share: function (e) {
    let index = e.currentTarget.dataset.index
    let that = this
    if (this.data.active[index].type == 1) {
      wx.navigateToMiniProgram({
        appId: that.data.active[index].car_shop_appid,
        path: that.data.active[index].url_platform,
        extraData: {
          foo: 'bar'
        },
        success: function(res) {
          let data = {
            userid_locked: wx.getStorageSync('userid_locked'),
            url: that.data.active[index].url_platform
          }
          api.form_('Statist/out_applet', data, null, function success(res) {
            // console.log(res)
          })
        },
        envVersion: 'release'
      })
    } else if (this.data.active[index].type == 2) {
      wx.navigateTo({
        url: '../battery/battery?url=' + this.data.active[index].url
      })
    } else if (this.data.active[index].type == 3) {
      wx.navigateTo({
        url: '../integralSharing/integralSharing'
      })
    } else if(this.data.active[index].type == 4) {
      if (this.data.data.join_buy_car == 1) {
        wx.navigateTo({
          url: '../buyCar/invitation/invitation'
        })
      } else {
        wx.navigateTo({
          url: '../buyCar/rate/rate' // 买车进度
        })
      }
    } else if (this.data.active[index].type == 6) {
      wx.navigateTo({
        url: '../mcard/mcard?num_id=' + this.data.data.number + '&id=' + '1' // 月卡
      })
    } 
  },

  // 卡购买
  cards: function () {
    // 进入特惠套餐 
    wx.navigateTo({
      url: '../specialPackage/specialPackage?id=' + '1'
    })
  }
})