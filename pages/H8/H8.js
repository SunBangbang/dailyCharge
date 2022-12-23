Page({
  data: {
    url:'https://api.cd1a.cn/sb/jiaoben7212/index.html',
    id:''
  },
  onLoad(options) {
    let that =this;
    // let loginName = encodeURI(wx.getStorageSync('userid_locked'));
    that.setData({
      id:wx.getStorageSync('userid_locked'),
      // url:`${that.data.url}${loginName}`
    })
    console.log(wx.getStorageSync('userid_locked'))
    console.log(that.data.id)
  }
})