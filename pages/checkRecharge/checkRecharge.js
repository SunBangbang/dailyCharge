var api = require('../../utils/api.js')
Page({
  data: {
    money: 0,
    dataset: '',
    data: ''
  },
  onLoad(options) {
    let that = this;
    try{
      that.setData({
        dataset: JSON.parse(options.dataset)
      })
    }catch(e){
      console.log('失败')
    }
 
    that.member()
  },
  // 渲染
  member() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked'),
      kind_id: that.data.dataset.kind_id
    }
    api.form_('Activity/sign_pay_detail', data, null, function success(res) {
      that.setData({
        data: res.data.data
      })
      wx.hideLoading();
    }, function fail(e) {
      console.log(e)
    })
  },
  // 确定支付
  sure() {
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    let that = this;

    wx.login({
      success: function (res) {
        let data = {
          code: res['code'],
          fee: that.data.dataset.price,
          member: 13,
          kind_id: that.data.dataset.kind_id
        }
        api.form_('pay/pay_fee', data, null, function success(res) {
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
                success: function (res) {
                  let data = {
                    order_id: order_id,
                    userid_locked: wx.getStorageSync('userid_locked')
                  }
                  api.form_('pay/check_pay', data, null, function success(res) {
                    wx.hideLoading()
                    if (res.data.result_code == "300") {
                      wx.showToast({
                        title: '充值成功',
                        icon: 'success',
                        duration: 2000
                      })
                    wx.navigateBack({
                      delta: 1,//返回上一个页面
                      })
                    }
                  }, function fail(e) {
                    console.log(e)
                  })
                },  
                fail: function (res) {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none'
                  })
                }
              })
            }
          }else{
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
  // 查看充电券说明
  instructions() {
    wx.navigateTo({
      url: '../couponMethod/couponMethod',
    })
  }
})