// pages/pay/pay.js
var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(options.fee)
    let fee = options.fee.replace(/[^0-9]/ig,'')
    console.log(fee)
    wx.login({
      success: function(res) {
        console.log(res)
        let data = {
          code: res['code'],
          fee: fee,
          member: 14,
          battery_id: options.orderId
        }
        api.form_('pay/pay_fee', data, null, function(res) {
          console.log(res.data)
          if(res.data.result_code == 314) {
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
                success(res) {
                  console.log(res.data)
                  let data = {
                    order_id: order_id,
                    userid_locked: wx.getStorageSync('userid_locked')
                  }
                  api.form_('pay/check_pay', data, null, function success(res) {
                    console.log(res.data)
                    if(res.data.result_code == '300') {
                      wx.redirectTo({
                        url: '../battery/battery?url=' + wx.getStorageSync('battery_button_url')
                      })
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'loading',
                        duration: 2000
                      })
                    }
                  })
                },
                fail(res) {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'loading',
                    duration: 2000,
                    success: function() {
                      setTimeout(() => {
                        wx.navigateBack({
                          delta: 1
                        })
                      },3000)
                    }
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
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})