// pages/buyCar/invitation/invitation.js
var api = require('../../../utils/api.js')

Page({
  data: {
    scorllHeight:0,
    isShowToTop:false,
    showHeight:60,     //在60%左右显示
    scrollTop:0,
    image_list:[]
  },
  onLoad: function (options) {
    let that = this ;
    api.form_('buycar/car_img', {}, null, function success(res) {
      that.setData({
        image_list: res.data.data.list
      })
    }, function fail(e) {
      console.log(e)
    })
  },
// 推荐好友
  recommend: function () {
    wx.navigateTo({
      url: "../recommend/recommend"
    })
  },
  // 我要购买
  procedure: function () {
    wx.redirectTo({
      url: "../procedure/procedure"
    })
  },
  onShow: function(){
    // let that = this;
    // var query = wx.createSelectorQuery();
    // query.select('.scroll_content').boundingClientRect()
    // query.exec(function (res) {
    //   that.setData({
    //     scorllHeight: res[0].height * that.data.showHeight / 100
    //   })
    // })
  }, 
  scorllY: function(o){
    // var topPx = o.detail.scrollTop;
    // var isShow = false;
    // if (topPx > this.data.scorllHeight){
    //   isShow = true;
    // }
    // this.setData({
    //   scrollTop: topPx,
    //   isShowToTop: isShow
    // })
  },
  toTop: function(){
    // if (!this.data.isShowToTop) return;
    // this.setData({
    //   scrollTop: 0
    // })
  }
})