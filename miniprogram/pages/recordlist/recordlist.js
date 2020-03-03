// pages/recordlist/recordlist.js
const db = wx.cloud.database();
const _ = db.command;//查询指令
Page({

    /**
     * 页面的初始数据
     */
    data: {
        periodlist:[],
        userInfo:{}
    },
    
    dayTime(day,oldTime){
        var date1 = new Date(oldTime);
        var date2 = new Date(oldTime);
		date2.setDate(date1.getDate()+day);
		var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
        return time2;
    },
    getPeriodList() {
        var _this = this;
        db.collection('db_period_list').where({
            openid: _this.data.userInfo.openid
        }).get({
            success: function (res) {
                // 输出 [{ "title": "The Catcher in the Rye", ... }]
                if(res.errMsg == 'collection.get:ok'){
                    let data = res.data;
                    if(data.length){
                        console.log(data)
                        data.forEach(element => {
                            if(element.period_reality_continue_long){
                                element.period_reality_end = _this.dayTime(element.period_reality_continue_long,element.period_time)
                            }
                            element.period_end =_this.dayTime(element.period_continue_long,element.period_time)
                        });
                        _this.setData({
                            periodlist:data,
                        }) 
                    }
                }else{
                    wx.showModal({
                        content: res.errMsg, 
                        showCancel: false
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        let userInfo=wx.getStorageSync('userInfo');
        this.setData({
            userInfo:userInfo
        })
        this.getPeriodList()
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