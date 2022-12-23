var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '',
    isAnimate: false,
    small_double_twelve:'3',
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.listData();
    that.animationInterval();
  },
  // 页面渲染
  listData:function(){
  let that = this;
  let data = {
    userid_locked: wx.getStorageSync('userid_locked')
  }
  api.form_('login/share_code', data, null, function success(res) {
    console.log(res)
    that.setData({
      data: res.data,
      userId: res.data.url.match(/qrshare\/(\S*)\.png/)[1]
    })
  }, function fail(e) {
    console.log(e)
  })
  },
  animationInterval: function() {
    let that = this;
    this.countTimer = setInterval(() => {
      var f = !that.data.isAnimate;
      that.setData({
        isAnimate: f
      })
    }, 500)
  },
  //转发
  onShareAppMessage: function(res) {
    // let userid = wx.getStorageSync("userid_locked");
    if (res.from === 'button') {}
    return {
      title: '邀好友，赚积分',
      path: '/pages/index/index?userid=' +  this.data.userId,
      imageUrl: 'https://api.cd1a.cn/imges/share1.png',
      success: function(res) {
        console.log(res)
      }
    }
  }
})