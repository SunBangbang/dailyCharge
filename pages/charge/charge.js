var api = require('../../utils/api.js')
Page({
  data: {
    recordDate: [],
    year_month: "",
    changeDate: "",
    page_index: 1,
    total: -1,
    contentHeight: 0,
    full_stop: ''
  },
  onLoad: function() {
    this.search();
  },
  onShow: function() {
    let that = this;
    let sq = wx.createSelectorQuery();
    sq.select(".content").boundingClientRect(function(rect) {
      if(!rect)return;
      that.setData({
        contentHeight: rect.height
      })
    }).exec();
  },
  isNeedMore: function() {
    let that = this;
    let sq = wx.createSelectorQuery();
    sq.select(".content_list").boundingClientRect(function(rect) {
      if(!rect)return;
      if (that.data.contentHeight >= rect.height) {
        that.search()
      }
    }).exec();
  },
  showdetial: function(e) {
    if (e.currentTarget.dataset.status == 1) {
      // var index = e.currentTarget.dataset.index;
      // var now = "recordDate[" + index + "].isShow";
      // var nowVal = !this.data.recordDate[index].isShow;
      // this.setData({
      //   [now]: nowVal
      // })
      wx.navigateTo({
        url: '../countDown/countDown?log_id=' + e.currentTarget.dataset.user_log_id + '&get_coupon=' + 1
      })
    }else{
      var index = e.currentTarget.dataset.index;
      var now = "recordDate[" + index + "].isShow";
      var nowVal = !this.data.recordDate[index].isShow;
      this.setData({
        [now]: nowVal
      })
    }
  },

  // 时间选择事件
  bindDateChange: function(r) {
    let that = this;
    this.setData({
      changeDate: r.detail.value,
      page_index: 1,
      recordDate: [],
      total: -1
    })
    // 调用时间请求接口
    that.search()
  },
  // 调用时间请求接口
  search: function() {
    let that = this;
    if (that.data.total == that.data.recordDate.length)
      return;
    let data = {
      userid_locked: wx.getStorageSync("userid_locked"),
      time: this.data.changeDate,
      page_index: this.data.page_index
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    api.form_('Money/user_log_list', data, null, function success(res) {
      console.log(res.data)
        res.data.data.list.forEach(item => {
        if(item.full_stop == 2) {
          that.setData({
            full_stop: item.full_stop
          })
        }
      })
      if (res.data.data.page_index != 1) {
        var l = that.data.recordDate.concat(res.data.data.list)
        that.setData({
          recordDate: l
        })
      } else {
        that.setData({
          recordDate: res.data.data.list,
          year_month: res.data.data.year_month,
          total: res.data.data.total
        })
      }
      var index = that.data.page_index + 1;
      that.setData({
        page_index: index
      })
      that.isNeedMore();   
      //wx.hideLoading();
    }, function fail(e) {
      console.log(e)
    })
  },

  loadMore: function() {
    this.search()
  }
})