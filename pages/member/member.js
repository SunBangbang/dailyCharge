var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon1: true,
    icon2: false,
    index: 2,
    data: [],
    isSaveing: false,
    id:'',
    case: '',
    reson: '',
    head: '',
    last: ''
  },
  onLoad: function (options) {
    let that = this;
    console.log(wx.getStorageSync('str'))
    console.log(options.case)
    console.log(options.reson)
    var str = wx.getStorageSync('str')
    if(str) {
      this.setData({
        head: str.split('?')[0],
        last: str.split('?')[1]
      })
    }
    if (options.id) {
      that.setData({
        id: options.id
      })
    }
    if (options.case) {
      that.setData({
        case: options.case
      })
    }
    if (options.reson) {
      that.setData({
        reson: options.reson
      })
    }
    // 会员卡信息
    let data = {
      scan: options.sacn,
      switch_vip: options.switch_,
      vip_sale: options.vip_sale,
      userid_locked: wx.getStorageSync("userid_locked")
    }
    api.form_('Card/vip_detail', data, null, function success(res) {
      that.setData({
        data: res.data.data
      })
    }, function fail(e) {
      console.log(e)
    })

  },
  icon1: function (e) {
    this.setData({
      icon1: false,
      icon2: true,
      index: e.currentTarget.dataset.index
    })
  },
  icon2: function (e) {
    this.setData({
      icon1: true,
      icon2: false,
      index: e.currentTarget.dataset.index
    })
  },
  // 确认开通
  memberbtn: function (e) {
    let that = this.data;
    let this_ = this;
    // if (this_.data.isSaveing)
    //   return;
    //   this_.setData({
    //   isSaveing: true
    // })
    wx.showToast({
      title: '提交中...',
      icon: 'loading'
    })
    if (this_.data.index == 2) {
      wx.showToast({
        title: '请勾选权益',
        icon: 'loading'
      })
      this_.setData({
        isSaveing: false
      })
    } else {
 
      wx.login({
        success: function (res) {
          let data = {
            code: res['code'],
            fee: that.data.member_money,
            member: 2
          }
          api.form_('pay/pay_fee', data, null, function success(res) {
            if (res.data.result_code == 314) {
              let order_id = res.data.data.order_id;
              if (order_id == "") {
                wx.showToast({
                  title: '请重新提交',
                  icon: 'loading'
                })
                this.setData({
                  isSaveing: false
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
                      console.log(res)
                      if (that.id == 1) {
                        wx.redirectTo({
                          url: '../cardBag/cardBag'
                        })
                      } else {
                        if (this_.data.case) {
                          wx.reLaunch({
                            url: '../index/index?str=' + this_.data.head + `&${this_.data.last}` + '&case=true'
                          })
                        } else if(this_.data.reson) {
                          wx.reLaunch({
                            url: '../index/index?str=' + this_.data.head + `&${this_.data.last}` + '&reson=true'
                          })
                        } else {
                          wx.reLaunch({
                            url: '../index/index?str=' + that.data.head + `&${that.data.last}`
                          })
                        }
                      }
                    }, function fail(e) {
                      console.log(e)
                    })
                  },
                  fail: function (e) {
                    wx.showToast({
                      title: '支付失败...',
                      icon: 'loading'
                    })
                    this_.setData({
                      isSaveing: false
                    })
                  }
                })
              }
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
    }
  },
  // 会员卡权益
  vip: function () {
    wx.navigateTo({
      url: '../vipEquity/vipEquity?card_id=' + this.data.data.card_id
    })
  }
})