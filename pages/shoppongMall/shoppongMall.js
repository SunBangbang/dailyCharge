var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_top: 0,
    isHide: false,
    isNeedHead:true,
    check_index:0,
    goods_list: [],
    list:[],
    page_index:1,
    total:0,
    integral:0,
    windowHeight:0,
    goodsHeight: 0,
    goods1Height: 0
  },
  onShow: function () {
    this.setData({
      page_index: 1,
      goods_list: [],
      list: []
    })
    this.search();
  },

  scrollFun: function(e) {
    if (this.data.check_index == 0){
      // 50 为没有更多的 line-height， windowHeight 为滚动内容的实际高度
      if (this.data.windowHeight > this.data.goodsHeight + 50) {
        return;
      }
    }else{
      if (this.data.windowHeight > this.data.goods1Height + 50) {
        return;
      }
    }
    if (this.data.scroll_top < e.detail.scrollTop) {
      this.setData({
        isHide: true
      })
    } else if (e.detail.scrollTop <= 50) { 
      this.setData({
        isHide: false
      })
    }
    this.setData({
      scroll_top: e.detail.scrollTop
    })
  },

  countHeight:function(){
    let that = this;
    var query = wx.createSelectorQuery();

    query.select('.goods_con').boundingClientRect(function (rect) {
      if(!rect)return;
      that.setData({
        windowHeight: wx.getSystemInfoSync().windowHeight, // 手机屏幕的高度
        goodsHeight: rect.height // 滚动内容的高度
      })
    }).exec();

    query.select('.goods1_con').boundingClientRect(function (rect) {
      if(!rect)return;
      that.setData({
        windowHeight: wx.getSystemInfoSync().windowHeight,
        goods1Height: rect.height
      })
    }).exec();
  },

  search: function(){
    var methodName = "Shop/";
    if (this.data.page_index != 1){
      if (this.data.check_index == 0 && this.data.total == this.data.goods_list.length) {
        return;
      }
      if (this.data.check_index == 1 && this.data.total == this.data.list.length) {
        return;
      }
    }

    if(this.data.check_index == 0){
      methodName = "Shop/goods_list";
    } else {
      methodName = "Shop/integral_detail";
    }

    wx.showLoading({
      title: '加载中',
      mask:true
    })
    
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync("userid_locked"),
      page:that.data.page_index
    }
    api.form_(methodName, data, null, function success(res) {
      var pageIndex = that.data.page_index + 1;
      if (that.data.check_index == 0) {
        var l = that.data.goods_list.concat(res.data.list);
        that.setData({
          goods_list: l,
          page_index: pageIndex,
          total: res.data.sum_recode
        })
        if (res.data.integral){
          that.setData({
            integral: res.data.integral
          })
        }
      } else {
        var l = that.data.list.concat(res.data.list);
        that.setData({
          list: l,
          page_index: pageIndex,
          total: res.data.sum_page
        })
        if (res.data.integral) {
          that.setData({
            integral: res.data.integral
          })
        }
      }
      wx.hideLoading();
      that.countHeight();
    }, function fail(e) {
      console.log(e)
    })
  },

  //分享页面
  share: function() {
    wx.navigateTo({
      url: '../integralSharing/integralSharing'
    })
  },

  // 切换选项卡 积分商城 -- 积分明细 
  navClick: function(e) {
    var index = e.currentTarget.id.replace("nav_", "");
    if (this.data.check_index == index) return;
    this.setData({
      check_index: index,
      list: [],
      goods_list:[],
      total:0,
      page_index:1,
      scroll_top:0,
      isHide:false
    })
    this.search();
  },

  loadMore: function () {
    this.search()
  },

  // 积分规则
  integralRule: function() {
    wx.navigateTo({
      url: '../integralRule/integralRule',
    })
  },

  //地址管理
  information: function() {
    wx.navigateTo({
      url: '../allAddress/allAddress',
    })
  },

  // 商品详情
  commodityDetail:function(o){
    wx.navigateTo({
      url: '../commodityDetail/commodityDetail?id=' + o.currentTarget.dataset.id,
    })
  },

  //查看物流
  logistics:function(e){
    wx:wx.navigateTo({
      url: '../logistics/logistics?logistics_id=' + e.currentTarget.dataset.logistics_id,
    })
  }
})