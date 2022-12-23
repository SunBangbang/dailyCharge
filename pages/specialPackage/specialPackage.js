var api = require('../../utils/api.js')
Page({
  data: {
    data: '',
    id:'',
    isJoin: '',
    reson: '',
    case: '',
    url: ''
  },

  onShow: function() {
    let that = this
    let pages = getCurrentPages()
    if(pages.length > 1) {
      let prePage = pages[pages.length - 2]
      prePage.setData({
        changeData:  that.data.isJoin
      })
    }
  },

  onLoad: function (options) {
    let that = this;
    console.log(options)
    console.log(options.id)
    console.log(options.reson)
    console.log(options.case)
    if (options.id) {
      that.setData({
        id: options.id
      })
    }
    if (options.reson) {
      this.setData({
        reson: options.reson
      })
    }
    if (options.case) {
      this.setData({
        case: options.case
      })
    }
    let data = {
      userid_locked: wx.getStorageSync("userid_locked")
    }
    api.form_('Money/active_list', data, null, function success(res) {
      console.log(res.data)
      that.setData({
        data: res.data.data,
      })
      if(res.data.data) {
        res.data.data.forEach(item => {
          console.log(item)
          if(item.url_type == '4') {
            that.setData({
              isJoin: item.is_join,
            })
          } 
          if(item.url_type == 5) {
            that.setData({
              url: item.url,
            })
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, function fail(e) {
      console.log(e)
    })
  },
  
  img_jump(o) {
    let type = o.currentTarget.dataset.type;
    if (type == 2) {
      //会员
      if(this.data.case) {
        wx.navigateTo({
          url: '../member/member?id=' +  this.data.id + '&case=true'
        })
      } else if(this.data.reson) {
        wx.navigateTo({
          url: '../member/member?id=' +  this.data.id + '&reson=true'
        })
      } else {
        wx.navigateTo({
          url: '../member/member?id=' +  this.data.id
        })
      }
    } else if (type == 3) {
      //月卡
      if(this.data.reson) { // 临时
        console.log(this.data.reson)
        wx.navigateTo({
          url: '../mcard/mcard?id=' + this.data.id + '&reson=true'
        })
      } else if(this.data.case) { // 月卡
        console.log(this.data.case)
        wx.navigateTo({
          url: '../mcard/mcard?id=' + this.data.id + '&case=true'
        })
      } else {
        wx.navigateTo({
          url: '../mcard/mcard?id=' + this.data.id
        })
      }
    } else if (type == 4) {
      if(this.data.isJoin == '2') {
        wx.navigateTo({
          url: '../buyCar/rate/rate',
        })
      } else {
        //购车
        wx.navigateTo({
          url: '../buyCar/invitation/invitation'
        })
      }
    } else if (type == 5) {
      wx.navigateTo({
        url: '../battery/battery?url=' + this.data.url
      })
    }
  }
})