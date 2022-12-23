var api = require('../../utils/api.js')
Page({
  data: {
    goods_detail: {},
    listData: [],
    order_id: ''
  },
  onLoad: function(options) {
    let that = this;
    var str = "a13890845414b18111111111c"
    that.checkPhone(str);

    that.setData({
      order_id: options.logistics_id
    })
    that.listData()
  },
  // 页面渲染
  listData: function() {
    let that = this;
    let data = {
      mall_order_id: that.data.order_id
    };
    console.log(that.data)
    api.form_('Shop/logistics_query', data, null, function success(res) {
      var listdata = [];
      for (var i = 0; i < res.data.data.length; i++) {
        var dataItem = res.data.data[i];
        dataItem.context = that.checkPhone(dataItem.context);
        listdata.push(dataItem);
      }
      that.setData({
        listData: listdata,
        goods_detail: res.data.goods_detail
      })
    }, function fail(e) {
      console.log(e)
    })
  },
  // 物流电话
  mobie: function(v) {
    wx.makePhoneCall({
      phoneNumber: v.currentTarget.dataset.phone
    })
  },
  checkPhone: function(str) {
    var reg = /((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\d3,4|\d{3,4}-|\s)?\d{7,14}))?/g;
    var strArr = [];
    var arr = str.match(reg);
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i])
      if (arr[i]) {
        strArr.push({
          "value": str.split(arr[i])[0],
          "type": "string"
        })
        strArr.push({
          "value": arr[i],
          "type": "phone"
        })
        str = str.split(arr[i])[1];
        console.log(str)
      }
    }
    strArr.push({
      "value": str,
      "type": "string"
    });
    return strArr;
  }
})