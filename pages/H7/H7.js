var api = require('../../utils/api.js')
Page({
  data: {
    money: '',
    name: '',
    idCard: '',
    phone: '',
    eMail: '',
    type: '',
    course: '',
    userid_locked: '',
    phoneNumber: '',
    merchant: '',
    serial_number:'',
    brand: ''
  },
  onLoad(options) {
    let that = this;
    that.setData({
      serial_number: decodeURIComponent(options.q)
    })
    wx.request({
      url: 'https://api.cd1a.cn/index.php/index15/Activity/merchant_info',
      data: {
        serial_number: decodeURIComponent(options.q)
      },
      success(res) {
        that.setData({
          merchant: res.data.data.info.merchant
        })
      }
    })
  },
  onShow() {
    let that = this
    that.setData({
      userid_locked: wx.getStorageSync("userid_locked"),
      phoneNumber: wx.getStorageSync("phoneNumber")
    })
  },
  money: function (o) {
    this.setData({
      money: o.detail.value
    })
  },
  name: function (o) {
    this.setData({
      name: o.detail.value
    })
  },
  idCard: function (o) {
    this.setData({
      idCard: o.detail.value
    })
  },
  phone: function (o) {
    this.setData({
      phone: o.detail.value
    })
  },
  eMail: function (o) {
    this.setData({
      eMail: o.detail.value
    })
  },
  type: function (o) {
    this.setData({
      type: o.detail.value
    })
  },
  brand: function (o) {
    this.setData({
      brand: o.detail.value
    })
  },
  // 确定
  sure: function () {
    let that = this;
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    if (that.data.money == '' || that.data.money == 0) {
      wx.showToast({
        title: '金额不能为空',
        icon: 'none'
      })
    } else if(that.data.name == '' || that.data.name == 0) {
      wx.showToast({
        title: '名字不能为空',
        icon: 'none'
      })
    } else if(that.data.brand == '' || that.data.brand == 0) {
      wx.showToast({
        title: '车两品牌不能为空',
        icon: 'none'
      })
    } else if(that.data.type == '' || that.data.type == 0) {
      wx.showToast({
        title: '车辆型号不能为空',
        icon: 'none'
      })
    } else if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.data.idCard) == false) {  // 身份证号验证
      wx.showToast({
        title: '身份证号错误',
        icon: 'none'
      })
    } else if(/^1[3456789]\d{9}$/.test(that.data.phone) == false) {  // 电话号码验证
      wx.showToast({
        title: '电话号错误',
        icon: 'none'
      })
    } else if(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(that.data.eMail) == false) {  // 邮箱验证
      wx.showToast({
        title: '邮箱错误',
        icon: 'none'
      })
    } else {
      wx.login({
        success: function (res) {
          wx.request({
            url: 'https://api.cd1a.cn/index.php/index20/Pay/pay_fee',
            data: {
              code: res['code'],
              fee: that.data.money * 100,
              member: 12,
              version: '4.2.1',
              platform: 'applet',
              serial_number: that.data.serial_number,
              consignee: that.data.name,
              id_card: that.data.idCard,
              mobile: that.data.phone,
              email: that.data.eMail,
              car_model: that.data.type,
              brand: that.data.brand
            },
            success(res) {
              console.log(res)
              if(res.data.return_code==200){
                let order_id = res.data.data.order_id;
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: 'MD5',
                  paySign: res.data.data.paySign,
                  success: function (res) {
                    wx.request({
                      url: 'http://api.cd1a.cn/index.php/index20/Pay/check_pay',
                      data: {
                        order_number: order_id,
                        userid_locked: wx.getStorageSync('userid_locked')
                      },
                      method: 'post',
                      success(res) {
                        wx.hideLoading();
                        wx.showToast({
                          title: res.data.msg,
                          duration: 2000
                        })
                        wx.redirectTo({
                          url: '../detail/detail?id=' + order_id
                        })
                        that.setData({
                          money: ''
                        })
                      },
                      fail(res) {
                        wx.hideLoading();
                      }
                    })
                  },
                  fail(res) {
                    wx.hideLoading();
                  }
                })
              }else{
                wx.hideLoading();
                wx.showToast({
                  title: res.data.msg,
                  duration: 2000,
                  icon:'loading'
                })
              }
            }
          })
        }
      })
    }
  },
  bindGetUserInfo: function (e) {
    let that = this;
    if (!wx.getStorageSync("userid_locked")) {
      wx.showLoading({
        title: '请稍等...',
        mask: true
      })
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success: function () {
                wx.hideLoading()
                that.getUserInfo(); //第一次授权
              },
              fail: function () {
                wx.showToast({
                  icon: "none",
                  title: '获取授权失败，请重试',
                  mask: true
                })
              }
            })
          } else {
            wx.getUserInfo({
              success: function (res) {
                that.getUserInfo(); //不是首次授权
              }
            })
          }
        }
      })
    } else {
      wx.hideLoading()
      // that.sure();
    }
  },
  getUserInfo: function () {
    let that = this;
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (e) {
            //插入登录的用户的相关信息到数据库
            let data = {
              encryptedData: e['encryptedData'],
              iv: e['iv'],
              rawData: JSON.parse(e['rawData']),
              code: res['code']
            }
            console.log(res['code'])
            wx.request({
              url: 'https://api.cd1a.cn/index.php/index15/Login/index',
              data: data,
              method: 'post',
              success(res) {
                wx.setStorageSync('userid_locked', res.data.userid_locked);
                wx.setStorageSync('phoneNumber', res.data.phone);
                console.log(res.data)
                that.setData({
                  userid_locked: res.data.userid_locked,
                  phoneNumber: res.data.phone
                })
                wx.hideLoading()
              }
            })
          },
          fail: function () {
            wx.showToast({
              title: '未知错误',
              icon: 'none',
              mask: true
            })
          }
        })
      }
    })
  },
  getPhoneNumber: function (e) {
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    var that = this;
    if (e.detail.errMsg == 'getPhoneNumber:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权'
      })
    } else {
      wx.login({
        success: function (res) {
          let data = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            code: res['code']
          }
          api.form_('userlog/phone', data, null, function success(res) {
            console.log(res)
            wx.setStorageSync("phoneNumber", res.data.phoneNumber);
            if (wx.getStorageSync("phoneNumber") != "") {
              wx.setStorageSync('userid_locked', res.data.userid);
              that.setData({
                userid_locked: res.data.userid,
                phoneNumber: res.data.phoneNumber
              })
              wx.showToast({
                title: '获取成功',
                icon: 'success'
              })
            } else {
              wx.showToast({
                title: '获取失败',
                icon: 'none'
              })
            }
          }, function fail(e) {
            console.log(e)
          })
        }
      })
    }
  }
}) 