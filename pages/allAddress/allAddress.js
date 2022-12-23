var api = require('../../utils/api.js')
Page({
  data: {
    select_index: -1,
    data: [],
    isDex: false,
    dex_addr_id: ""
  },
  onLoad: function(options) {
    let that = this;
    if (options.addr_id) {
      this.setData({
        dex_addr_id: options.addr_id
      })
    }
    if (options.isDex) {
      this.setData({
        isDex: options.isDex,

      })
    }

  },
  onShow: function() {
    this.addressList()
  },
  checkAddress: function(e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.isDex) {
      var pages = getCurrentPages(); // 获取页面栈
      var currPage = pages[pages.length - 1]; // 当前页面
      var prevPage = pages[pages.length - 2]; // 上一个页面
      prevPage.setData({
        address: this.data.data[index] // 假数据
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      if (this.data.select_index == index) {
        this.setData({
          select_index: -1
        })
        return;
      }
      this.setData({
        select_index: index
      })
    }
  },
  //列表渲染
  addressList: function() {
    let that = this;
    let data = {
      userid_locked: wx.getStorageSync('userid_locked')
    }
    api.form_('shop/address', data, null, function success(res) {
      that.setData({
        data: res.data.date
      })
    }, function fail(e) {
      console.log(e)
    })
  },
  //修改地址
  modifyAddress: function(e) {
    let data = {
      addr_id: e.currentTarget.dataset.id
    }
    api.form_('shop/choose_addr', data, null, function success(res) {
      let data = JSON.stringify(res.data.date)
      wx.navigateTo({
        url: '../modifyAddress/modifyAddress?data=' + data,
      })
    }, function fail(e) {
      console.log(e)
    })
  },
  //删除地址
  modifyDelete: function(e) {
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '你确定要删除改地址信息',
      confirmColor: '#0da297',
      success: function(res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          let data = {
            addr_id: e.currentTarget.dataset.id
          }
          api.form_('shop/delete_addr', data, null, function success(res) {
            if (res.data.code == 1) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success'
              })
              that.addressList()
            }
          }, function fail(e) {
            console.log(e)
          })
        }
      }
    })


  },

  //新建收获地址
  newAddress: function(e) {
    wx.navigateTo({
      url: '../modifyAddress/modifyAddress',
    })
  }
})