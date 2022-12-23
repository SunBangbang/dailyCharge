// pages/personal/personal.js
var api = require('../../utils/api.js')
Page({
  data: {
    data: {},
    userid: undefined,
    user_id: undefined,
    nav: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {
      userid_locked: 0
    }
    let that = this
    api.form_('Money/wallet', data, null, function success(res) {
      console.log(res.data)
      that.setData({
        data: res.data.data,
        nav: res.data.data.button,
      })
    })
  },

  navigtion: function () {
    wx.showToast({
      title: '请先登录',
      icon: 'loading'
    })
  },

  mobie: function () {
    wx.makePhoneCall({
      phoneNumber: '4006888919'
    })
  },

  signin: function () {
    wx.showModal({
      title: '温馨提示',
      content: '是否登录？',
      success: function (res) {
        if(res.confirm) {
          wx.reLaunch({
            url: '../authorize/authorize'
          })
        }
      }
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