// pages/community/community.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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