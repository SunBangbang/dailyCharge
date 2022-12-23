var api = require('../../../utils/api.js')
Page({
  data: {
    region: [],
    index: 0,
    addressList: [
      ["陕西省"],
      ["西安市"],
      ["新城区", "碑林区", "莲湖区", "雁塔区", "灞桥区", "未央区",  "长安区"]
    ],
    allLabel: [{
        name: '公司',
        id: '1'
      },
      {
        name: '家',
        id: '2'
      },
      {
        name: '学校',
        id: '3'
      },

      {
        name: '其他',
        id: '4'
      },
    ],
    label: 0,
    name_: '',
    phone: '',
    detailed: "",
    data: [],
    defaults: false
  },
  onLoad: function(options) {
    let that = this;
    if (options.data) {
      that.setData({
        data: JSON.parse(options.data)
      })
      that.setData({
        region: JSON.parse(options.data).area.split(" "),
        label: JSON.parse(options.data).tab,
        defaults: JSON.parse(options.data).default_addr == 2,
        name_: JSON.parse(options.data).consignee,
        phone: JSON.parse(options.data).phone,
        detailed: JSON.parse(options.data).address
      })
    }
  },
  // 区域
  bindRegionChange: function(e) {
    for (var i = 0; i < e.detail.value.length; i++) {
      e.detail.value[i] = this.data.addressList[i][e.detail.value[i]]
    }

    this.setData({
      region: e.detail.value
    })
  },
  // 标签
  label: function(e) {
    this.setData({
      label: e.currentTarget.dataset.label
    })
  },
  // 姓名
  name: function(e) {
    this.setData({
      name_: e.detail.value
    })
  },
  // 手机
  phone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 详细地址
  detailed: function(e) {
    this.setData({
      detailed: e.detail.value
    })
  },
  icon: function() {
    var defaults = !this.data.defaults;
    this.setData({
      defaults: defaults
    })
  },
  preservation: function(e) {
    let that = this.data;
    if (!that.name_) {
      wx.showToast({
        title: '收货人不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    if (!that.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    } else if (!/^1[3456789]\d{9}$/.test(that.phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    if (!that.region.join(" ")) {
      wx.showToast({
        title: '所在地区不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    if (!that.detailed) {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    let data = {
      userid_locked: wx.getStorageSync('userid_locked'),
      name: that.name_,
      phone: that.phone,
      address: that.region.join(" "),
      detailed: that.detailed
    }

    if (that.data.id) {
      data.addr_id = that.data.id
    }

    let pages = getCurrentPages();

    let prevPage = pages[pages.length - 2];


    prevPage.setData({
      address: data
    })

    wx.navigateBack({
      delta: -1
    })
    // api.form_('shop/creat_addr', data, e.detail.formId, function success(res) {
    //   if (res.data.code == 1) {
    //     wx.navigateTo({
    //       url: '../allAddress/allAddress',
    //     })
    //   } else {
    //     wx.showToast({
    //       title: res.data.msg,
    //       icon: 'none'
    //     })
    //   }
    // })
  }
})