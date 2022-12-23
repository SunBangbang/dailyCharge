var api = require('../../utils/api.js')
Page({
  data: {
    data: [],
    icon1: false,
    icon2: true,
    takeTime: 5,
    id: '',
    checkIndex: 0, //默认选中
    card_id: 0,
    upgrade: '',
    isSaveing:false,
    case: '',
    reson: '',
    head: '',
    last: ''
  },
  onLoad: function (options) {
    let that = this;
    if (options.card_id) {
      that.setData({
        upgrade: options.upgrade,
        card_id: options.card_id
      })
    }
    console.log(options.case)
    console.log(options.reson)
    if (options.id) {
      that.setData({
        id: options.id
      })
    }
    if (options.reson) {
      this.setData({
        reson: options.reson
      })
    }
    if (options.case) {
      this.setData({
        case: options.case
      })
    }
    that.listData()
    // that.takeTimeOut();
    console.log(wx.getStorageSync('str'))
    var str = wx.getStorageSync('str')
    if(str) {
      this.setData({
        head: str.split('?')[0],
        last: str.split('?')[1]
      })
    }
  },
  // 渲染
  listData: function () {
    let that = this;
    if (that.data.card_id == 'undefined' || that.data.card_id == undefined) {
      that.data.card_id = ''
    }
    if (that.data.upgrade == undefined) {
      that.data.upgrade = ''
    }
    let data = {
      userid_locked: wx.getStorageSync("userid_locked"),
      upgrade: that.data.upgrade,
      card_id: that.data.card_id
    }
    api.form_('Card/card_detail', data, null, function success(res) {
      console.log(res.data)
      if(res.data.result_code == 375) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
      that.setData({
        data: res.data.data
      })
    }, function fail(e) {
      console.log(e)
    })
  },
  // 支付
  pay: function (e) {
    // if (this.data.isSaveing)
    //   return;
    // this.setData({
    //   isSaveing: true
    // })
    wx.showLoading({
      title: '请稍等...',
      mask: true,
    })
    let that = this;
    if (that.data.icon1) {
      wx.showToast({
        icon: 'loading',
        title: '请勾选月卡权益',
        duration: 2000
      })
      this.setData({
        isSaveing: false
      })
    } else {
      wx.login({
        success: function (res) {
          let data = {
            code: res['code'],
            member: 5,
            cal_id: that.data.data.cal_id,
            card_id: that.data.card_id,
            upgrade: that.data.upgrade ? that.data.upgrade : 1,
            rank: that.data.data.list[that.data.checkIndex].uid,
            fee: that.data.data.list[that.data.checkIndex].this_pay
          }
          if (that.data.data.upgrade == 3) { //升级传参
            data.fee = that.data.data.list[that.data.checkIndex].this_pay - that.data.data.have_pay;
          }
          api.form_('pay/pay_fee', data, null, function success(res) {
            if (res.data.result_code == 314) {
              let order_id = res.data.data.order_id;
              if (order_id == "") {
                wx.showToast({
                  title: '请重新提交',
                  icon: 'loading'
                })
                that.setData({
                  isSaveing: false
                })
                wx.hideLoading()
              } else {
                wx.showLoading({
                  title: '支付中...',
                  mask: true,
                })
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
                      that.setData({
                        isSaveing: false
                      })
                      wx.showToast({
                        title: '支付成功',
                        duration: 2000,
                        mask: true
                      })
                      setTimeout(
                        function () {
                          if (that.data.id == 1) {
                            wx.redirectTo({
                              url: '../cardBag/cardBag'
                            })
                          } else {
                            if(that.data.case) {
                              wx.reLaunch({
                                url: '../index/index?str=' + that.data.head + `&${that.data.last}` + '&case=true'
                              })
                            } else if(that.data.reson) {
                              wx.reLaunch({
                                url: '../index/index?str=' + that.data.head + `&${that.data.last}` + '&reson=true'
                              })
                            } else {
                              wx.reLaunch({
                                url: '../index/index?str=' + that.data.head + `&${that.data.last}`
                              })
                            }
                          }
                        }, 2000
                      )
                    }, function fail(e) {
                      console.log(e)
                      wx.hideLoading()
                    })
                  },
                  fail: function (e) {
                    that.setData({
                      isSaveing: false
                    })
                    wx.showToast({
                      title: '支付失败',
                      icon: 'loading',
                      duration: 2000,
                      mask: true
                    })
                  }
                });
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }

          }, function fail(e) {
            wx.hideLoading()
            console.log(e)
          })
        }
      })
    }
  },
  icon1: function (e) {
    // if (this.data.takeTime > 0) {
    //   return;
    // }
    this.setData({
      icon1: false,
      icon2: true
    })
  },
  icon2: function (e) {
    this.setData({
      icon1: true,
      icon2: false
    })
  },
  takeTimeOut: function () {
    var that = this;
    setTimeout(function () {
      var takeTime = that.data.takeTime - 1;
      that.setData({
        takeTime: takeTime
      })
      if (takeTime > 0) {
        that.takeTimeOut();
      }
    }, 1000);
  },
  mcard_: function (e) {
    console.log(this.data.data.cal_id)
    wx: wx.navigateTo({
      url: '../mcardEquity/mcardEquity?upgrade=' + this.data.upgrade + '&card_id=' + this.data.data.cal_id
    })
  },
  choose: function (o) {
    var option = this.data.data.list[o.currentTarget.dataset.index];
    this.setData({
      checkIndex: o.currentTarget.dataset.index
    })
  }

})