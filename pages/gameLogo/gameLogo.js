// pages/gameLogo/gameLogo.js
Page({

    data: {
        url:''
    },
    onLoad: function (options) {
        console.log(options)
        this.setData({
            url:options.url
        })
    },

})
