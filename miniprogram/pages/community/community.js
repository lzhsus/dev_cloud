// pages/community/community.js
const db = wx.cloud.database();
const _ = db.command;//查询指令
Page({

    /**
     * 页面的初始数据
     */
    data: {
        apiStatic:{}
    },
    lookKD(){
        wx.navigateTo({
          url: '/communitys/kd/kd',
        })
    },
    lookSC(){
		wx.navigateTo({
			url: '/communitys/sc/sc',
		})
    },
    lookSH(){
        wx.navigateTo({
            url: '/communitys/sh/sh',
        })
    },
    getApiStatic() {
        var _this = this;
        db.collection('db_static').where({

        }).get({
            success: function (res) {
                if (res.errMsg == 'collection.get:ok') {
                    let data = res.data;
                    const dataObj = data[0];
                    console.log(dataObj)
                    _this.setData({
                        apiStatic: dataObj
                    })
                } else {

                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getApiStatic()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    onShareAppMessage: function () {
        // return custom share data when user share.
        return {
            title: '记录生活，记录健康！',
            path: '/pages/home/home',
            imageUrl: "https://6465-demo-yk46q-1301447037.tcb.qcloud.la/share.png?sign=aff80ed3ed8465be8ece88121fed266a&t=1583472468",
            success: (res)=> {
              // 转发成功
            },
            fail: (res)=> {
              // 转发失败
            }
          }
    },
   
})