var api = require('../../utils/api.js')
Page({
  data: {
    mask: false,
    data: null,
    nowintegral: 0,
    sign_list: [],
    open_sign_flag: 0,
    open_sign: 2,
    img: ''
  },
  onLoad: function (options) {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.setData({
      sign: true
    })
    let that = this;
    that.setData({
      open_sign: options.open_sign
    })
  },
  onShow: function () {
    let that = this;
    that.loadData();
  },
  loadData: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked')
    }
    api.form_('Activity/sign_find', data, null, function success(res) {
      console.log(res.data)
      if (res.data.result_code == 300) {
        wx.hideLoading();
        that.setData({
          data: res.data.data,
          sign_list: res.data.data.sign_list,
          open_sign_flag: res.data.data.open_sign,
          img: res.data.data.sign_img
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading'
        })
      }


    }, function fail(e) {
      console.log(e)
    })
  },
  // 关闭
  close: function () {
    this.setData({
      mask: false
    })
  },
  RAclose: function () {
    this.setData({
      open_sign_flag: 1,
      open_sign: 1
    })
  },
  //兑换
  exchange: function () {
    wx.navigateTo({
      url: '../shoppongMall/shoppongMall',
    })
  },
  // 签到规则
  signIn: function () {
    wx.navigateTo({
      url: '../attendanceRules/attendanceRules',
    })
  },
  sign: function (o) {
    wx.showLoading({
      title: '请求中...',
      mask: true
    })
    this.setData({
      nowintegral: o.currentTarget.dataset.integral
    })
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked'),
      integral: o.currentTarget.dataset.integral
    }
    api.form_('Activity/sign', data, null, function success(res) {
      var data = res.data;
      if (data.result_code == 352) {
        that.setData({
          mask: true
        })
        that.loadData();
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'loading',
          duration: 1000
        })
      }
    }, function fail(e) {
      console.log(e)
    })
  },
  receive: function (o) {
    let that = this;
    if (o.currentTarget.dataset.already_get == 1) {
      if (o.currentTarget.dataset.is_get == 1) {
        wx.showModal({
          title: '温馨提示',
          content: '您还没有购买相关权益是否购买？',
          confirmColor: '#0da297',
          success: function (res) {
            if (res.cancel) {
              //用户点击取消
            } else if (res.confirm) {
              //用户点击确定
              wx.navigateTo({
                url: '../checkRecharge/checkRecharge?dataset=' + JSON.stringify(o.currentTarget.dataset),
              })
            }
          }
        })
      } else {
        let data = {
          userid_locked: wx.getStorageSync('userid_locked'),
          kind_id: o.currentTarget.dataset.kind_id
        }
        api.form_('Activity/sign_get_ticket', data, null, function success(res) {
          var data = res.data;
          console.log(res.data)
          if (data.result_code == 357) {
            wx.showModal({
              title: '领取成功',
              content: data.msg,
              confirmColor: '#0da297',
            })
            
            that.loadData();
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'loading',
              duration: 1000
            })
          }
        }, function fail(e) {
          console.log(e)
        })


      }
    } else {
      wx.showToast({
        title: '已被领取',
        icon: 'success'
      })
    }

  }

})