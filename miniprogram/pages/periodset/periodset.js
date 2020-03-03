// pages/periodset/periodset.js
const db = wx.cloud.database();
const _ = db.command;//查询指令
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        periodObj:{},
        perido_index:0,
        periodArr:[],
        perido_index1:0,
        periodArr1:[]
    },
    hintBtn(){
        wx.showModal({
            content: '请先去主页添加经期时间！', 
            showCancel: false,
            success (res) {
                wx.switchTab({
                    url:'/pages/home/home'
                })
            }
        })
    },
    bindPickerChange(e){
        var _this =this;
        const value = e.detail.value
        db.collection('db_period_list').where({
            _id: _this.data.periodObj._id
          }).update({
            // data 传入需要局部更新的数据
            data: {
                // 表示将 done 字段置为 true
                period_continue_long: _this.data.periodArr[value].day
            },
            success: function(res) {
                _this.setData({
                    perido_index:value
                })
                wx.showToast({
                    title: '设置成功！',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail:err=>{
                wx.showModal({
                    content: err,
                    showCancel: false
                })
            }
        })
    },
    bindPickerChange1(e){
        var _this =this;
        const value = e.detail.value
        db.collection('db_period_list').where({
            _id: _this.data.periodObj._id
          }).update({
            // data 传入需要局部更新的数据
            data: {
                // 表示将 done 字段置为 true
                period_month_long: _this.data.periodArr1[value].day
            },
            success: function(res) {
                _this.setData({
                    perido_index1:value
                })
                wx.showToast({
                    title: '设置成功！',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail:err=>{
                wx.showModal({
                    content: err,
                    showCancel: false
                })
            }
        })
    },
    initData(){
        var arr1=[]
        for(let i=2;i<13;i++){
            arr1.push({
                day:i
            })
        }
        var arr2=[]
        for(let i=15;i<101;i++){
            arr2.push({
                day:i
            })
        }
        this.setData({
            periodArr:arr1,
            periodArr1:arr2
        })
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
                        const dataObj = data[data.length-1];
                        var perido_index=0,perido_index1=0;

                        _this.data.periodArr.forEach((e,i) => {
                            if(e.day == dataObj.period_continue_long){
                                perido_index = i
                            }
                        });
                        _this.data.periodArr1.forEach((e,i) => {
                            if(e.day == dataObj.period_month_long){
                                perido_index1 = i
                            }
                        });

                        _this.setData({
                            periodObj:dataObj,
                            perido_index:perido_index,
                            perido_index1:perido_index1
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
        this.initData()
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