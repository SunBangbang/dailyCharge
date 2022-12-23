// pages/buyCar/payMethod/payMethod.js
var api = require('../../../utils/api.js')
Page({

  data: {
    isWhiteAdd: true,
    isExpress: false,
    data: null,
    footsPrice: '',
    zero_sku: '',
    num: '',
    name: '',
    mobie: '',
    goods_id: ''
  },

  onLoad: function(options) {
   let data =JSON.parse(options.data)
    this.setData({
      data: data,
      footsPrice: data.footsPrice / 100,
      zero_sku: data.zero_sku,
      num: data.data.num,
      goods_id: data.goods_id
    })
    // if (!this.data.isExpress) {
    //   let thisData = this.data.data;
    //   thisData.price = parseInt(thisData.price) - parseInt(this.data.footsPrice * 100);
    //   this.setData({
    //     data: thisData
    //   })
    // }
  },

  onShow: function(options) {
    if (this.data.address) {
      this.setData({
        isWhiteAdd: false
      })
    }
  },
  // 姓名
  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 手机
  mobie: function(e) {
    this.setData({
      mobie: e.detail.value
    })
  },
  // setExpress: function(o) {
  //   if (this.data.isExpress != (o.currentTarget.dataset.check == "true")) {
  //     let data = this.data.data;
  //     if (o.currentTarget.dataset.check != "true") {
  //       data.price = parseInt(data.price) - parseInt(this.data.footsPrice * 100);
  //     } else {
  //       data.price = parseInt(data.price) + parseInt(this.data.footsPrice * 100);
  //     }
  //     this.setData({
  //       data: data
  //     })
  //   }
  //   this.setData({
  //     isExpress: o.currentTarget.dataset.check == "true"
  //   })


  // },

  choseAddress: function() {
    wx.navigateTo({
      url: '../editAddress/editAddress',
    })
  },

  choiceSure: function() {
    // if (this.data.isExpress && this.data.address == null) {
    //   wx.showToast({
    //     title: '未填写地址',
    //     icon: 'none',
    //     duration: 2000,
    //     mask: true
    //   })
    //   return;
    // } 

    let that = this;
    if (!that.data.name) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    if (!that.data.mobie) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    } else if (!/^1[3456789]\d{9}$/.test(that.data.mobie)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }

    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    wx.login({
      success: function(res) {
        let data = {
          code: res['code'],
          fee: that.data.data.price,
          member: 9,
          attr_id: that.data.data.data.uid,
          mobile: that.data.mobie,
          consignee: that.data.name,
          goods_id: that.data.goods_id

          // is_foots: that.data.isExpress ? 2 : 1
        }
        // if (that.data.isExpress) {
        //   data.consignee = that.data.address.name;
        //   data.mobile = that.data.address.phone;
        //   data.address = that.data.address.address;
        //   data.detailed = that.data.address.detailed;
        // }
        api.form_('pay/pay_fee', data, null, function success(res) {
          console.log(res.data)
          if(res.data.result_code==314){
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
              success: function(res) {
                let data = {
                  order_id: order_id,
                  userid_locked: wx.getStorageSync('userid_locked')
                }
                api.form_('pay/check_pay', data, null, function success(res) {
                  wx.hideLoading()
                  if (res.data.result_code == '300') {
                    wx.showToast({
                      title: res.data.msg,
                      icon: "success",
                      mask: true
                    })
                    wx.reLaunch({
                      url: '../rate/rate'
                    })
                  }
                }, function fail(e) {
                  console.log(e)
                })
              },
              fail: function(res) {
                let data = {
                  order_id: order_id,
                  color: that.data.data.data.uid
                }
                api.form_('buycar/cancle_order', data, null, function success(res) {
                  wx.hideLoading()
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2000
                  })
                }, function fail(e) {
                  console.log(e)
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

  },
  intoMap: function() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) { //因为这里得到的是你当前位置的经纬度
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