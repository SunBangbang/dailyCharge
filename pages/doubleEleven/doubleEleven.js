var api = require('../../utils/api.js')
Page({

  data: {
    imageList: [{
      'imges': ' https://api.cd1a.cn/imges/49_.png',
      'id': '3',
      'money':'4900'
    },
    {
      'imges': ' https://api.cd1a.cn/imges/99_.png',
      'id': '10',
      'money': '9900'
    },
    {
      'imges': ' https://api.cd1a.cn/imges/168_.png',
      'id': '25',
      'money': '16800'
    }
    ],
    mask:false,
    id:'',
    money:''
  },
  onShow: function () {
    let that = this;
    that.postData();

  },
  onUnload: function () {
    if (this.postDataTimer) {
      clearInterval(this.postDataTimer);
      this.postDataTimer = null;
    }
    if (this.peopleAnimateTimer) {
      clearInterval(this.peopleAnimateTimer);
      this.peopleAnimateTimer = null;
    }
    if (this.countTimer) {
      clearInterval(this.countTimer);
      this.countTimer = null;
    }
  },
  postData: function () {
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync("userid_locked")
    }
    api.form_('scan/double_eleven', data, null, function success(res) {
      that.setData({
        remainingTime: that.timeFormat(res.data.remaining_time),
        remaining_people: res.data.remaining_people,
        remaining_time: res.data.remaining_time
      })
      that.countInterval();
      that.peopleAnimateInterval();
      that.postDataInterval();
    }, function fail(e) {
      console.log(e)
    })
  },
  timeFormat: function (time) {
    var s = Math.floor(time % 60);
    var h = Math.floor(time / 3600 % 24);
    var m = Math.floor(Math.floor(time / 60) - Math.floor(Math.floor(time / 3600) * 60));
    var d = Math.floor(time / 3600 / 24);
    return d + '天' + this.add0(h) + '小时' + this.add0(m) + '分' + this.add0(s) + '秒';
  },
  add0: function (m) {
    return m < 10 ? '0' + m : m
  },
  countInterval: function () {
    let that = this;
    if (this.countTimer) return;
    this.countTimer = setInterval(() => {
      var rem = that.data.remaining_time - 1;
      that.setData({
        remainingTime: that.timeFormat(rem),
        remaining_time: rem
      })
    }, 1000)
  },
  peopleAnimateInterval: function () {
    let that = this;
    if (this.peopleAnimateTimer) return;
    this.peopleAnimateTimer = setInterval(() => {
      var people_animate = !that.data.people_animate;
      that.setData({
        people_animate: people_animate
      })
    }, 500)
  },
  postDataInterval: function () {
    let that = this;
    if (this.postDataTimer) return;
    this.postDataTimer = setInterval(() => {
      that.postData();
    }, 5000)
  },
  mask_show:function(e){
    this.setData({
      money:e.currentTarget.dataset.money,
      id: e.currentTarget.dataset.id,
      mask:true
    })
  },
  mask_hidden:function(){
    this.setData({
      money: '',
      id: '',
      mask: false
    })
  },
   //充值
  imageList: function (e) {
    let this_ = this;
    wx.showLoading({
      title: '等待中',
      mask: true
    })
    wx.login({
      success: function (res) {
        let data = {
          code: res['code'],
          fee: this_.data.money,
          member: 10
        }
        api.form_('pay/pay_fee', data, e.detail.formId, function success(res) {
          if(res.data.result_code==314){
            let order_id = res.data.order_id;
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
                success: function (res) {
                  let data = {
                    order_number: order_id,
                    userid_locked: wx.getStorageSync('userid_locked')
                  }
                  api.form_('pay/check_pay', data, e.detail.formId, function success(res) {
                    if (res.data.result == "success") {
                      wx.hideLoading()
                      this_.setData({
                        money: ''
                      })
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }, function fail(e) {
                    console.log(e)
                  })
                },
                fail: function (res) {
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
  },
  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },
})