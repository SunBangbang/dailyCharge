var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check_index: 0,
    user_cards_q: [],
    user_cards_k: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.listCard();
    that.listTicket();
  },
  // 卡
  listCard() {
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync("userid_locked")
    }
    api.form_('Card/card_list', data, null, function success(res) {
      that.setData({
        user_cards_k: res.data.data
      })
    }, function fail(e) {
      console.log(e)
    })
  },
  // 券
  listTicket() {
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync("userid_locked")
    }
    api.form_('Card/ticket_list', data, null, function success(res) {
      that.setData({
        user_cards_q: res.data.data
      })
    }, function fail(e) {
      console.log(e)
    })
  },
  checknav: function (e) {
    if (this.data.check_index == parseInt(e.currentTarget.id.replace("nav_", "")))
      return;
    this.setData({
      check_index: parseInt(e.currentTarget.id.replace("nav_", ""))
    })
  },
  //权益
  equity: function (e) {
    const type = e.currentTarget.dataset.card_type;
    const card_id = e.currentTarget.dataset.card_id;
    if (type == 1) {
      wx.navigateTo({
        url: '../vipEquity/vipEquity?card_id=' + card_id,
      })
    } else if (type == 2 || type == 5 || type == 6 || type == 7) {
      wx.navigateTo({
        url: '../mcardEquity/mcardEquity?card_id=' + card_id
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: '../ycardEquity/ycardEquity?card_id=' + card_id
      })
    }
  }
})