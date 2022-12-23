// pages/authorize/authorize.js
var api = require('../../utils/api.js')
const app = getApp();
Page({
  data: {
    check: 0,
    nodes: '',
    recommend: '',
    user_agent: '', // 商城用户id
    user_id: '', //购车ID 
    data: '',
    mask: true,
    jumpTop: 0,
    activity: '',
    clickflag: false,
    str: '',
    password: '',
    account: '',
    hd: '',
    six_activity: ''
  },
  onLoad: function (options) {
    var that = this;
    that.showData()
    console.log(options)
    that.setData({
      activity: options.activity,
      str: wx.getStorageSync('str')
    })
    if (options.userid) {
      that.setData({
        recommend: options.userid
      })
    }
    if (options.user_id) {
      that.setData({
        url_user_id: options.user_id
      })
    }
    if (options.hd) {
      that.setData({
        hd: options.hd
      })
    }
    if (options.user_agent) {
      that.setData({
        user_agent: options.user_agent // 商城用户id
      })
    }
    if (options.six_activity) {
      that.setData({
        six_activity: options.six_activity
      })
    }
  },

  account: function (e) {
    this.setData({
      account: e.detail.value
    })
  },

  password: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  showData() {
    //用户协议
    var that = this;
    api.form_('Agreement/statement', {}, null, function success(res) {
      console.log(res.data)
      that.setData({
        nodes: res.data.data.agreement,
        data: res.data.data
      })
    }, function fail(e) {
      console.log(e)
    })
  },

  // 新版本授权
  getUserProfile: function (e) {
    let that = this;
    if (that.data.clickflag) return;
    wx.showToast({
      title: '请稍等',
      icon: 'loading'
    })
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.login({
          success: function (result) {
            let data = {
              encryptedData: res.encryptedData,
              iv: res.iv,
              rawData: res.rawData,
              code: result.code
            }
            if (that.data.recommend) {
              data.recommend = that.data.recommend
            }
            api.get_('Login/index', data, null, function success(res) {
                console.log(res.data)
                if (res.data.result_code == '360') {
                  let userId = res.data.data.userid_locked
                  wx.setStorageSync('userid_locked', res.data.data.userid_locked)
                  wx.setStorageSync('phoneNumber', res.data.data.phone)
                  if (that.data.hd) {
                    wx.redirectTo({
                      url: '/pages/battery/battery?url=' + wx.getStorageSync('battery_button_url') + '&hd=' + that.data.hd
                    })
                  } else if (that.data.six_activity) {
                    let data = {
                      qrcode: wx.getStorageSync('discount')
                    }
                    api.form_('Activity/enter_activity_h', data, null, function success(res) {
                      console.log(res)
                      if (res.data.result_code == '500') {
                        if (that.data.six_activity && that.data.user_agent) {
                          let data = {
                            userid_locked: wx.getStorageSync('userid_locked'),
                            t_id: that.data.user_agent
                          }
                          api.active('Trans/records', data, function sucess(res) {
                            console.log(res)
                            if (res.data.code == 1) {
                              // 扫码商城
                              wx.redirectTo({
                                url: '/pages/product/product?id=' + that.data.six_activity + '&user_id=' + that.data.user_agent
                              })
                            } else {
                              wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                              })
                              setTimeout(() => {
                                wx.redirectTo({
                                  url: '/pages/index/index',
                                })
                              }, 1000)
                            }
                          })
                        } else if (that.data.six_activity == 'six') {
                          // 6折换电
                          wx.redirectTo({
                            url: '../battery/battery?url=' + res.data.data.url,
                          })
                        } else {
                          wx.redirectTo({
                            url: '../battery/battery?url=' + res.data.data.url + '&hd=' + that.data.six_activity
                          })
                        }
                      } else {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none'
                        })
                      }
                    })
                  } else if (that.data.str != '') { //授权成功后，跳转进入小程序首页
                    let data = {
                      userid_locked: userId,
                      str: that.data.str
                    }
                    api.form_('Scan/scan', data, null, function success(res) {
                      console.log(res.data)
                      if (res.data.result_code == '300') {
                        var data = JSON.stringify(res.data.data)
                        wx.setStorageSync('operator_phone', res.data.data.operator_phone);
                        wx.redirectTo({
                          url: '/pages/openCharging/openCharging?support_month_card=' + res.data.support_month_card + '&num_id=' + res.data.num_id + '&data=' + data
                        })
                      } else {
                        wx.showModal({
                          title: '温馨提示',
                          content: res.data.msg,
                          showCancel: false,
                          success: function () {
                            wx.reLaunch({
                              url: '/pages/index/index?user_id=' + that.data.user_id
                            })
                          }
                        })
                      }
                    })  
                  } else if (that.data.activity == 1) {
                    wx.redirectTo({
                      url: '/pages/H4/H4'
                    })
                  } else if (wx.getStorageSync('url_user_id')) {
                    let data = {
                      userid_locked: wx.getStorageSync('userid_locked'),
                      referrer_id: wx.getStorageSync('url_user_id')
                    }
                    api.form_('buycar/recommend', data, null, function success(res) {
                      console.log(res.data)
                      if (res.data.result_code == '373') {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'loading',
                          success: function () {
                            wx.redirectTo({
                              url: '/pages/buyCar/procedure/procedure'
                            })
                          }
                        })
                      } else {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'loading',
                          success: function () {
                            wx.reLaunch({
                              url: '/pages/index/index?user_id=' + that.data.user_id,
                            })
                          }
                        })
                      }
                    })
                  } else {
                    wx.redirectTo({
                      url: '../index/index',
                    })
                    that.setData({
                      clickflag: false
                    })
                  }
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              },
              function fail(e) {
                console.log(e)
              })
          }
        })
      },
      fail: (err) => {
        console.log(err)
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  },

  confirm: function () {
    let data = {
      username: this.data.account,
      password: this.data.password
    }
    api.form_('Login/login_applet', data, null, function success(res) {
      console.log(res.data)
      wx.setStorageSync('userid_locked', res.data.data.userid_locked)
      wx.setStorageSync('phoneNumber', res.data.data.phone)
      if (res.data.result_code == 360) {
        wx.showToast({
          title: '登陆成功',
          icon: 'success',
          success: function (res) {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        })
      } else {
        wx.showToast({
          title: res.data.data.msg,
          icon: 'none'
        })
      }
    })
  },

  bindEnded: function (e) {
    if (e.type == 'ended') {
      this.setData({
        mask: false
      })
    }
  }
})