Page({

  data: {
    money:'',
    course:''
  },
  onShow(){
    let that =this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: 'https://api.cd1a.cn/index.php/index13/Buycar/reserve_detail',
      data: {
        userid_locked: wx.getStorageSync("userid_locked")
      },
      success(res) {
        wx.hideLoading()
        that.setData({
         money:res.data.data.final_payment,
         course:res.data.data.course
       })
      }
    })
  },
  money: function (o) {
    this.setData({
      money:o.detail.value
    })
  },
  // 确定
  sure: function () {
    let that = this;
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    if (that.data.money == ''||that.data.money == 0) {
      wx.showToast({
        title: '请输入正确价格',
        icon: 'loading'
      })
    } else{
      wx.login({
        success: function (res) {
          wx.request({
            url: 'https://api.cd1a.cn/index.php/index12/pay/pay_fee',
            data: {
              code: res['code'],
              fee: that.data.money,
              member: 3
            },
            success(res) {
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
                    console.log(res)
                    wx.request({
                      url: 'https://api.cd1a.cn/index.php/index12/pay/check_pay',
                      data:{
                        order_number: order_id,
                        userid_locked: wx.getStorageSync('userid_locked')
                      },
                      method: 'post',
                      success(res) {
                        wx.hideLoading();
                        wx.showToast({
                          title: res.data.msg,
                          duration:2000
                        })
                        wx.showLoading({
                          title: '加载中...',
                          mask: true
                        })
                        wx.request({
                          url: 'https://api.cd1a.cn/index.php/index13/Buycar/reserve_detail',
                          data: {
                            userid_locked: wx.getStorageSync("userid_locked")
                          },
                          success(res) {
                            wx.hideLoading()
                            that.setData({
                             money:res.data.data.final_payment,
                             course:res.data.data.course
                           })
                           console.log(res.data.data.final_payment)
                          }
                        })
                      },fail(res){
                        wx.hideLoading();
                      }
                    })
                  },fail(res){
                    wx.hideLoading();
                  }
                })
              }
            },fail(res){
              wx.hideLoading();
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
      that.sure();
    }
  },

  getUserInfo: function () {
    console.log(22)
    let that = this;
    wx.login({
      success: function (res) {
        console.log(res['code'])
        wx.getUserInfo({
          success: function (e) {
            //插入登录的用户的相关信息到数据库
            let data = {
              encryptedData: e['encryptedData'],
              iv: e['iv'],
              rawData: JSON.parse(e['rawData']),
              code: res['code']
            }
            if (that.data.recommend) {
              data.recommend = that.data.recommend;
            }
            wx.request({
              url: 'https://api.cd1a.cn/index.php/index11/Login/index',
              data: data,
              method: 'post',
              success(res) {
                wx.setStorageSync('userid_locked', res.data.userid_locked);
                wx.setStorageSync('phoneNumber', res.data.phone);
                //授权成功后，跳转进入小程序首页
                if (res.data.userid_locked) {
                  that.sure();
                }
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
  }
})