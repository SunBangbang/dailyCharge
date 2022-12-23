var api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    mobie: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  mobie: function(e) {
    this.setData({
      mobie: e.detail.value
    })
  },
  checkNew: function(e) {
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked')
    }
    api.form_('buycar/have_join', data, e.detail.formId, function success(res) {
      if (res.data.code == 2) {
        wx.showToast({
          title: '当前账户已参与购车活动',
          icon: 'none',
          duration: 2000
        })
      } else {
        that.goPay();
      }
    }, function fail(e) {
      console.log(e)
    })
  },
  goPay: function(e) {
    let this_ = this;
    let that = this.data;
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    if (that.name == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (that.mobie == "") {
      wx.showToast({
        title: '电话不能为空',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else if (!/^1[3456789]\d$/.test(that.mobie)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'loading',
        duration: 1000
      })
      return;
    } else {
      wx.login({
        success: function(res) {
          let data = {
            code: res['code'],
            fee: 20000, 
            member: 7,
            name: that.name,
            phone: that.mobie
          }
          api.form_('pay/pay_fee', data, null, function success(res) {
          if(res.data.result_code==314){
            let order_id = res.data.order_id;
            var buy_car_id = res.data.buy_car_id;
            if (order_id == "") {
              wx.showToast({
                title: '请重新提交',
                icon: 'loading'
              })
            } else {
              wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: 'MD5',
                paySign: res.data.paySign,
                success: function(res) {
                  let data = {
                    order_number: order_id,
                    userid_locked: wx.getStorageSync('userid_locked')
                  }
                  api.form_('pay/check_pay', data, null, function success(res) {
                    wx.hideLoading()
                    if (res.data.result == "success") {
                      wx.showToast({
                        title: '付款成功',
                        icon: 'success',
                        duration: 2000
                      })
                      this_.setData({
                        money: ''
                      })
                      wx.redirectTo({
                        url: "../rate/rate?buy_car_id=" + buy_car_id
                      })

                    }
                  }, function fail(e) {
                    console.log(e)
                  })
                },
                fail: function(res) {
                  wx.hideLoading()
                }
              })
            }
          }else{
            console.log('失败')
          }
          }, function fail(e) {
            console.log(e)
          })
        }
      })
    }
  },
  intoMap: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: 34.252727,
          longitude: 108.908976,
          name: "天天出行总部(西安天天充电运营中心) 莲湖区 劳动南路168号10栋天天出行",
          scale: 18
        })
      }
    })
  },
})