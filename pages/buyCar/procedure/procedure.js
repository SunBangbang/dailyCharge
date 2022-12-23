var api = require('../../../utils/api.js')
Page({

  data: {
    nav_index:0,
    check_index: -1,
    data:'',
    back_img:''
  },
  onLoad: function (options) {
    let that = this;
    api.form_('buycar/car_rules', {}, null, function success(res) {
      console.log(res.data)
      that.setData({
        data: res.data.data.list,
        back_img:res.data.data.img
      })
    }, function fail(e) {
      console.log(e)
    })
  },

  next: function () {
    if (this.data.check_index == -1) {
      wx.showToast({
        title: '请选择付款方式',
        icon: 'loading',
        mask: true
      })
      return;
    }
    var toUrl = "../byStagesPay/byStagesPay";
    if (this.data.check_index == 1) {
      toUrl = "../shopping/shopping";
    }
    wx.redirectTo({
      url: toUrl
    })
  },

  checkMethod: function (o) {
    this.setData({
      check_index: o.currentTarget.dataset.index
    })
  },

  changeNav: function (o) {
    if(o.currentTarget.dataset.index==1){
      wx.redirectTo({
        url: "../shopping/shopping"
      })
    }
    // this.setData({
    //   nav_index: o.currentTarget.dataset.index
    // })
  },
  intoMap: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: 34.252727,
          longitude: 108.908976,
          name: "天天出行总部(西安天天充电运营中心) 莲湖区 劳动南路168号10栋天天出行",
          scale: 18
        })
      }
    })
  },
})