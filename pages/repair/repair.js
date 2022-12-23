var api = require('../../utils/api.js')
var nextClickTime = 60; //设置获取验证码等待期
Page({
  data: {
    // max: 100, //最多字数 (根据自己需求改变)
    takeTime: nextClickTime,
    nextClickTime: nextClickTime,
    phone: '', //手机号码
    verification: '', //验证码
    textarea: '', //其他输入框
    textarea1: '',
    radio: '', //单选框
    equipment: '', //设备号
    log_id: '',
    city: '',
    latitude: '',
    longitude: '',
    cursor: '',
    ispersonalCenter:false  //是否从个人中心跳转过来的
  },
  onLoad: function(options) {
    let that = this;
    if (options.log_id) {
      that.setData({
        log_id: options.log_id
      })
    }
    if (options.ispersonalCenter) {
      that.setData({
        ispersonalCenter: options.ispersonalCenter
      })
    }
    console.log(that.data.ispersonalCenter);
    that.getPosition();
  },
  //字数限制 
  inputs: function(e) {
    // 获取输入框的内容
    var value = e.detail.value;
    this.setData({
      textarea: e.detail.value
    })
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    if (len > this.data.min)
      this.setData({
        texts: " "
      })

    //最多字数限制
    // if (len > this.data.max) return;
    // this.setData({
    //   currentWordNumber: len //当前字数 
    // });
  },
  //字数限制 
  inputs_: function(e) {
    // 获取输入框的内容
    var value = e.detail.value;
    this.setData({
      textarea1: e.detail.value
    })
    console.log(e.detail.value)
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    if (len > this.data.min)
      this.setData({
        texts: " "
      })

    //最多字数限制
    // if (len > this.data.max) return;
    // this.setData({
    //   currentWordNumber: len //当前字数 
    // });
  },
  //验证码倒计时 调用verification
  getVerCode: function(e) {
    var that = this;

    if (e && this.data.takeTime == nextClickTime) {
      if (this.data.phone == undefined) {
        wx.showToast({
          title: '手机号不能为空',
          icon:'none'
        })
        return;
      }

      if (!/^1[3456789]\d{9}$/.test(this.data.phone)) {
        wx.showToast({
          title: '手机号不正确',
          icon: 'none'
        })
        return;
      }
      that.verification(e);
    }

    if (e && this.data.takeTime != nextClickTime) {
      return;
    } else {
      var takeTime = that.data.takeTime - 1;
      that.setData({
        takeTime: takeTime
      })
    }

    setTimeout(function() {
      if (takeTime > 1) {
        that.getVerCode();
      } else {
        that.setData({
          takeTime: nextClickTime
        })
      }
    }, 1000);
  },
  //手机号输入框
  phone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //验证码输入框
  verification_ipt: function(e) {
    this.setData({
      verification: e.detail.value
    })
  },
  //单选框
  radioChange(e) {
    this.setData({
      radio: e.detail.value
    })
  },
  //端口号后四位
  equipment: function(e) {
    let that = this;
    that.setData({
      equipment: '',

    })
    let data = {
      equipment: e.detail.value,
      userid_locked: wx.getStorageSync("userid_locked")
    }
    if (e.detail.cursor == 8) {
      api.form_('Scan/verify_port', data, null, function success(res) {
        wx.showToast({
          icon: 'loading',
          title: res.data.msg,
          duration: 1000
        })
        if (res.data.data.scan) {
          that.setData({
            equipment: res.data.data.scan,
            cursor: e.detail.cursor
          })
        }
      }, function fail(e) {
        console.log(e)
      })
    }
  },
  //小区名称
  city: function(e) {
    this.setData({
      city: e.detail.value
    })
  },
  //获取验证码
  verification: function(e) {
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    let data = {
      phone: this.data.phone,
      user_log_id: this.data.log_id,
      userid_locked: wx.getStorageSync("userid_locked"),
      type:this.data.ispersonalCenter?"5":"3"
    }
    api.form_('Login/send_code', data, e.detail.formId, function success(res) {
      wx.hideLoading()
    }, function fail(e) {
      console.log(e)
    })
  },
  //确定提交
  sureSubmit: function(e) {
    var _this = this;
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    if (!this.data.log_id) {
      if (!_this.data.equipment) {
        wx.showToast({
          title: '请检查设备号',
          icon: 'none'
        })
        return;
      }
      if (!_this.data.city) {
        wx.showToast({
          title: '小区名称错误',
          icon: 'none'
        })
        return;
      }
      console.log(_this.data.textarea1)
      if (_this.data.textarea1 == '') {
        wx.showToast({
          title: '请输入报修原因',
          icon: 'none'
        })
        return;
      }
    }
    if (_this.data.phone == undefined) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    } else if (!/^1[3456789]\d{9}$/.test(_this.data.phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return;
    }
    if (_this.data.radio == '其他' || _this.data.radio == '' && _this.data.log_id) {
      if (_this.data.textarea == '') {
        wx.showToast({
          title: '请输入报修原因',
          icon: 'none'
        })
        return;
      }
    }
    if (_this.data.verification == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    } else {
      let data = {
        phone: _this.data.phone,
        user_log_id: _this.data.log_id,
        identifying_code: _this.data.verification,
        userid_locked: wx.getStorageSync("userid_locked"),
        bright: _this.data.radio,
        textarea: _this.data.textarea,
        text: _this.data.textarea1,
        equipment: _this.data.equipment,
        community: _this.data.city,
        latitude: _this.data.latitude,
        longitude: _this.data.longitude
      }
      api.form_(_this.data.ispersonalCenter ? "Money/feedback" :"Scan/repair", data, e.detail.formId, function success(res) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        if (res.data.result_code == '322'||res.data.result_code == '349'||res.data.result_code == '377') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../index/index'
            })
          },3000)
        }
      }, function fail(e) {
        console.log(e)
      })
    }
  },


  //获取地理位置
  getPositionAlign: function() {
    let that = this;
    console.log("getPositionAlign")
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var lat = res.latitude;
        var log = res.longitude;
        that.setData({
          latitude: lat,
          longitude: log
        })
      },
      error: function(e) {
        console.log(e)
      }
    })
  },
  getPosition1: function() {
    console.log(1)
    wx.getLocation({
      success: function(res) {
        console.log('succes1')
        console.log(res)

      },
      fail: function() {
        wx.getSetting({
          success(res) {
            console.log(res.authSetting['scope.userLocation'])
            if (!res.authSetting['scope.userLocation']) {
    
              wx.authorize({
                scope: 'scope.userLocation',
                success() {
                  wx.getLocation({
                    success: function(res) {
                      console.log(res)
                    },
                  })
                  console.log('success2')
                },
                fail() {
                  console.log("f2")
                }
              })
            }
          }
        })
      }
    })
  },
  getPosition: function() {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function(res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.getPositionAlign();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })

              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.getPositionAlign();
        } else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.getPositionAlign();
        }
      }
    })
  }
})