var api = require('../../utils/api.js')
Page({
  data: {
    operator_phone: wx.getStorageSync('operator_phone'),
    data: '',
    mask: true,
    enter_coupon: '',
    referral_bonuses: false,
    user_info: false,
    showCoupon: '',
    phoneNumber: '', // 用户电话号码
    case: '', // 临时充电
    reson: '', // 月卡充电
    userid: '', // 邀请新用户
    user_id: '' // 邀请好友购车
  },
  onShow: function () {
    if (wx.getStorageSync("phoneNumber") != "") {
      this.setData({
        phoneNumber: wx.getStorageSync("phoneNumber")
      })
    }
    this.popcop();
    wx.hideLoading();
  },

  // 正则验证
  GetQueryString: function (url, name) {
    let reg = new RegExp("(^|/?|&)" + name + "=([^&]*)(&|$)", "i");
    let r = url.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    };
    return null;
  },
  // 6折换电活动
  six_discount: function (url, params = null, paramter = null) {
    wx.setStorageSync('discount', url)
    if (!wx.getStorageSync("userid_locked")) {
      if (params && paramter) {
        wx.redirectTo({
          url: '../authorize/authorize?six_activity=' + params + '&user_agent=' + paramter
        })
      } else if (params) {
        wx.redirectTo({
          url: '../authorize/authorize?six_activity=' + params
        })
      } else {
        wx.redirectTo({
          url: '../authorize/authorize?six_activity=six'
        })
      }
    } else {
      let data = {
        qrcode: url
      }
      api.form_('Activity/enter_activity_h', data, null, function success(res) {
        console.log(res)
        if (res.data.result_code == '500') {
          if (params && paramter) {
            let data = {
              userid_locked: wx.getStorageSync('userid_locked'),
              t_id: paramter
            }
            api.active('Trans/records', data, function sucess(res) {
              console.log(res)
              if (res.data.code == 1) {
                // 扫码商城
                wx.redirectTo({
                  url: '/pages/product/product?id=' + params + '&user_id=' + paramter
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            })
          } else if (params) {
            // 换电
            wx.navigateTo({
              url: '../battery/battery?url=' + res.data.data.url + '&hd=' + params
            })
          } else {
            // 6折换电
            wx.navigateTo({
              url: '../battery/battery?url=' + res.data.data.url
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  // 邀请购车
  buy_car: function (params) {
    if (params) {
      this.setData({
        user_id: params
      })
      if (!wx.getStorageSync('userid_locked')) {
        wx.redirectTo({
          url: '../authorize/authorize?user_id=' + params
        })
      } else {
        let data = {
          userid_locked: wx.getStorageSync('userid_locked'),
          referrer_id: params
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
              icon: 'none'
            })
          }
        })
      }
    }
  },
  // 邀请好友助力
  help_friend: function (params) {
    if (params) {
      if (!wx.getStorageSync('userid_locked')) {
        wx.redirectTo({
          url: '/pages/authorize/authorize?hd=' + params
        })
      } else {
        console.log(wx.getStorageSync('battery_button_url'))
        wx.redirectTo({
          url: '/pages/battery/battery?url=' + wx.getStorageSync('battery_button_url') + '&hd=' + params
        })
      }
    }
  },
  // 扫描设备码
  scan_charge: function () {
    let that = this
    if (!wx.getStorageSync('userid_locked')) {
      wx.redirectTo({
        url: '../authorize/authorize'
      })
    } else {
      let data = {
        userid_locked: wx.getStorageSync('userid_locked'),
        str: wx.getStorageSync('str')
      }
      api.form_('Scan/scan', data, null, function success(res) {
        console.log(res.data)
        switch (res.data.result_code) {
          case "500": //推广活动参与成功
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg
            })
            break;
          case "501": //推广活动已参与
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg
            })
            break;
          case "502": //推广活动领取失败
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg
            })
            break;
          case "503": //请扫描正确的活动码
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg
            })
            break;
          case "504": //活动已结束，谢谢参与
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg
            })
            break;
          case "300": //成功
            var data = JSON.stringify(res.data.data);
            wx.setStorageSync('operator_phone', res.data.data.operator_phone);
            if (that.data.case) { //临时充电
              wx.redirectTo({
                url: '../openCharging/openCharging?support_month_card=' + res.data.support_month_card + '&num_id=' + res.data.num_id + '&data=' + data + '&case=true'
              })
            } else if (that.data.reson) { //月卡充电
              wx.redirectTo({
                url: '../openCharging/openCharging?support_month_card=' + res.data.support_month_card + '&num_id=' + res.data.num_id + '&data=' + data + '&reson=true'
              })
            } else {
              wx.redirectTo({
                url: '../openCharging/openCharging?support_month_card=' + res.data.support_month_card + '&num_id=' + res.data.num_id + '&data=' + data
              })
            }
            break;
          default: //其他
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg
            })
            break;
        }
      }, function fail(e) {
        console.log(e)
      })
    }
  },
  // 邀请新用户
  new_friend: function (params) {
    if (params) {
      this.setData({
        userid: params
      })
      if (!wx.getStorageSync('userid_locked')) {
        wx.redirectTo({
          url: '../authorize/authorize?userid=' + params
        })
      } else {
        wx.showToast({
          title: '您不是新用户',
          icon: 'none'
        })
      }
    }
  },
  onLoad: function (options) {
    let that = this
    // 如果用户未授权
    console.log(options)
    // 其他页面传递过来的参数
    if (options.case) { //临时充电
      that.setData({
        case: options.case
      })
    }
    if (options.reson) { //月卡充电
      that.setData({
        reson: options.reson
      })
    }
    if (options.str) { // 购买月卡，会员卡，优惠券 之类的做重新跳转
      that.scan_charge(options.str)
    }
    if (options.user_id) { // 小程序分享购车页面
      that.buy_car(options.user_id)
    }
    if (options.userid) { // 小程序分享邀请新用户
      that.new_friend(options.userid)
    }

    // 如果是搜索小程序非扫码进入
    if (wx.getStorageSync('userid_locked')) {
      this.setData({
        user_info: true // 专们给微信官方提供的平台 (如果是外部扫码进来的没有授权)
      })
    }

    // 首先查看是否为外部扫描二维码进去
    if (options.q != undefined) {
      // 判断是有没有授权
      if (wx.getStorageSync('userid_locked')) {
        this.setData({
          user_info: true // 专们给微信官方提供的平台 (如果是外部扫码进来的没有授权)
        })
      }

      // 如果存在统一在这里面做处理
      let url = decodeURIComponent(options.q) // 外部扫码
      let userid = that.GetQueryString(url, "userid") //邀请新用户 https://cd1a.cn/pages/index/index?userid=
      let user_id = that.GetQueryString(url, "user_id") //购车邀请好友 https://cd1a.cn/pages/index/index?user_id=
      let six_discount = that.GetQueryString(url, 'six') //6折换电活动的二维码 && 推荐代理
      let hd = that.GetQueryString(url, 'hd') // 邀请好友助力
      console.log(url)
      // 6折换电活动 && 推荐代理 && 扫码商城
      if (six_discount) {
        let a_id = that.GetQueryString(url, 'a_id')
        let goods_id = that.GetQueryString(url, 'goods_id')
        let users_id = that.GetQueryString(url, 'users_id')
        if (a_id) {
          that.six_discount(url, a_id) // 推荐代理
        } else if (goods_id && users_id) {
          that.six_discount(url, goods_id, users_id) // 扫码商城
        } else {
          that.six_discount(url) // 6折换电
        }
      }
      // 邀请新用户
      that.new_friend(userid)
      // 购车邀请好友
      that.buy_car(user_id)
      // 邀请好友助力
      that.help_friend(hd)

      // 其他的外部扫码没有这些判断的都走设备扫码
      if (!user_id && !userid && !six_discount && !hd) {
        wx.setStorageSync('str', url)
        that.scan_charge() //如果有外部扫码  且没有权限  存下来
      }
    }
  },

  // 未授权时跳入的页面
  person: function () {
    if (!wx.getStorageSync('userid_locked')) {
      wx.navigateTo({
        url: '../personal/personal'
      })
    }
  },

  // 小程序内部扫码
  sweepCode: function (e) {
    let that = this
    console.log(that.data.paramter)
    if (!wx.getStorageSync('userid_locked')) {
      wx.redirectTo({
        url: '/pages/authorize/authorize?userid=' + that.data.userid + '&user_id=' + that.data.user_id
      })
    } else {
      wx.scanCode({
        success: (res) => {
          console.log(res.result)
          // 端口号
          var str = res.result;
          // 缓存端口号
          wx.setStorageSync('str', str);

          let data = {
            "userid_locked": wx.getStorageSync('userid_locked'), //用户唯一识别
            "str": str, //端口号
          }

          api.form_('Scan/scan', data, null, function success(res) {
            console.log(res.data)
            switch (res.data.result_code) {
              case "500": //推广活动参与成功
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.msg
                })
                break;
              case "501": //推广活动已参与
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.msg
                })
                break;
              case "502": //推广活动领取失败
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.msg
                })
                break;
              case "503": //请扫描正确的活动码
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.msg
                })
                break;
              case "504": //活动已结束，谢谢参与
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.msg
                })
                break;
              case "300": //成功
                var data = JSON.stringify(res.data.data);
                wx.setStorageSync('operator_phone', res.data.data.operator_phone);
                wx.redirectTo({
                  url: '../openCharging/openCharging?support_month_card=' + res.data.support_month_card + '&num_id=' + res.data.num_id + '&data=' + data
                })
                break;
              default: //其他
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.msg
                })
            }
          }, function fail(e) {
            console.log(e)
          })
        },
        fail: (res) => {
          console.log('失败')
        }
      })
    }
  },

  // 换电
  battery: function () {
    wx.navigateTo({
      url: '../battery/battery?url=' + this.data.enter_coupon.battery_button_url
    })
  },

  //弹窗
  popcop: function () {
    let that = this;
    let data = {
      "userid_locked": wx.getStorageSync('userid_locked'), //用户唯一识别
    }
    api.form_('Money/enter_coupon', data, null, function success(res) {
      console.log(res.data)
      if (res.data.data) {
        wx.setStorageSync('battery_button_url', res.data.data.battery_button_url)
        that.setData({
          enter_coupon: res.data.data,
          showCoupon: res.data.data.battery_help
        })
      }
      if (res.data.result_code == 300 && res.data.data.referral_bonuses && res.data.data.referral_bonuses == 2) {
        that.setData({
          referral_bonuses: true
        })
      }
    }, function fail(e) {
      console.log(e)
    })
  },


  close: function () {
    this.setData({
      showCoupon: 1
    })
  },


  //用户协议
  agreement: function () {
    wx.navigateTo({
      url: '../agreement/agreement'
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


  //远程开启
  remoteOpen: function (e) {
    wx.navigateTo({
      url: '../remoteOpen/remoteOpen'
    })
  },
  // 跳转个人中心
  getPersonalCenter: function () {
    wx.navigateTo({
      url: '../personalCenter/personalCenter'
    })
  },

  //自动获取手机号并提示远程开启
  getPhoneRemote: function (e) {
    let that = this
    // 点击确定按钮
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let data = {
        type: 1,
        userid_locked: wx.getStorageSync('userid_locked')
      }
      api.form_('Money/judge_phone', data, null, function success(res) {
        console.log(res.data)
        // 371已绑定手机号 370未绑定手机号
        if (res.data.result_code == '370') {
          wx.login({
            success: function (res) {
              let data = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                code: res['code']
              }
              console.log(data)
              api.get_('Login/get_applet_phone', data, null, function success(res) {
                console.log(res)
                if (res.data.result_code == '361') {
                  wx.setStorageSync("phoneNumber", res.data.phone)
                  that.setData({
                    phoneNumber: res.data.phone
                  })
                  wx.showToast({
                    title: '获取成功',
                    icon: 'success',
                    complete: function () {
                      wx.navigateTo({
                        url: '../remoteOpen/remoteOpen'
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              }, function fail(e) {
                console.log(e)
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            success: function() {
              if (res.data.data.phone) {
                wx.setStorageSync('phoneNumber', res.data.data.phone)
                that.setData({
                  phoneNumber: res.data.phone
                })
                wx.navigateTo({
                  url: '../remoteOpen/remoteOpen'
                })
              }
            }
          })
        }
      })
    } else {
      // 点击取消按钮
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },

  // 自动获取电话并且授权并跳转个人中心
  getPhoneNumber: function (e) {
    let that = this
    // 点击确定按钮
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let data = {
        type: 1,
        userid_locked: wx.getStorageSync('userid_locked')
      }
      api.form_('Money/judge_phone', data, null, function success(res) {
        console.log(res.data)
        // 371已绑定手机号 370未绑定手机号
        if (res.data.result_code == '370') {
          wx.login({
            success: function (res) {
              let data = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                code: res['code']
              }
              console.log(data)
              api.get_('Login/get_applet_phone', data, null, function success(res) {
                console.log(res)
                if (res.data.result_code == '361') {
                  wx.setStorageSync("phoneNumber", res.data.phone)
                  that.setData({
                    phoneNumber: res.data.phone
                  })
                  wx.showToast({
                    title: '获取成功',
                    icon: 'success',
                    complete: function () {
                      wx.navigateTo({
                        url: '../personalCenter/personalCenter'
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              }, function fail(e) {
                console.log(e)
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            success: function() {
              if (res.data.data.phone) {
                wx.setStorageSync('phoneNumber', res.data.data.phone)
                that.setData({
                  phoneNumber: wx.getStorageSync("phoneNumber")
                })
                wx.navigateTo({
                  url: '../personalCenter/personalCenter'
                })
              }
            }
          })
        }
      })
    } else {
      // 点击取消按钮
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },

  // 签到
  signin: function () {
    wx.navigateTo({
      url: '../signin/signin'
    })
  },
  // 游戏
  gameLogo: function () {
    wx.navigateTo({
      url: '../gameLogo/gameLogo?url=' + this.data.enter_coupon.ad_url,
    })
  }
})