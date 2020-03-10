// pages/detail/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailObj:{}
    },
    getDateil(docid){
        var _this = this;
        wx.request({
            url: 'https://v1.alapi.cn/api/new/detail?docid=' + docid,
            success(res) {
                res = res.data
                if (res.msg == 'success') {
                    console.log(res.data[docid])
                    var detailObj = res.data[docid]
                    detailObj.body = detailObj.body.replace(/<p>/g, "")
                    detailObj.body = detailObj.body.replace(/<\/p>/g, "\n")
                    detailObj.body = detailObj.body.replace(/<\/?.+?>/g, "");
                    detailObj.body = detailObj.body.replace(/ /g, "")

                    if (detailObj.spinfo&&detailObj.spinfo.length){
                        console.log('------------')
                        detailObj.spinfo.forEach(obj => {
                            console.log('----**************')
                            console.log(obj)
                        })
                        detailObj.spinfo.forEach(obj=>{
                            var tit = obj.spcontent;
                            console.log(tit)
                            tit = tit.replace(/<p>/g, "")
                            tit = tit.replace(/<\/p>/g, "\n")
                            tit = tit.replace(/<\/?.+?>/g, "");
                            tit = tit.replace(/ /g, "")
                            obj.spcontent = tit;
                        })
                    }
                    console.log(detailObj.spinfo)
                    _this.setData({
                        detailObj: detailObj
                    })
                } else {
                    wx.showModal({
                        content: res.msg,
                        showCancel: false
                    })
                }
                console.log(res)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const docid = options.docid;
        this.getDateil(docid)
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