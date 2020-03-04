// communitys/kd/kd.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyword:"",
        dataList:[]
    },
    bindinput(e){
        console.log(e)
        this.setData({
            keyword:e.detail.value
        })
    },
    lookResult(){
        var _this=this;
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        wx.request({
            url: 'https://v1.alapi.cn/api/music/search',
            data:{
                keyword:_this.data.keyword,
                type:1000
            },
            success(res){
                res = res.data
                if(res.msg == 'success'){
                    var result=res.data
                    const songs = result.songs;

                    console.log(info)
                    _this.setData({
                        dataList:songs
                    })
                }else{
                    wx.showModal({
                        content: res.code, 
                        showCancel: false
                    })
                }
                wx.hideLoading()
            },
            fail(err){
                wx.showModal({
                    content:err, 
                    showCancel: false
                })
            },
            complete(){
                wx.hideLoading()
            }
        })
    },
    getData(){
        wx.request({
            url: 'https://v1.alapi.cn/api/music/detail',
            data:{
                ids:440342015
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
})