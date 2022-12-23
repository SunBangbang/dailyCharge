var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress_date: '00:00:00',
    progress_startTime: 1, // 不要设置为0 在特定的情况会if跳出 开始时间
    progress_endTime: 1, // 结束时间
    canvasWidth: 0,
    log_id: '',
    olog_id: '',
    refreshTime: 140000, //120 000ms 2min
    repairOutMin: 30, //报修有效分钟数
    mask: true,
    get_coupon: '',
    coupon: '',
    takeTime: 5,
    plug_remind: '',
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    full_stop: '',
    progress_times: '',
    localTime: '',
    residue_timestamp: '',
    data: '',
    carousel_first: [],
    carousel_two: [],
    img: '',
    type: '',
    url: '',
    url_platform: '',
    car_shop_appid: '',
    singleAngle: 45, // 每片扇形的角度
    activity_data: '',
    three_hour: '1',
    one_hour: '5',
    year_card: '3',
    msg: '',
    is_corona: '',
    gift_id: '',
    is_start: true,
    animationData: {},
    activity: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      olog_id: options.log_id,
      coupon: options.get_coupon
    })
    this.animation = wx.createAnimation({
      delay: 0,
      duration: 3000,
      timingFunction: 'ease'
    })
    this.loadData();
    // this.refresh();
  },

  rotateAni: function () {
    let that = this
    let tmpnum = 0.9
    let angle = 2 * 360
    if (that.data.gift_id % 2 == 0) {
      let endAddAngle = tmpnum * that.data.singleAngle + angle // 中奖角度
      that.animation.rotate(endAddAngle).step()
      that.setData({
        animationData: that.animation.export()
      })
      if (!that.data.is_start) {
        setTimeout(() => {
          wx.showModal({
            title: '中奖结果',
            content: that.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  is_corona: 1,
                  activity: false
                })
              }
            }
          })
        }, 4000)
      }
    } else if (that.data.gift_id == that.data.three_hour) {
      let endAddAngle = tmpnum * that.data.singleAngle - parseInt(tmpnum * that.data.singleAngle) + angle // 中奖角度
      that.animation.rotate(endAddAngle).step()
      that.setData({
        animationData: that.animation.export()
      })
      if (!that.data.is_start) {
        setTimeout(() => {
          wx.showModal({
            title: '中奖结果',
            content: that.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  is_corona: 1,
                  activity: false
                })
              }
            }
          })
        }, 4000)
      }
    } else if (that.data.gift_id == that.data.year_card) {
      let endAddAngle = tmpnum * that.data.singleAngle - parseInt(tmpnum * that.data.singleAngle) + 90 + angle // 中奖角度
      that.animation.rotate(endAddAngle).step()
      that.setData({
        animationData: that.animation.export()
      })
      if (!that.data.is_start) {
        setTimeout(() => {
          wx.showModal({
            title: '中奖结果',
            content: that.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  is_corona: 1,
                  activity: false
                })
              }
            }
          })
        }, 4000)
      }
    } else if (that.data.gift_id == that.data.one_hour) {
      let endAddAngle = tmpnum * that.data.singleAngle - parseInt(tmpnum * that.data.singleAngle) + 180 + angle // 中奖角度
      that.animation.rotate(endAddAngle).step()
      that.setData({
        animationData: that.animation.export()
      })
      if (!that.data.is_start) {
        setTimeout(() => {
          wx.showModal({
            title: '中奖结果',
            content: that.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  is_corona: 1,
                  activity: false
                })
              }
            }
          })
        }, 4000)
      }
    } else {
      let endAddAngle = tmpnum * that.data.singleAngle - parseInt(tmpnum * that.data.singleAngle) + 315 + angle // 中奖角度
      that.animation.rotate(endAddAngle).step()
      that.setData({
        animationData: that.animation.export()
      })
      if (!that.data.is_start) {
        setTimeout(() => {
          wx.showModal({
            title: '中奖结果',
            content: that.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  is_corona: 1,
                  activity: false
                })
              }
            }
          })
        }, 4000)
      }
    }
  },

  start() {
    let that = this
    let data = {
      userid_locked: wx.getStorageSync("userid_locked"),
      log_id: that.data.log_id,
      gift_id: that.data.gift_id
    }
    if (that.data.is_start) {
      that.setData({
        is_start: false
      })
      if (that.data.activity_data.type == '1') {
        that.rotateAni()
      } else {
        api.form_('Activity/corona_backfeed', data, null, function success(res) {
          console.log(res.data)
          if (res.data.result_code == 300) {
            that.rotateAni()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        })
      }
    }
  },

  first: function (e) {
    let index = e.currentTarget.dataset.index
    let that = this
    if (this.data.carousel_first[index].type == 1) {
      wx.navigateToMiniProgram({
        appId: this.data.carousel_first[index].car_shop_appid,
        path: this.data.carousel_first[index].url_platform,
        success: function(res) {
          let data = {
            userid_locked: wx.getStorageSync('userid_locked'),
            url: that.data.carousel_first[index].url_platform
          }
          api.form_('Statist/out_applet', data, null, function success(res) {
            console.log(res)
          })
        },
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release'
      })
    } else if (this.data.carousel_first[index].type == 2) {
      wx.navigateTo({
        url: '../battery/battery?url=' + this.data.carousel_first[index].url
      })
    } else if (this.data.carousel_first[index].type == 3) {
      wx.navigateTo({
        url: '../integralSharing/integralSharing'
      })
    } else if (this.data.carousel_first[index].type == 4) {
      wx.navigateTo({
        url: '/pages/buyCar/invitation/invitation'
      })
    }
  },

  get: function () {
    this.setData({
      mask: false
    })
  },

  two: function (e) {
    let index = e.currentTarget.dataset.index
    let that = this
    if (this.data.carousel_two[index].type == 1) {
      wx.navigateToMiniProgram({
        appId: that.data.carousel_two[index].car_shop_appid,
        path: that.data.carousel_two[index].url_platform,
        success: function(res) {
          let data = {
            userid_locked: wx.getStorageSync('userid_locked'),
            url: that.data.carousel_two[index].url_platform
          }
          api.form_('Statist/out_applet', data, null, function success(res) {
            console.log(res)
          })
        },
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release'
      })
    } else if (this.data.carousel_two[index].type == 2) {
      wx.navigateTo({
        url: '../battery/battery?url=' + this.data.carousel_two[index].url
      })
    } else if (this.data.carousel_two[index].type == 3) {
      wx.navigateTo({
        url: '../integralSharing/integralSharing'
      })
    } else if (this.data.carousel_two[index].type == 4) {
      wx.navigateTo({
        url: '/pages/buyCar/invitation/invitation'
      })
    }
  },

  // js本地时间获取
  localTime: function () {
    let date = new Date()
    let local_start = Math.round(date.getTime() / 1000)
    return local_start
  },

  loadData: function (options) {
    let that = this;
    var data = {
      userid_locked: wx.getStorageSync("userid_locked"),
      user_log_id: that.data.olog_id,
      coupon: that.data.coupon
    }

    api.form_('Scan/countdown', data, null, function success(res) {
      that.setData({
        localTime: that.localTime()
      })
      console.log(res.data.data)
      res.data.data.pop_up.forEach(item => {
        that.setData({
          img: item.img,
          type: item.type,
          url: item.url,
          url_platform: item.url_platform,
          car_shop_appid: item.car_shop_appid
        })
      })
      res.data.data.carousel_first.sort((a, b) => {
        return a.type - b.type
      })
      res.data.data.carousel_two.sort((a, b) => {
        return a.type - b.type
      })
      var timee = res.data.data.all_timestamp // 总时间
      var times = (res.data.data.all_timestamp - res.data.data.residue_timestamp) // 总时间 - 剩余时间 = 开始时间 
      that.setData({
        data: res.data,
        gift_id: res.data.data.corona.length > 0 ? res.data.data.corona[0].gift_id : '', // 中奖下标
        msg: res.data.data.corona.length > 0 ? res.data.data.corona[0].gift_name : '', // 中奖信息
        activity_data: res.data.data.corona.length > 0 ? res.data.data.corona[0] : '',
        is_corona: res.data.data.is_corona,
        residue_timestamp: res.data.data.residue_timestamp,
        progress_startTime: times,
        progress_endTime: timee,
        log_id: res.data.data.log_id,
        get_coupon: res.data.data.get_coupon,
        plug_remind: res.data.data.plug_remind,
        full_stop: res.data.data.full_stop,
        carousel_first: res.data.data.carousel_first,
        carousel_two: res.data.data.carousel_two
      })
      that.takeTimeOut()
      that.countInterval()
    }, function fail(e) {
      console.log(e)
    })
  },

  shop_mall: function () {
    if (this.data.type == 1) {
      wx.navigateToMiniProgram({
        appId: this.data.car_shop_appid,
        path: this.data.url_platform,
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release'
      })
    } else if (this.data.type == 2) {
      wx.navigateTo({
        url: '../battery/battery?url=' + this.data.url
      })
    } else if (this.data.type == 3) {
      wx.navigateTo({
        url: '../integralSharing/integralSharing'
      })
    } else if (this.data.type == 4) {
      wx.navigateTo({
        url: '/pages/buyCar/invitation/invitation'
      })
    }
  },

  countInterval: function () {
    if (this.data.full_stop == 2) {
      this.countTimer = setInterval(() => {
        let times = this.localTime() // 调用本地时间
        let startTimes = this.data.localTime // 第一次记录本地时间
        let nowDate = this.data.progress_startTime + (times - startTimes) // 后台开始时间 + 本地时间 = 实际走过的时间
        let realTime = this.timeFormat(nowDate)
        this.drawCircle(nowDate / this.data.progress_endTime * 2)
        this.setData({
          progress_date: realTime
        })
        if (nowDate / 1 >= this.data.residue_timestamp / 1) {
          clearInterval(this.countTimer);
          clearInterval(this.refreshTimer);
          wx.reLaunch({
            url: '../index/index'
          })
        }
      }, 1000)
    } else {
      // 设置倒计时 定时器 每500毫秒执行一次 ,耗时2秒绘一圈
      this.countTimer = setInterval(() => {
        let times = this.localTime() // 调用本地时间
        let startTimes = this.data.localTime // 第一次记录本地时间
        let nowDate = this.data.residue_timestamp - (times - startTimes) // 后台剩余时间 - 本地走过的时间 = 实际剩余的时间
        let realTime = this.timeFormat(nowDate)
        this.drawCircle((this.data.progress_endTime - nowDate) / this.data.progress_endTime * 2)
        this.setData({
          progress_date: realTime
        })
        if (nowDate <= 0) {
          clearInterval(this.countTimer);
          clearInterval(this.refreshTimer);
          wx.reLaunch({
            url: '../index/index'
          })
        }
      }, 1000)
    }
  },

  timeFormat: function (time) {
    //shijianchuo是整数，否则要parseInt转换
    var s = Math.floor(time % 60);
    var h = Math.floor(time / 3600);
    var m = Math.floor(Math.floor(time / 60) - Math.floor(h * 60));
    return this.add0(h) + ':' + this.add0(m) + ':' + this.add0(s);
  },

  //倒计时 （5s倒计时）
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

  // 关闭
  close: function () {
    if (this.data.takeTime == 0) {
      this.setData({
        mask: false
      })
    }
  },

  show_close: function () {
    this.setData({
      is_corona: 1,
      activity: false
    })
  },

  off: function () {
    this.setData({
      mask: false,
      activity: true
    })
  },

  onReady: function () {
    let that = this;
    wx.createSelectorQuery().select('.progress_box').boundingClientRect(function (rect) {
      if (!rect) return;
      var width = rect.width / 2 // 节点的宽度
      that.setData({
        canvasWidth: width
      })
      that.drawProgressbg();
    }).exec()
  },

  drawProgressbg: function () {
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth((this.data.canvasWidth / 120) * 4); // 设置圆环的宽度
    ctx.setStrokeStyle('#F5F5F5'); // 设置圆环的颜色 灰色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(
      this.data.canvasWidth,
      this.data.canvasWidth,
      this.data.canvasWidth - ((this.data.canvasWidth / 120) * 14),
      0,
      Math.PI * 2,
      false
    );
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },

  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    context.setLineWidth((this.data.canvasWidth / 120) * 4);
    context.setStrokeStyle("#0DA297");
    context.setLineCap('round')
    context.beginPath();
    //添加阴影
    context.shadowBlur = (this.data.canvasWidth / 120) * 12;
    context.shadowColor = "#0DA297";
    context.arc(
      this.data.canvasWidth,
      this.data.canvasWidth,
      this.data.canvasWidth - ((this.data.canvasWidth / 120) * 14), -Math.PI / 2,
      step * Math.PI - Math.PI / 2,
      false
    );
    context.stroke();
    context.draw()
  },

  // refresh: function () {
  //   this.refreshTimer = setInterval(() => {
  //     clearInterval(this.countTimer);
  //     this.loadData();
  //   }, this.data.refreshTime)
  // },

  add0: function (m) {
    return m < 10 ? '0' + m : m
  },

  align: function () {
    wx.reLaunch({
      url: '../index/index'
    });
  },


  onConfirm: function () {
    let that = this
    that.setData({
      showModal: false
    })
    api.form_('Scan/stop_charge', {
        userid_locked: wx.getStorageSync("userid_locked"),
        charge_id: that.data.olog_id
      },
      null,
      function success(res) {
        console.log(res)
        if (!res.data) {
          wx.showToast({
            title: '请勿重复操作！',
            icon: 'none'
          })
        } else {
          if (res.data.return_code == '200') {
            wx.showToast({
              title: res.data.msg,
              icon: 'loading',
              success: function () {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            })
          }
        }
      }
    )
  },

  stop: function () {
    let that = this
    if (that.data.full_stop == 2) {
      wx.showModal({
        title: '温馨提示',
        content: '充电9小时内不满1小时\n按1小时收费\n满9小时后前半小时免费\n超过半小时正常收费\n充电不满1小时按1小时收费\n确定停充?',
        success: function (res) {
          if (res.confirm) {
            that.onConfirm()
          }
        }
      })
    } else {
      wx.showModal({
        title: '充电不满1小时按1小时收费,确定停充?',
        success: function (res) {
          if (res.confirm) {
            that.onConfirm()
          }
        }
      })
    }
  },

  repair: function () {
    let that = this;
    if (that.data.progress_startTime / 1000 / 60 > that.data.repairOutMin) {
      wx.showToast({
        title: '时间超过' + that.data.repairOutMin + '分钟不能报修',
        icon: 'none',
        duration: 4000,
        mask: true
      })
      return;
    }
    wx.navigateTo({
      url: '../repair/repair?log_id=' + this.data.log_id
    })
  },

  onUnload: function () {
    clearInterval(this.countTimer);
    // clearInterval(this.refreshTimer);
  }
})