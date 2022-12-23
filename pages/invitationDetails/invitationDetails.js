Page({
  data: {
    small_double_twelve:'3'
  },
  onPageScroll: function(e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function(e) { 
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低,无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //分享页面
  share: function() {
    wx.navigateTo({
      url: '../integralSharing/integralSharing'
    })
  },
})