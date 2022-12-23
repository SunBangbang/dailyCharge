function add(key_, value_, success) {
  wx.getStorage({
    key: key_,
    success(res) {
      console.log('有参数')
      console.log(res.data)
      var list = res.data
      list.push({
        msg: value_
      });
      wx.setStorage({
        key: "liuyan",
        data: list,
        success(res) {
          success(list);
        }
      })
    }
  })
}

function del(key_, index_, success) {
  wx.getStorage({
    key: key_,
    success(res) {
      var list = res.data
      list.splice(index_, 1);
      wx.setStorage({
        key: "liuyan",
        data: list,
        success(res) {
          success(list);
        }
      })
    }
  })
}

// 通用接口请求
function form_(url_, data = {}, form_ = null, success_, fail_, all) {
  let param = Object.assign(data, {version: '3.1.0',platform:'applet' });
  try{
    wx.request({
      url: "https://api.cd1a.cn/index.php/index27/" + url_ + "?form_id=" + form_, //接口地址
      data: param,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        success_(res)
      },
      fail: function (res) {
        fail_(res)
      }
    })
  }catch(e){
    console.log(e)
  }
}

// get请求
function get_(url_, data = {}, form_ = null, success_, fail_, all) {
  let param = Object.assign(data, {version: '3.1.0',platform:'applet' });
  try{
    wx.request({
      url: "https://api.cd1a.cn/index.php/index27/" + url_ + "?form_id=" + form_, //接口地址
      data: param,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        success_(res)
      },
      fail: function (res) {
        fail_(res)
      }
    })
  }catch(e){
    console.log(e)
  }
}

// 新增接口请求方法
function active(_url, param, success_, fail_) {
  wx.request({
    url: 'https://api.cd1a.cn/index.php/activity/' + _url,
    data: param,
    method: 'post',
    success: function(res) {
      success_(res)
    },
    fail: function(err) {
      fail_(err)
    }
  })
}

module.exports = {
  add,
  del,
  form_,
  get_,
  active
}