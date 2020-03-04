// pages/recordlist/recordlist.js
const app = getApp()
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
                                element.period_reality_end = app.common.getDayEndTime(element.period_reality_continue_long,element.period_time)
                            }
                            element.period_end =app.common.getDayEndTime(element.period_continue_long,element.period_time)
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
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let userInfo=wx.getStorageSync('userInfo');
        this.setData({
            userInfo:userInfo
        })
        this.getPeriodList()
    },
})