// pages/battery/battery.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    hd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.hd != 'undefined') {
      this.setData({
        hd: options.hd
      })
    }
    if (options.url && options.url != 'undefined') {
      this.setData({
        url: options.url + '?Uid=' + wx.getStorageSync('userid_locked') + '&hd=' + options.hd + '&key=' + options.key
      })
    }
  },

  download: function (url) {
    console.log(url)
    wx.downloadFile({
      url: url,
      success: (res) => {
        console.log(res)
        let path = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: res => {
            wx.showToast({
              title: '保存成功！'
            })
            console.log('保存成功！')
          },
          fail: error => {
            wx.showToast({
              title: "保存失败"
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    app.globalData.callback = function (data) { //接收服务器发来的非心跳包数据
      /**
       *里面写收到服务器发来的非心跳包数据，根据业务需求做后续逻辑处理
       */
      console.log(data)
      if (data.func == 'download') {
        console.log("执行保存文件");
        that.download(data.data.url)
      } else {
        console.log(111)
      }
    }
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
    app.globalData.callback = function(data){
      console.log("卸载监听事件")
    }
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