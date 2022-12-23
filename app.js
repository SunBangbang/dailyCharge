require('./utils/overWrite')
App({
  globalData: {
    sysWidth: wx.getSystemInfoSync().windowWidth, //图片宽度
    socket_address: 'wss://api.cd1a.cn:8001/', //自己的服务器网址
    connect_limit: 0, //链接次数
    connect_max_limit: 100, //最大重新链接数
    connect_timeout: 3000, //链接超时时间3秒
    heart_time: 10000, //心跳间隔时间1秒
    heart_setInterval: null,
    callback: function () {},
  },

  onLaunch: function () {
    if(wx.getStorageSync('userid_locked')) {
      this.linkSocket()
    } else {
      this.time_ = setInterval(() => {
        if(wx.getStorageSync('userid_locked')) {
          clearInterval(this.time_)
          this.linkSocket()
        }
      }, 5000)
    }
  },

  //建立websocket连接
  linkSocket() {
    var that = this
    wx.connectSocket({
      url: that.globalData.socket_address + '?id=' + wx.getStorageSync('userid_locked'),
      timeout: that.globalData.connect_timeout,
      success() {
        that.initEventHandle() //连接成功绑定连接事件
      }
    })
  },

  //绑定事件
  initEventHandle() {
    var that = this

    wx.onSocketOpen(() => {
      console.log('WebSocket连接打开')
      that.heart_stop() //停止心跳定时任务
      that.heart_start() //开启新的定时任务
    })

    wx.onSocketMessage((res) => {
      console.log("接收到服务器的socket消息")
      console.log(res.data)
      if (this.strisJSON(res.data)) {
           that.globalData.callback(JSON.parse(res.data)) //执行回调信息
      }else{
        console.log("接受数据不是json格式");
      }
    })
    
    wx.onSocketError((res) => {
      console.log('WebSocket出行错误')
      console.log(res)
      that.heart_stop() //停止心跳定时任务
      that.reconnect() //发起重新连接
    })
    
    wx.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
      that.heart_stop() //停止心跳定时任务
      that.reconnect() //发起重新连接
    })
  },

  //重新连接
  reconnect() {
    var that = this;
    if (that.lockReconnect) return;
    that.lockReconnect = true;
    clearTimeout(that.timer)
    if (that.globalData.connect_limit < that.globalData.connect_max_limit) { //判断重新连接次数
      that.timer = setTimeout(() => {
        that.linkSocket();
        that.lockReconnect = false;
        console.log("重连次数:" + that.globalData.limit)
      }, 3000); //每隔5秒连接一次
      that.globalData.limit = that.globalData.limit + 1
    }
  },

  //心跳包开始  清除心跳计时任务
  heart_stop: function () {
    var that = this;
    console.log('清除心跳')
    clearInterval(that.globalData.heart_setInterval);
    return that;
  },

  heart_start: function () {
    var that = this;
    var randomNum = that.randomWord(false, 16); //生成随机码
    that.globalData.heart_setInterval = setInterval(() => {
      wx.sendSocketMessage({
        data: randomNum + "ping",
        success() {
          // console.log("发送ping成功");
        }
      });
    }, that.globalData.heart_time);
  },
  //心跳包结束

  //创建随机数，服务器用来存储是哪个小程序的心跳包的key，由于本案逻辑需要与其它信息存储的key分开，如果逻辑不需要，可以不进行分离，自定义存储的key
  randomWord: function (randomFlag, min, max) {
    var str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  },
  strisJSON: function (str) {
    if (typeof str == 'string') {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
})