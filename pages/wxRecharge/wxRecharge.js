var api = require('../../utils/api.js')
Page({
  data: {
    info: [],
    money: '',
    isJump: false,
    charging: null,
    testInfo: 'test',
    head: '',
    last: '',
    second: '',
    descript: ''
  },

  // 轮播触碰
  share: function(e) {
    let index = e.currentTarget.dataset.index
    let that = this
    if (this.data.info.active[index].type == 1) {
      wx.navigateToMiniProgram({
        appId: that.data.info.active[index].car_shop_appid,
        path: that.data.info.active[index].url_platform,
        extraData: {
          foo: 'bar'
        },
        success: function(res) {
          let data = {
            userid_locked: wx.getStorageSync('userid_locked'),
            url: that.data.info.active[index].url_platform
          }
          api.form_('Statist/out_applet', data, null, function success(res) {
            // console.log(res)
          })
        },
        envVersion: 'release'
      })
    } else if (this.data.info.active[index].type == 2) {
      wx.navigateTo({
        url: '../battery/battery?url=' + this.data.info.active[index].url
      })
    } else if (this.data.info.active[index].type == 3) {
      wx.navigateTo({
        url: '../integralSharing/integralSharing'
      })
    } else if(this.data.info.active[index].type == 4) {
      if (this.data.info.join_buy_car == 1) {
        wx.navigateTo({
          url: '../buyCar/invitation/invitation'
        })
      } else {
        wx.navigateTo({
          url: '../buyCar/rate/rate' // 买车进度
        })
      }
    } else if (this.data.info.active[index].type == 6) {
      wx.navigateTo({
        url: '../mcard/mcard?num_id=' + this.data.info.number + '&id=' + '1' // 月卡
      })
    } 
  },

  onUnload() {
    this.setData({
      testInfo: 'unload'
    })
  },

  onLoad: function (options) {
    this.setData({
      testInfo: 'load'
    });
    var that = this;
    if (options.isJump) {
      that.setData({
        isJump: options.isJump
      })
    }
    if (options.charging) {
      that.setData({
        charging: JSON.parse(decodeURIComponent(options.charging))
      })
    }
    if (options.stop) {
      that.setData({
        second: options.second
      })
    }
    var str = wx.getStorageSync('str')
    if(str) {
    this.setData({
      head: str.split('?')[0],
      last: str.split('?')[1]
    })
  }
  },

  onShow: function () {
    var that = this;
    that.listData();
    this.setData({
      testInfo: 'show'
    });
  },
  onHide() {
    this.setData({
      testInfo: 'hide'
    });
  },
  listData: function () {
    var that = this;
    let data = {
      userid_locked: wx.getStorageSync("userid_locked")
    }
    api.form_('Money/money_pay_list', data, null, function success(res) {
      console.log(res.data)
      let des = res.data.data.descript.replace(/(^\s+)|(\s+$)|\s+/g, '<br />')
      that.setData({
        info: res.data.data,
        descript: des
      })
    }, function fail(e) {
      console.log(e)
    })
  },
  //分享页面
  // share: function () {
  //   wx.navigateTo({
  //     url: '../doubleEleven/doubleEleven'
  //   })
  // },
  // 价格
  price: function (e) {
    this.setData({
      money: e.currentTarget.dataset.money
    })
  },
  // 充值
  wxRecharge: function (e) {
    let this_ = this;
    let that = this.data;
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    if (that.money == 0) {
      wx.showToast({
        title: '请选择充值金额',
        icon: 'loading'
      })
    } else {
      wx.login({
        success: function (res) {
          console.log(res)
          let data = {
            code: res['code'],
            fee: that.money,
            member: 1
          }
          api.form_('pay/pay_fee', data, null, function success(res) {
            console.log(res.data)
            if (res.data.result_code == 314) {
              let order_id = res.data.data.order_id;
              if (order_id == "") {
                wx.showToast({
                  title: '请重新提交',
                  icon: 'loading'
                })
              } else {
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: 'MD5',
                  paySign: res.data.data.paySign,
                  success: function (res) {
                    let data = {
                      order_id: order_id,
                      userid_locked: wx.getStorageSync('userid_locked')
                    }
                    api.form_('pay/check_pay', data, null, function success(res) {
                      console.log(res.data)
                      wx.hideLoading()
                      if (res.data.result_code == '300') {
                        wx.showToast({
                          title: '充值成功',
                          icon: 'success',
                          duration: 2000
                        })
                        this_.setData({
                          money: ''
                        })
                        wx.showToast({
                          title: '跳转中...',
                          icon: 'loading',
                          mask: true
                        })
                        if (that.charging) {
                          api.form_('scan/start', that.charging, null, function success(res) {
                            wx.hideLoading();
                            console.log(res.data)
                            if (res.data.result_code == 335) {
                              wx.showToast({
                                title: '余额不足以开启当前充电',
                                icon: 'none',
                                duration: 1000,
                                mask: true,
                              })
                            } else if (res.data.result_code == 338) {
                              wx.reLaunch({
                                url: '../countDown/countDown?log_id=' + res.data.data.user_log_id + '&stop=' + this_.data.second
                              })
                            }
                          }, function fail(e) {
                            wx.hideLoading()
                            console.log(e)
                          })
                        } else {
                          wx.reLaunch({
                            url: "../index/index" + (this_.data.isJump ? "?str=" + this_.data.head + `&${this_.data.last}` : "")
                          })
                        }
                      }
                    }, function fail(e) {
                      wx.hideLoading()
                      console.log(e)
                    })
                    // this_.setData({
                    //   testInfo: 'pay success'
                    // })
                  },
                  fail: function (res) {
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none'
                    })
                  }
                })
              }
            } else {
              console.log('失败')
            }
          }, function fail(e) {
            wx.hideLoading()
            console.log(e)
          })
        }
      })
    }
  },
  // onBeforeBack: function () {
  //   return wx.showModal({
  //     title: '提示',
  //     content: '是否放弃支付',
  //     confirmStay: !1
  //   })
  // }
})