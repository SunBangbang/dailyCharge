// pages/product/product.js
import api from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choiceCommIsShow: false,
    num: 1,
    isSure: false,
    autoplay: true,
    data: {},
    selectIndex: 0, // 颜色选择下标
    id: '', // 商品id
    img: '',
    mask: false,
    params: '' // 参数
  },

  // 客服图标
  contact_img: function() {
    wx.makePhoneCall({
      phoneNumber: '4006888919'
    })
  },

  // 商城图标
  bag_img: function() {
    wx.navigateBack({
      delta: -1,
    })
  },

  // 关闭弹框
  close_pop: function() {
    this.setData({
      mask: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    if(options.id) {
      this.setData({
        id: options.id // 商品id
      })
    }
    if(options.user_id) {
      let data = {
        userid_locked: options.user_id,
        goods_id: options.id
      }
      that.setData({
        params: data
      })
    } else {
      let data = { 
        userid_locked: wx.getStorageSync('userid_locked'),
        goods_id: options.id
      }
      that.setData({
        params: data
      })
    }
    api.active('Trans/GetGoodsInfo', that.data.params, function success(res) {
      console.log(res)
      // 该商品已下架
      if(res.data.code == 2) {
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          success: function(res) {
            if(res.confirm) {
              wx.reLaunch({
                url: '../car/car',
              })
            }
          }
        })
      } else {
        // 成功
        that.setData({
          data: res.data.data
        })
      }
    },
    function fail(err) {
      console.log(err)
    })
  },

  selectColor: function(e) {
    let index = e.currentTarget.dataset.index
    if(this.data.data.spec[index]) {
      this.setData({
        selectIndex: index
      })
    }
  },

  choiceClose: function() {
    this.setData({
      choiceCommIsShow: false,
      isSure: true
    })
  },

  close_mask: function() {
    this.setData({
      mask: false
    })
  },

  // 分销赚200元
  share_cash: function() {
    let that = this
    let data = {
      userid_locked: wx.getStorageSync('userid_locked'),
      goods_id: that.data.id
    }
    api.active('Trans/GetQrUrl', data, function success(res) {
      console.log(res)
      if(res.data.code == '1') {
        that.setData({
          mask: true,
          img: res.data.data
        })
      } else if(res.data.code == '2') {
        wx.showModal({
          content: res.data.msg,
          success: function(result) {
            if(result.confirm) {
              wx.navigateTo({
                url: '../battery/battery?url=' + res.data.data + '&key=' + that.data.id
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    function fail(err) {
      console.log(err)
    })
  },

  // 存储图片
  save_img: function() {
    wx.downloadFile({
      url: this.data.img,
      success: function(res) {
        // console.log(res)
        let path = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function() {
            wx.showToast({
              title: '保存成功!'
            })
          }
        })
      }
    })
  },

  // 确定购买
  choiceComm: function() {
    this.setData({
      choiceCommIsShow: true
    })
  },

  choiceSure: function() {
    let data = {
      color: this.data.data.spec[this.data.selectIndex].color,
      id: this.data.data.goods_id, // 商品id
      img: this.data.data.spec[this.data.selectIndex].img_url,
      price: this.data.data.spec[this.data.selectIndex].price * this.data.num,
      type: this.data.data.spec[this.data.selectIndex].id, // 类型id
      num: this.data.num,
      title: this.data.data.title
    }
    wx.navigateTo({
      url: '../paycar/paycar?details=' + encodeURIComponent(JSON.stringify(data))
    })
  },

  less: function() {
    if(this.data.num == 1) {
      return
    } else {
      this.data.num -= 1
      this.setData({
        num: this.data.num
      })
    }
  },

  add: function() {
    this.data.num += 1
    this.setData({
      num: this.data.num
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})