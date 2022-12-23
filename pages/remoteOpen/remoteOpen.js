var api = require('../../utils/api.js')
Page({

  data: {
    list: [],
    focus_index: 0,
    code_value: [],
    num_length: 4,
    isFocus: true
  },
  // 手指点击触碰后离开锁定事件
  getFocus: function () {
    this.setData({
      isFocus: true
    })
  },
  
  inputNum: function (e) {
    var value = e.detail.value;
    this.setData({
      code_value: value.split(""),
      list: [] // 每次输入的时候清空搜索的内容
    })
    if (value.length == 4) {
      this.search();
    }
  },
  search: function () {
    wx.showLoading({
      title: '加载中...'
    })
    var that = this;
    let data = {
      code: that.data.code_value.join(""),
      userid_locked: wx.getStorageSync("userid_locked")
    }
    api.form_('Scan/get_community', data, null, function success(res) {
      that.setData({
        list: res.data.data
      })
      wx.hideLoading();
    }, function fail(e) {
      console.log(e)
      wx.hideLoading();
    })
  },
  //确定开启
  remoteOpen: function (e) {

    let that = this;

    that.setData({
      check_index: e.target.dataset.index
    })

    wx.showModal({
      title: "开启端口",
      content: "是否确认开启该社区端口",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#000",
      confirmText: "开启",
      confirmColor: "#0da297",
      success: function (res) {
        if (res.confirm) {
          if(!that.data.list[that.data.check_index])return;
          var scan = that.data.list[that.data.check_index].scan;
          wx.setStorageSync("str", scan)
          let data = {
            userid_locked: wx.getStorageSync('userid_locked'), //用户唯一识别
            str: scan, //端口号
          }
          api.form_('Scan/scan', data, null, function success(res) {
            console.log(res.data)
            switch (res.data.result_code) {
              case "300": //成功
                var data = JSON.stringify(res.data.data);
                wx.setStorageSync('operator_phone', res.data.data.operator_phone);
                wx.redirectTo({
                  url: '../openCharging/openCharging?support_month_card=' + res.data.support_month_card + '&num_id=' + res.data.num_id + '&data=' + data
                })
                break;
              default: //其他
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.msg
                })
            }

          }, function fail(e) {
            console.log(e)
          })
        }
        that.setData({
          check_index: -1
        })
      }
    })
  }
})