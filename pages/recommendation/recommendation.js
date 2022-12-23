var api = require('../../utils/api.js')
Page({
  data: {
    list: [],
    sum: 0,
    recommend: 0,
    describe: "",
    contentHeight: 0,
    page_index: 1,
    total: -1
  },
  onLoad: function (options) {
    this.search();
    console.log(this.data.page_index)
  },
  onShow: function () {
    let that = this;
    let sq = wx.createSelectorQuery();
    sq.select(".content").boundingClientRect(function (rect) {
      if(!rect)return;
      that.setData({
        contentHeight: rect.height
      })
    }).exec();
  },


  search: function () {
    if (this.data.total != -1 || this.data.list.length == this.data.total) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked'),
      page: that.data.page_index
    }
    api.form_('money/recommend', data, null, function success(res) {
      console.log(res.data)
      var arr = that.data.list.concat(res.data.list)
      that.setData({
        sum: res.data.sum,
        describe: res.data.describe,
        recommend: res.data.recommend,
        list: arr,
        total: res.data.sum_page,
        page_index: that.data.page_index + 1
      })
      wx.hideLoading();

      that.isNeedMore();
    }, function fail(e) {
      console.log(e)
    })
  },


  isNeedMore: function () {
    let that = this;
    let sq = wx.createSelectorQuery();
    sq.select(".recomm_item_list").boundingClientRect(function (rect) {
      if (that.data.contentHeight >= rect.height) {
        that.search()
      }
    }).exec();
  },


  loadMore: function () {
    this.search()
  },


  //邀请
  share:function(){
    wx.navigateTo({
      url: '../integralSharing/integralSharing'
    })
  }
})