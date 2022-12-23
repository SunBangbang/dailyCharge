Page({

  data: {
    name: "",
    mobie: "",
    brand: "",
    model: "",
    customItem: [],
    detailed: '请选择',
    region:''
  },
  onShow: function () {
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
        if (res.data.result_code == 300) {
          if (res.data.data.course == 2) {
            wx.redirectTo({
              url: '../H5/H5'
            })
          } else if (res.data.data.course == 3) {
            wx.redirectTo({
              url: '../H6/H6'
            })
          }
        } else {
          wx.redirectTo({
            url: '../authorize/authorize?activity=' + '1'
          })
        }
      }
    })
  },
  // 姓名
  name: function (o) {
    this.setData({
      name: o.detail.value
    })
  },
  // 电话
  mobie: function (o) {
    this.setData({
      mobie: o.detail.value
    })
  },
  // 品牌
  brand: function (o) {
    this.setData({
      brand: o.detail.value
    })
  },
  // 型号
  model: function (o) {
    this.setData({
      model: o.detail.value
    })
  },
  // 确定
  sure: function () {
    let that = this;
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    wx.request({
      url: 'https://api.cd1a.cn/index.php/index13/Buycar/reserve',
      data: {
        userid_locked: wx.getStorageSync("userid_locked"),
        name: that.data.name,
        phone: that.data.mobie,
        brand: that.data.brand,
        car_model: that.data.model,
        area:that.data.region
      },
      success(res) {
        wx.hideLoading()
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  bindGetUserInfo: function (e) {
    let that = this;
    if (that.data.name == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    } else if (!/^1[3456789]\d{9}$/.test(that.data.mobie)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return;
    } else if (that.data.brand == "") {
      wx.showToast({
        title: '品牌不能为空',
        icon: 'none'
      })
      return;
    } else if (that.data.model == "") {
      wx.showToast({
        title: '型号不能为空',
        icon: 'none'
      })
      return;
    } else if (that.data.region == "") {
      wx.showToast({
        title: '地区不能为空',
        icon: 'none'
      })
      return;
    }
    if (!wx.getStorageSync("userid_locked")) {
      // wx.showModal({
      //   title: '尚未授权',
      //   content: '是否确定授权？',
      //   success(res) {
      //     if (res.confirm) {
      //       wx.showLoading({
      //         title: '请稍等...',
      //         mask: true
      //       })
      //       wx.getSetting({
      //         success(res) {
      //           if (!res.authSetting['scope.userInfo']) {
      //             wx.authorize({
      //               scope: 'scope.userInfo',
      //               success: function () {
      //                 that.getUserInfo(); //第一次授权
      //               },
      //               fail: function () {
      //                 wx.showToast({
      //                   icon: "none",
      //                   title: '获取授权失败，请重试',
      //                   mask: true
      //                 })
      //               }
      //             })
      //           } else {
      //             wx.getUserInfo({
      //               success: function (res) {
      //                 that.getUserInfo(); //不是首次授权
      //               }
      //             })
      //           }
      //         }
      //       })
      //     }
      //   }
      // })

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
              url: 'https://api.cd1a.cn/index.php/index13/Login/index',
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
  },
   //省市联动
   bindRegionChange: function (e) {
    var that = this
    //为了让选择框有个默认值，    
    that.setData({
      clas: ''
    })
    this.setData({
      //拼的字符串传后台
      detailed: e.detail.value[0] + " " + e.detail.value[1] + " " + e.detail.value[2],
      clas: 'black',
      //下拉框选中的值
      region:e.detail.value[0] + "," + e.detail.value[1] + "," + e.detail.value[2],
    })
  },
})