// pages/car/car.js
import api from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    check_index: 0,
    mask: false,
    page: 1,
    windowHeight: 0,
    isHide: false,
    scroll_top: 0,
    goodsHeight: 0,
    goods1Height: 0,
    is_length: true,
    h5_url: '', // h5链接地址
    url: '', // 地址
    goods_list: [], // 商品列表
    record_data: [], // 购买记录列表
    progress_data: [], // 进度详情
    more_touch: true,
    height: 320,
    nav: '', // banner跳转购车
    imgUrl: '' //banner图片地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.nav == '1') {
      wx.setStorageSync('nav', options.nav)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 如果从banner进入h5 返回后清空数组
    this.setData({
      page: 1,
      is_length: true,
      goods_list: [],
      record_data: []
    })
    this.search()
  },

  scrollFun: function (e) {
    if (this.data.check_index == 0) {
      // 50 为没有更多的 line-height， windowHeight 为滚动内容的实际高度
      if (this.data.windowHeight > this.data.goodsHeight + 50) {
        return;
      }
    } else {
      if (this.data.windowHeight > this.data.goods1Height + 50) {
        return;
      }
    }
    if (this.data.scroll_top < e.detail.scrollTop) {
      this.setData({
        isHide: true
      })
    } else if (e.detail.scrollTop <= 50) {
      this.setData({
        isHide: false
      })
    }
    this.setData({
      scroll_top: e.detail.scrollTop
    })
  },

  countHeight: function () {
    let that = this;
    var query = wx.createSelectorQuery();

    query.select('.goods_con').boundingClientRect(function (rect) {
      if (!rect) return;
      that.setData({
        windowHeight: wx.getSystemInfoSync().windowHeight, // 手机屏幕的高度
        goodsHeight: rect.height // 滚动内容的高度
      })
    }).exec();

    query.select('.goods1_con').boundingClientRect(function (rect) {
      if (!rect) return;
      that.setData({
        windowHeight: wx.getSystemInfoSync().windowHeight,
        goods1Height: rect.height
      })
    }).exec();
  },

  loadMore: function () {
    this.search()
  },

  search: function () {
    let that = this
    if (that.data.check_index == 0) {
      // 商品列表
      let url = 'Trans/GetGoods'
      that.setData({
        url: url
      })
    } else {
      // 购买记录
      let url = 'Trans/OrderLog'
      that.setData({
        url: url
      })
    }

    let data = {
      userid_locked: wx.getStorageSync('userid_locked'),
      page: that.data.page
    }
    if (that.data.is_length) {
      api.active(that.data.url, data, function success(res) {
          console.log(res)
          // 请求成功 
          if (res.data.code == '1') {
            that.data.page += 1
            if (that.data.check_index == 0) {
              if (res.data.data.goods_list.length != 0) {
                let arr = that.data.goods_list.concat(res.data.data.goods_list)
                that.setData({
                  goods_list: arr,
                  h5_url: res.data.data.url,
                  imgUrl: res.data.data.imgurl,
                  page: that.data.page
                })
                wx.showToast({
                  title: '加载中',
                  icon: 'loading'
                })
              } else {
                that.setData({
                  is_length: false
                })
              }
            } else {
              if (res.data.data.list.length != 0) {
                let arr = that.data.record_data.concat(res.data.data.list)
                that.setData({
                  record_data: arr,
                  h5_url: res.data.data.url,
                  imgUrl: res.data.data.imgurl,
                  page: that.data.page
                })
                wx.showToast({
                  title: '加载中',
                  icon: 'loading'
                })
              } else {
                that.setData({
                  is_length: false
                })
              }
            }
          } else {
            that.setData({
              is_length: false
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        },
        function fail(err) {
          console.log(err)
        })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  commodityDetail: function (e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../product/product?id=' + this.data.goods_list[index].goods_id
    })
  },

  telephone: function (e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.progress_data[index].status
    let phone = data.replace(/[^0-9]/ig, '')
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // 确认收货
  certain: function (e) {
    let index = e.currentTarget.dataset.index
    let that = this
    let data = {
      order_id: that.data.record_data[index].order_id
    }
    if(!that.data.more_touch) return
    if(that.data.more_touch) {
      api.active('Trans/OrderSure', data, function success(res) {
        that.setData({
          more_touch: false
        })
        console.log(res)
        if (res.data.code == '1') {
          that.setData({
            record_data: [],
            page: 1
          })
          let data = {
            userid_locked: wx.getStorageSync('userid_locked'),
            page: 1
          }
          api.active('Trans/OrderLog', data, function success(res) {
            let arr = that.data.record_data.concat(res.data.data.list)
            that.setData({
              more_touch: false,
              record_data: arr,
              h5_url: res.data.data.url,
              page: that.data.page,
              more_touch: true
            })
          })
          wx.showToast({
            title: '您已确认收货',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            more_touch: true
          })
        }
      },
      function fail(err) {
        console.log(err)
      })
    }
  },

  // 获取物流进度
  pro_detail: function (e) {
    let index = e.currentTarget.dataset.index
    let that = this
    let data = {
      order_id: that.data.record_data[index].order_id
    }
    api.active('Trans/OrderProgress', data, function success(res) {
        console.log(res)
        let arr = res.data.data.reverse()
        if (res.data.code == '1') {
          that.setData({
            index: index,
            progress_data: arr
          })
        }
      },
      function fail(err) {
        console.log(err)
      })
    this.setData({
      mask: true
    })
  },

  confirm: function () {
    this.setData({
      mask: false
    })
  },

  navClick: function (e) {
    let that = this
    let index = e.currentTarget.id.replace('nav_', '')
    if (that.data.check_index == index) return
    that.setData({
      check_index: index,
      goods_list: [], // 商品列表
      record_data: [], // 购买记录
      page: 1,
      is_length: true
    })
    this.search()
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