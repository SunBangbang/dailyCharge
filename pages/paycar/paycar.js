// pages/paycar/paycar.js
import api from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    tel: '',
    details_data: {},
    area: '',
    zone: '',
    place: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(JSON.parse(decodeURIComponent(options.details)))
    let data = JSON.parse(decodeURIComponent(options.details))
    this.setData({
      details_data: data
    })
    api.active('Trans/GetProvince', null, function success(res) {
      console.log(res)
      that.setData({
        area_arr: res.data.data
      })
    },
    function fail(err) {
      console.log(err)
    })
  },

  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  tel: function(e) {
    this.setData({
      tel: e.detail.value
    })
  },

  area: function(e) {
    this.setData({
      area: e.detail.value
    })
  },

  // 地区选择
  bindRegionChange: function(e) {
    let zone = e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
    this.setData({
      zone: zone,
      place: e.detail.value
    })
  },

  confirm: function() {
    let reg = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g
    if(this.data.tel == '' || this.data.name == '' || this.data.area == '' || this.data.zone == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
    } else if(/^1[3456789]\d{9}$/.test(this.data.tel) == false) {
      wx.showToast({
        title: '电话号错误',
        icon: 'none'
      })
    } else if(reg.test(this.data.name) || reg.test(this.data.tel) || reg.test(this.data.area)) {
      wx.showToast({
        title: '不支持此类型内容',
        icon: 'none'
      })
    } else {
      let that = this
      wx.login({
        success: function(res) {
          console.log(res)
          let data = {
            code: res['code'],
            fee: that.data.details_data.price * 100,
            number: that.data.details_data.num,
            goods_id: that.data.details_data.id,
            attr_id: that.data.details_data.type,
            consignee: that.data.name,
            mobile: that.data.tel,
            address: that.data.area,
            province: that.data.place[0],
            city: that.data.place[1],
            area: that.data.place[2],
            member: 16
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
                    console.log(res)
                    let data = {
                      order_id: order_id,
                      userid_locked: wx.getStorageSync('userid_locked')
                    }
                    api.form_('pay/check_pay', data, null, function success(res) {
                      console.log(res.data)
                      if(res.data.result_code == '300') {
                        if (wx.getStorageSync('nav')) {
                          wx.removeStorageSync('nav')
                          wx.navigateBack({
                            delta: 4,
                          })
                        } else {
                          wx.reLaunch({
                            url: '../car/car',
                          })
                        }
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
                      icon: 'loading'
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
    }
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