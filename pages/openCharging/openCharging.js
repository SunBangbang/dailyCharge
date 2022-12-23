var api = require('../../utils/api.js')
Page({
  data: {
    data: [], //所有数据
    ticket_list: [], //优惠券
    index: '', //优惠下标
    index1: 0, //卡下标
    time: 0, //时间
    ticket_id: '', //ucid
    cal_id: '0', //卡类型
    card_id: '0', //卡id
    rest_time: '', //卡时间
    charge: false, //收费
    takeTime: 5,
    icon1: true,
    icon2: false,
    flip: 2,
    log_id: '',
    isSubmit: false,
    count: "", //功率弹窗次数
    ordinary: false,
    charging: {},
    enough: '',
    flag: '',
    masg: '',
    mask: true,
    operat: '',
    startData: {
      upgrade: '1',
      user_log_id: ''
    },
    popup: true, //弹窗
    listPopup: '',
    popupIndex: -1,
    reson: false,
    case: false,
    general_charge: '',
    month_charge: '',
    full_stop: '',
    disable: false,
    cant: false,
    stop: false,
    agreement: '',
    showModal: false,
    control: true,
    tickList: [],
    arr: [],
    arr_detail: [],
    code: '',
    full_time: ''
  },
  onShow: function () {
    let that = this
    const pages = getCurrentPages()
    const current = pages[pages.length - 1]
    console.log(current.data.sign)
    if(that.data.reson) {
      that.setData({
        month_charge: 1
      })
    }
    if(that.data.case) {
      that.setData({
        general_charge: 1
      })
    }
    if (current.data.sign) {
      this.setData({
        time: 0
      })
      let tickList = []
      let params = {
        userid_locked: wx.getStorageSync('userid_locked'), //用户唯一识别
        str: that.data.code //端口号
      }
      api.form_('Scan/scan', params, null, function success(res) {
        console.log(res.data.data)
        let data = res.data.data
        if (data.ticket_list.length != 0) {
          for (var i = 0; i < data.ticket_list.length; i++) {
            var listObj = {
              detail: data.ticket_list[i].detail,
              full_time: data.ticket_list[i].full_time,
              ucid: data.ticket_list[i].ucid
            }
            tickList.push(listObj) // 满足条件的所有优惠券
            tickList.sort((a, b) => {
              return a.full_time - b.full_time
            })
          }
        }
        that.setData({
          data: data,
          code: data.code,
          ticket_list: tickList, // 所有优惠券
          discount_coupon_time: parseInt(data.discount_coupon_time),
          ticket_id: data.ticket_list.length != 0 ? tickList[1].ucid : '0', // 默认full_time == 0 的优惠券
          rest_time: data.card_list.length != 0 ? data.card_list[that.data.index1].rest_time : 24,
          cal_id: data.card_list.length != 0 ? data.card_list[that.data.index1].cal_id : '0',
          card_id: data.card_list.length != 0 ? data.card_list[that.data.index1].card_id : '0',
          operat: data.card_list.length != 0 ? data.card_list[that.data.index1].operat : '',
          full_stop: data.full_stop
        })
      })
    }
  },
  onLoad: function (options) {
    let tickList = []
    try {
      var data = JSON.parse(options.data);
      console.log(options.reson)
      console.log(options.case)
      console.log(data)
    } catch (e) {
      console.log('失败')
    }
    // data.rebroadcast.forEach(item => {
    //   this.setData({
    //     url: item.url
    //   })
    // })
    if (data.ticket_list.length != 0) {
      for (var i = 0; i < data.ticket_list.length; i++) {
        var listObj = {
          detail: data.ticket_list[i].detail,
          full_time: data.ticket_list[i].full_time,
          ucid: data.ticket_list[i].ucid
        }
        tickList.push(listObj) // 满足条件的所有优惠券
        tickList.sort((a, b) => {
          return a.full_time - b.full_time
        })
      }
    }
    var that = this;
    that.setData({
      data: data,
      code: data.code,
      ticket_list: tickList, // 所有优惠券
      discount_coupon_time: parseInt(data.discount_coupon_time),
      ticket_id: data.ticket_list.length != 0 ? tickList[1].ucid : '0', // 默认full_time == 0 的优惠券
      rest_time: data.card_list.length != 0 ? data.card_list[that.data.index1].rest_time : 24,
      cal_id: data.card_list.length != 0 ? data.card_list[that.data.index1].cal_id : '0',
      card_id: data.card_list.length != 0 ? data.card_list[that.data.index1].card_id : '0',
      operat: data.card_list.length != 0 ? data.card_list[that.data.index1].operat : '',
      general_charge: data.general_charge,
      month_charge: data.month_charge,
      full_stop: data.full_stop
    })
    this.listPopup();
    if (options.reson) {
      this.setData({
        reson: true,
        month_charge: 1
      })
    } else if (options.case) {
      this.setData({
        case: true,
        general_charge: 1
      })
    } else if (data.month_card_scheme != 2) {
      if (data.month_charge == 2) {
        wx.showModal({
          title: '请选择充电类型',
          cancelText: '余额',
          confirmColor: '#000',
          confirmText: '月卡',
          success: function (res) {
            // 点击月卡的情况
            if (res.confirm) {
              that.setData({
                case: true,
                general_charge: 1
              })
            } else {
              // 临时卡
              that.setData({
                reson: true,
                month_charge: 1
              })
            }
          }
        })
      } else {
        this.setData({
          reson: true,
          month_charge: 1
        })
      }
    }
  },

  // 选择时长
  selectionTime: function (e) {
    let that = this.data
    let arr = [] // 所有数组的内容
    let arr_detail = [] // 所有数组的detail
    this.setData({
      time: e.currentTarget.dataset.time,
      control: true
    })
    // 如果有满足条件的优惠券
    if (that.ticket_list.length > 0) {
      for (var i = 0; i < that.ticket_list.length; i++) {
        if (that.ticket_list[i].full_time) {
          if (that.time >= that.ticket_list[i].full_time / 1) {
            arr.push(that.ticket_list[i])
            arr_detail.push(that.ticket_list[i].detail)
          }
        } else {
          arr.push(that.ticket_list[i])
          arr_detail.push(that.ticket_list[i].detail)
        }
      }
      this.setData({
        arr: arr,
        arr_detail: arr_detail
      })
      // 判断优惠券状态是否改变
      if (arr.length == 1) {
        this.setData({
          index: 0,
          ticket_id: arr[0].ucid
        })
      } else {
        if (that.ticket_id == arr[0].ucid) {
          this.setData({
            index: 1,
            ticket_id: arr[1].ucid // 每次选完优惠券 重新选择时间 默认为第一张 让其重新选择
          })
        } else if (that.ticket_id == arr[1].ucid) {
          this.setData({
            index: 1,
            ticket_id: arr[1].ucid // 每次选完优惠券 重新选择时间 默认为第一张 让其重新选择
          })
        } else {
          if (arr[that.index]) {
            this.setData({
              index: that.index,
              ticket_id: arr[that.index].ucid // 每次选完优惠券 重新选择时间 默认为第一张 让其重新选择
            })
          } else {
            this.setData({
              index: 1,
              ticket_id: arr[1].ucid // 每次选完优惠券 重新选择时间 默认为第一张 让其重新选择
            })
          }
        }
      }
    }
  },


  // 优惠券
  bindPickerChange: function (e) {
    let that = this.data;
    if (that.time == 0) {
      wx.showToast({
        title: '请选择时间',
        icon: 'loading'
      })
      return
    }
    this.setData({
      index: e.detail.value,
      control: false
    })
    var index = e.detail.value;
    this.setData({
      ticket_id: that.arr[index].ucid
    })
  },


  //开启弹框优惠券
  bindPickerChange1: function (e) {
    let that = this.data
    this.setData({
      ordinary: false,
      index: e.detail.value,
      control: false
    })
    var index = e.detail.value
    this.setData({
      ticket_id: that.arr[index].ucid
    })
  },


  //卡选择
  bindPickerChangeC: function (e) {
    console.log(this.data.data.card_list.length)
    let that = this;
    that.setData({
      index1: e.detail.value,
      rest_time: that.data.data.card_list[e.detail.value].rest_time,
      cal_id: that.data.data.card_list[e.detail.value].cal_id,
      card_id: that.data.data.card_list[e.detail.value].card_id,
      operat: that.data.data.card_list[e.detail.value].operat,
      ticket_id: "0"
    })
    if (that.data.operat != 2) {
      this.setData({
        time: 0
      })
    }
  },


  // 弹窗
  listPopup: function () {
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked'),
      scan: that.data.data.scan,
    }
    api.form_('Scan/coupon', data, null, function success(res) {
      console.log(res.data)
      if (!res.data.data) return;
      that.setData({
        listPopup: res.data.data,
        popupIndex: res.data.data.show.length - 1
      })
      that.judegPopup();
    })
  },
  closePopup: function () {
    let idx = this.data.popupIndex;
    this.setData({
      popupIndex: idx - 1
    })
    this.judegPopup();
  },
  judegPopup: function () {
    if (this.data.popupIndex == -1) {
      this.setData({
        popup: false
      })
      return;
    }

    // let show = this.data.listPopup.show[this.data.popupIndex];
    // // let idx = this.data.popupIndex;
    // if (!show) {
    //   this.closePopup();
    // }
  },
  //弹窗购入
  popPurchase: function (o) {
    let car = wx.getStorageSync('car')
    let url_type = o.currentTarget.dataset.url_type;
    let url = o.currentTarget.dataset.url
    switch (url_type) {
      case "1": //外部链接
        wx.redirectTo({
          url: '../offical/offical'
        })
        break;
      case "2": //会员
        this.addVip_();
        break;
      case "3": //月卡
        this.mon_card();
        break;
      case "4": //购车
        if (car && car != 1) {
          wx.navigateTo({
            url: '../buyCar/rate/rate',
          })
        } else {
          wx.navigateTo({
            url: '../specialPackage/specialPackage'
          })
        }
        break;
      case "5": //单倍积分
        wx.navigateTo({
          url: '../invitationDetails/invitationDetails'
        })
        break;
      case "6": //双倍积分
        wx.navigateTo({
          url: '../invitationDetails/invitationDetails'
        })
        break;
      case "7": //签到
        wx.navigateTo({
          url: '../signin/signin?open_sign=' + '2'
        })
        break;
      case "8":
        wx.navigateTo({
          url: '../battery/battery?url=' + url,
        })
      case "9":
        this.closePopup()
        break;
    }
  },
  // 放弃优惠
  balance: function (e) {
    this.setData({
      ordinary: false
    })
    this.open_pay();
  },

  // 优惠券
  discount: function () {
    if (this.data.time == 0) {
      wx.showToast({
        title: '请选择时间',
        icon: 'loading'
      })
    }
  },


  // 开启充电
  openCharging: function (e) {
    let that = this.data;
    if (that.time == 0) {
      wx.showToast({
        title: '请选择时间',
        icon: 'loading'
      })
    } else if (that.ticket_list.length > 0) {
      if (this.data.ticket_id != 0) {
        this.open_pay()
      } else {
        this.open_pay()
        // this.setData({
        //   ordinary: true
        // })
      }
    } else {
      this.open_pay()
    }
  },

  openCharge: function (e) {
    let this_ = this;
    let that = this.data;

    if (that.time == 0) {
      wx.showToast({
        title: '请选择时间',
        icon: 'loading'
      })
    } else {
      // 月卡
      if (that.data.month_card_scheme == 2) {
        if (that.data.card_list_num == 0 && (that.data.mf != 5 && that.data.mf != 7)) {
          wx.showModal({
            title: '温馨提示',
            content: '暂未购买月卡，是否前往月卡页面购买。',
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false
                })
              } else {
                this_.mon_card()
              }
            }
          })
        } else if (that.operat == 2 && parseInt(that.time) > parseInt(that.rest_time)) {
          wx.showModal({
            title: '温馨提示',
            content: '月卡时长不足，是否前往月卡页面购买。',
            success: function (res) {
              this_.data.startData.upgrade = 2;
              if (res.cancel) {
                this_.setData({
                  isSubmit: false
                })
              } else {
                this_.mon_card()
              }
            }
          })
        } else {
          this_.open_pay()
        }
      } else if (that.data.month_card_scheme == 1 && parseInt(that.time) > parseInt(that.rest_time) && that.operat == 2) {
        wx.showModal({
          title: '温馨提示',
          content: '月卡时间剩余' + that.rest_time + '小时',
          cancelText: '续费月卡',
          cancelColor: '#efefef',
          confirmText: '余额开启',
          confirmColor: '#0da297',
          cancelColor: 'cancelColor',
          success: function (res) {
            if (res.cancel) {
              this_.data.startData.upgrade = 2;
              this_.mon_card()
            } else {
              this_.open_pay()
            }
          }
        })
      } else {
        // 不使用月卡 有优惠券存在的情况下
        if ((this.data.data.card_list.length - 1 == this.data.index1) && (this.data.data.month_card_scheme != 2 && this.data.card_id == 0 && this.data.data.ticket_list.length >= 1 && (this.data.data.mf != 5 && this.data.data.mf != 7))) {
          // 当你的优惠券选择的情况下
          if (this.data.ticket_id != 0) {
            this_.open_pay()
          } else {
            this.setData({
              ordinary: true
            })
          }

        } else {
          // 使用月卡的情况下
          this_.open_pay()
        }
      }

    }
  },



  openMonth: function () {
    if (this.data.time == 0) {
      wx.showToast({
        title: '请选择时间',
        icon: 'loading'
      })
    } else if (this.data.card_id == '' || this.data.card_id == 0) {
      wx.showToast({
        title: '请选择月卡',
        icon: 'loading'
      })
    } else if (Number(this.data.rest_time) < Number(this.data.time)) {
      let that = this
      if (this.data.operat == 2 && (this.data.data.month_card_scheme == 1 || this.data.data.month_card_scheme == 2)) {
        wx.showModal({
          title: '月卡时长不足，请续卡或重新选择时间',
          cancelText: '重新选择',
          confirmColor: '#000',
          confirmText: '续卡',
          success: function (res) {
            if (res.confirm) {
              that.data.startData.upgrade = 2
              that.mon_card()
            }
          }
        })
      } else {
        this.setData({
          time: 0
        })
        if (this.data.time != 0) {
          wx.showToast({
            title: '请选择时间',
            icon: 'loading'
          })
        } else {
          wx.showToast({
            title: '超出时长，请重新选择',
            icon: 'none'
          })
        }
      }
    } else {
      this.month_pay()
    }
  },

  // 月卡支付
  month_pay: function () {
    let this_ = this;
    let that = this.data;
    wx.showLoading({
      title: '开启中',
      success: function (res) {
        this_.setData({
          cant: true,
          month_charge: 1
        })
      }
    })

    let data = {
      "userid_locked": wx.getStorageSync('userid_locked'),
      "scan": that.data.scan,
      "time": that.time,
      'ticket_id': '0', // 临时
      'card_id': that.data.mf <= 0 ? that.card_id : '0', // 月卡
      'free': that.data.mf,
      "code": that.data.code
    }
    this_.setData({
      charging: data
    })
    api.form_('Scan/start', data, null, function success(res) {
      console.log(res.data)
      this_.setData({
        startData: res.data.data
      })
      let data = res.data.data;
      switch (res.data.result_code) {
        case "304": //  端口正在使用
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          });
          break;
        case "324": //余额为负
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false,
                  cant: false,
                  month_charge: 2
                })
              } else {
                this_.setData({
                  cant: false,
                  month_charge: 2
                })
                wx.showLoading({
                  title: '提交中'
                })
                wx.login({
                  success: function (res) {
                    let data = {
                      code: res['code'],
                      fee: this_.data.startData.debt,
                      member: 1
                    }
                    api.form_('pay/pay_fee', data, null, function success(res) {
                      if (res.data.result_code == 314) {
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
                                if (res.data.result_code == '300') {
                                  wx.showToast({
                                    title: '补缴成功',
                                    icon: 'success',
                                    duration: 2000
                                  })
                                  this_.setData({
                                    money: '',
                                    isSubmit: false
                                  })
                                }
                              }, function fail(e) {
                                console.log(e)
                                this_.setData({
                                  isSubmit: false
                                })
                              })
                            },
                            fail: function (res) {
                              wx.hideLoading()
                              this_.setData({
                                isSubmit: false
                              })
                            }
                          })
                        }
                      } else {
                        console.log('失败')
                      }

                    })
                  }
                })
              }
            }
          })
          break;
        case "333": //强制月卡升级
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false,
                  cant: false,
                  month_charge: 2
                })
              } else {
                //点击确定
                this_.setData({
                  cant: false,
                  month_charge: 2
                })
                this_.mon_card()
              }
            }
          })
          break;
        case "333": //功率超额开启
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            confirmText: '升级月卡',
            confirmColor: '#0da297',
            cancelColor: 'cancelColor',
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false,
                  cant: false,
                  month_charge: 2
                })
              } else {
                this_.mon_card();
              }
            }
          })
          break;
        case "336": //功率超额
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: 'false',
            confirmText: '升级月卡',
            confirmColor: '#0da297',
            success: function (res) {
              if (res.confirm) {
                this_.mon_card()
              } else {
                this_.setData({
                  cant: false,
                  month_charge: 2
                })
              }
            }
          })
          break;
        case "338": //成功
          this_.setData({
            count: data.count
          })
          wx.hideLoading()
          if (data.flip == 1) {
            wx.reLaunch({
              url: '../countDown/countDown?log_id=' + data.user_log_id + '&time=' + this_.data.time + '&get_coupon=' + 2
            })
          } else {
            this_.setData({
              charge: true
            })
            this_.takeTimeOut();
          }
          break;
        default: //其他
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg
          })
      }
    })
  },

  hideModal: function () {
    this.setData({
      showModal: false
    })
  },

  // 充满即停弹框确认
  onConfirm: function () {
    let this_ = this;
    let that = this.data;
    this_.setData({
      showModal: false
    })
    wx.showLoading({
      title: '开启中',
      success: function (res) {
        this_.setData({
          stop: true,
          full_stop: 1
        })
      }
    })
    let data = {
      "userid_locked": wx.getStorageSync('userid_locked'),
      "scan": that.data.scan,
      "time": 12,
      'ticket_id': '0',
      'card_id': '0',
      'free': that.data.mf,
      "code": that.data.code,
      "type": 2
    }
    this_.setData({
      charging: data
    })
    api.form_('Scan/start', data, null, function success(res) {
      console.log(res.data)
      this_.setData({
        startData: res.data.data
      })
      switch (res.data.result_code) {
        case "304": // 端口正在使用
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          });
          break;
        case "324": // 余额为负
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false,
                  stop: false,
                  full_stop: 2
                })
              } else {
                this_.setData({
                  stop: false,
                  full_stop: 2
                })
                wx.showLoading({
                  title: '提交中'
                })
                wx.login({
                  success: function (res) {
                    let data = {
                      code: res['code'],
                      fee: this_.data.startData.debt,
                      member: 1
                    }
                    api.form_('pay/pay_fee', data, null, function success(res) {
                      if (res.data.result_code == 314) {
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
                                if (res.data.result_code == '300') {
                                  wx.showToast({
                                    title: '补缴成功',
                                    icon: 'success',
                                    duration: 2000
                                  })
                                  this_.setData({
                                    money: '',
                                    isSubmit: false
                                  })
                                }
                              }, function fail(e) {
                                console.log(e)
                                this_.setData({
                                  isSubmit: false
                                })
                              })
                            },
                            fail: function (res) {
                              wx.hideLoading()
                              this_.setData({
                                isSubmit: false
                              })
                            }
                          })
                        }
                      } else {
                        console.log('失败')
                      }
                    })
                  }
                })
              }
            }
          })
          break;
        case "335": // 余额不足
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false,
                  stop: false,
                  full_stop: 2
                })
              } else {
                //点击确定
                this_.setData({
                  isSubmit: false,
                  stop: false,
                  full_stop: 2
                })
                wx.navigateTo({
                  url: '../wxRecharge/wxRecharge?charging=' + encodeURIComponent(JSON.stringify(this_.data.charging))
                })
              }
            }
          })
          break;
        case "338": //成功
          this_.setData({
            count: data.count
          })
          wx.hideLoading()
          if (data.flip == 1) {
            wx.reLaunch({
              url: '../countDown/countDown?log_id=' + data.user_log_id + '&time=' + this_.data.time + '&get_coupon=' + 2
            })
          } else {
            this_.setData({
              charge: true
            })
            this_.takeTimeOut();
          }
          break;
        default: //其他
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg
          })
          this_.setData({
            stop: false,
            full_stop: 2
          })
          wx.hideLoading();
      }
    })
  },

  // 充满即停
  openStop: function () {
    let that = this
    if (that.data.data.month_card_scheme == 0 && that.data.data.card_list.length == 0) {
      api.form_('Agreement/charge_full_agreement', {
        "userid_locked": wx.getStorageSync('userid_locked')
      }, null, function success(res) {
        that.setData({
          showModal: true,
          agreement: res.data.data.agreement
        })
      })
    }
  },

  cantUse: function () {
    wx.showToast({
      title: '请勿重复操作',
      icon: 'none'
    })
  },

  // 临时支付
  open_pay: function () {
    let this_ = this;
    let that = this.data;
    wx.showLoading({
      title: '开启中',
      success: function (res) {
        this_.setData({
          disable: true,
          general_charge: 1
        })
      }
    })

    let data = {
      "userid_locked": wx.getStorageSync('userid_locked'),
      "scan": that.data.scan,
      "time": that.time,
      'ticket_id': that.data.mf <= 0 ? that.ticket_id : '0', // 临时
      'card_id': '0', // 月卡
      'free': that.data.mf,
      "code": that.data.code
    }
    console.log(data)
    this_.setData({
      charging: data
    })

    api.form_('Scan/start', data, null, function success(res) {
      this_.setData({
        startData: res.data.data
      })
      let data = res.data.data;
      switch (res.data.result_code) {
        case "304": //  端口正在使用
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          });
          break;
        case "324": //余额为负
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false,
                  disable: false,
                  general_charge: 2
                })
              } else {
                this_.setData({
                  disable: false,
                  general_charge: 2
                })
                wx.showLoading({
                  title: '提交中'
                })
                wx.login({
                  success: function (res) {
                    let data = {
                      code: res['code'],
                      fee: this_.data.startData.debt,
                      member: 1
                    }
                    api.form_('pay/pay_fee', data, null, function success(res) {
                      if (res.data.result_code == 314) {
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
                                if (res.data.result_code == '300') {
                                  wx.showToast({
                                    title: '补缴成功',
                                    icon: 'success',
                                    duration: 2000
                                  })
                                  this_.setData({
                                    money: '',
                                    isSubmit: false
                                  })
                                }
                              }, function fail(e) {
                                console.log(e)
                                this_.setData({
                                  isSubmit: false
                                })
                              })
                            },
                            fail: function (res) {
                              wx.hideLoading()
                              this_.setData({
                                isSubmit: false
                              })
                            }
                          })
                        }
                      } else {
                        console.log('失败')
                      }
                    })
                  }
                })
              }
            }
          })
          break;
        case "333": //强制月卡升级
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false,
                  disable: false,
                  general_charge: 2
                })
              } else {
                //点击确定
                this_.mon_card()
                this_.data.startData.upgrade = 3
              }
            }
          })
          break;
        case "335": //余额不足
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false,
                  disable: false,
                  general_charge: 2
                })
              } else {
                //点击确定
                this_.setData({
                  isSubmit: false,
                  disable: false,
                  general_charge: 2
                })
                wx.navigateTo({
                  url: '../wxRecharge/wxRecharge?charging=' + encodeURIComponent(JSON.stringify(this_.data.charging))
                })
              }
            }
          })
          break;
        case "333": //功率超额开启
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: '功率超额，请升级月卡',
            confirmText: '升级月卡',
            confirmColor: '#0da297',
            cancelColor: 'cancelColor',
            success: function (res) {
              if (res.cancel) {
                this_.setData({
                  isSubmit: false,
                  disable: false,
                  general_charge: 2
                })
              } else {
                this_.mon_card();
              }
            }
          })
          break;
        case "336": //功率超额
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            cancelText: '升级月卡',
            cancelColor: '#efefef',
            confirmText: '余额开启',
            confirmColor: '#0da297',
            cancelColor: 'cancelColor',
            success: function (res) {
              if (res.cancel) {
                this_.mon_card()
              } else {
                this_.setData({
                  card_id: ''
                })
                this_.open_pay()
              }
            }
          })
          break;
        case "338": //成功
          this_.setData({
            count: data.count
          })
          wx.hideLoading()
          if (data.flip == 1) {
            wx.reLaunch({
              url: '../countDown/countDown?log_id=' + data.user_log_id + '&time=' + this_.data.time + '&get_coupon=' + 2
            })
          } else {
            this_.setData({
              charge: true
            })
            this_.takeTimeOut();
          }
          break;
        default: //其他
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg
          })
          this_.setData({
            disable: false,
            general_charge: 2
          })
          wx.hideLoading();
      }
    })
  },

  //优惠卷
  coupon: function () {
    if (this.data.time == 0 && this.data.ticket_list.length > 1) {
      wx.showToast({
        title: '请选择时间',
        icon: 'loading'
      })
    }
  },
  //加入会员
  addVip_: function (e) {
    if (this.data.case) {
      wx.navigateTo({
        url: '../member/member?switch_=' + this.data.data.vip_sale_switch + '&vip_sale=' + this.data.data.vip_sale + '&case=true'
      })
    } else if (this.data.reson) {
      wx.navigateTo({
        url: '../member/member?switch_=' + this.data.data.vip_sale_switch + '&vip_sale=' + this.data.data.vip_sale + '&reson=true'
      })
    } else {
      wx.navigateTo({
        url: '../member/member?switch_=' + this.data.data.vip_sale_switch + '&vip_sale=' + this.data.data.vip_sale
      })
    }
  },
  //月卡
  mon_card: function () {
    let that = this;
    if (this.data.case) {
      wx.navigateTo({
        url: '../mcard/mcard?card_id=' + this.data.card_id + '&upgrade=' + this.data.startData.upgrade + '&case=true'
      })
    } else if (this.data.reson) {
      wx.navigateTo({
        url: '../mcard/mcard?card_id=' + this.data.card_id + '&upgrade=' + this.data.startData.upgrade + '&reson=true'
      })
    } else {
      wx.navigateTo({
        url: '../mcard/mcard?card_id=' + this.data.card_id + '&upgrade=' + this.data.startData.upgrade
      })
    }
    that.setData({
      isSubmit: false
    })
  },

  //签到
  signin: function (e) {
    let index = e.currentTarget.dataset.index
    let that = this
    if (that.data.data.rebroadcast[index].type == '1') {
      wx.navigateToMiniProgram({
        appId: that.data.data.rebroadcast[index].car_shop_appid,
        path: that.data.data.rebroadcast[index].url_platform,
        success: function(res) {
          let data = {
            userid_locked: wx.getStorageSync('userid_locked'),
            url: that.data.data.rebroadcast[index].url_platform
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
    } else if(that.data.data.rebroadcast[index].type == '2') {
      wx.navigateTo({
        url: '../battery/battery?url=' + that.data.data.rebroadcast[index].url
      })
    } else if(that.data.data.rebroadcast[index].type == '3') {
      wx.navigateTo({
        url: '../integralSharing/integralSharing'
      })
    } else if(that.data.data.rebroadcast[index].type == '4') {
      wx.navigateTo({
        url: '/pages/buyCar/invitation/invitation'
      })
    }
  },
  //倒计时
  takeTimeOut: function () {
    var that = this;
    setTimeout(function () {
      var takeTime = that.data.takeTime - 1;
      that.setData({
        takeTime: takeTime
      })
      if (takeTime > 0) {
        that.takeTimeOut();
      } else {
        let data = {
          userid_locked: wx.getStorageSync('userid_locked'),
          flip: that.data.flip
        }
        api.form_('Scan/charge_standard', data, null, function success(res) {}, function fail(e) {
          console.log(e)
        })
        wx.reLaunch({
          url: '../countDown/countDown?log_id=' + that.data.startData.user_log_id + '&time=' + that.data.time + '&get_coupon=' + 2
        })
        that.setData({
          charge: false
        })
      }
    }, 1000);
  },
  icon1: function (e) {
    this.setData({
      icon1: false,
      icon2: true
    })
    this.setData({
      flip: e.currentTarget.dataset.index
    })
  },
  icon2: function (e) {
    this.setData({
      icon1: true,
      icon2: false
    })
    this.setData({
      flip: e.currentTarget.dataset.index
    })

  },
  // 购买
  purchase: function () {
    // 临时
    console.log(this.data.reson)
    console.log(this.data.case)
    if (this.data.reson) {
      wx.navigateTo({
        url: '../specialPackage/specialPackage?reson=true',
      })
      // 月卡
    } else if (this.data.case) {
      wx.navigateTo({
        url: '../specialPackage/specialPackage?case=true',
      })
    } else {
      wx.navigateTo({
        url: '../specialPackage/specialPackage',
      })
    }
  },

  // 取消
  cancel: function () {
    this.setData({
      control: false,
    })
    if (this.data.ticket_id != '0') {
      this.setData({
        ticket_id: 0
      })
    }
  }
})