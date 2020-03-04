// communitys/kd/kd.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        kd_num:"",
        dataList:[]
    },
    bindinput(e){
        console.log(e)
        this.setData({
            kd_num:e.detail.value
        })
    },
    lookResult(){
        var _this=this;
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        wx.request({
            url: 'https://v1.alapi.cn/api/kd',
            data:{
                number:_this.data.kd_num
            },
            success(res){
                res = res.data
                if(res.msg == 'success'){
                    var result=res.data
                    const info = result.info;

                    console.log(info)
                    _this.setData({
                        dataList:info.reverse()
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
            url: 'https://v1.alapi.cn/api/kd',
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
})