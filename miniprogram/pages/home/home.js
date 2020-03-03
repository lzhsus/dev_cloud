// pages/home/home.js
const db = wx.cloud.database();
const _ = db.command;//查询指令
Page({

    /**
     * 页面的初始数据
     */
    data: {
        radioIndex: 2,
        date_time: "",
        starg: "未知期",
        start: "2019-01-01",
        end: "",
        msgList:[],
        periodobj:{},
        userInfo:{},
        endTime:''
    },
    // 页面方法
    changeRadio() {
        var _this =this;
        if(_this.data.radioIndex==2){
            return
        }
        console.log(_this.data.periodobj._id)
        wx.showModal({
            title: '提示',
            content: '确认自行终止此次经期记录!',
            success (res) {
                if (res.confirm) {
                    db.collection('db_period_list').where({
                        _id: _this.data.periodobj._id
                    }).update({
                        // data 传入需要局部更新的数据
                        data: {
                            // 表示将 done 字段置为 true
                            period_reality_continue_long: _this.data.periodobj.new_time
                        },
                        success: function(res) {
                            var periodobj=_this.data.periodobj
                            periodobj['period_reality_continue_long']=_this.data.periodobj.new_time
                            _this.setData({
                                radioIndex: 2,
                                periodobj:periodobj
                            })
                        },
                        fail:err=>{
                            wx.showModal({
                                content: err,
                                showCancel: false
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    bindTimeChange(e) {
        var data_info={
            period_time:e.detail.value,
            openid:this.data.userInfo.openid,
            period_continue_long:this.data.periodobj.period_continue_long||2,
            period_month_long:this.data.periodobj.period_month_long||15
        }
        // return
        var _this =this;
        db.collection('db_period_list').add({
            // data 字段表示需新增的 JSON 数据
            data: data_info,
            success: function(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                wx.showToast({
                    title: '设置成功！',
                    icon: 'success',
                    duration: 2000
                })
                
                data_info.new_time = _this.getTime2Time(_this.getTime(),e.detail.value)+1
                _this.setData({
                    radioIndex: 1,
                    periodobj:data_info,
                    date_time: e.detail.value,
                    endTime:_this.dayTime(data_info.period_continue_long,e.detail.value)
                })
                _this.getPeriodList();
            },
            fail:err=>{
                wx.showModal({ 
                    content: err,
                    showCancel: false
                })
            }
        })
    },
    goMy(){
        wx.switchTab({
            url:"/pages/my/my"
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    getList() {
        var _this = this;
        db.collection('db_demo').where({
            
        }).get({
            success: function (res) {
                // 输出 [{ "title": "The Catcher in the Rye", ... }]
                if(res.errMsg == 'collection.get:ok'){
                    let data = res.data;
                    _this.setData({
                        msgList:data
                    })
                }else{
                    wx.showModal({
                        content: res.errMsg, 
                        showCancel: false
                    })
                }
            }
        })
    },
    dayTime(day,oldTime){
        var date1 = new Date(oldTime);
        var date2 = new Date(oldTime);
		date2.setDate(date1.getDate()+day);
		var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
        return time2;
    },
    getTime2Time($time1, $time2){
        var time1 = arguments[0], time2 = arguments[1];
        time1 = Date.parse(time1)/1000;
        time2 = Date.parse(time2)/1000;
        var time_ = time1 - time2;
        return (time_/(3600*24));
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
                        const dataObj = data[data.length-1]
                        // 当前时间
                        dataObj.new_time = _this.getTime2Time(_this.getTime(),dataObj.period_time)+1
                        // period_time
                        // period_long
                        console.log('dataObj',dataObj)
                        var radioIndex=1
                        if(dataObj.period_reality_continue_long||dataObj.new_time>dataObj.period_continue_long){
                            radioIndex=2
                        }
                        _this.setData({
                            periodobj:dataObj,
                            radioIndex:radioIndex,
                            endTime:_this.dayTime(dataObj.period_continue_long,dataObj.period_time)
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    getTime: function (date) {
        date = date || new Date();
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        var formatNumber = n => {
            n = n.toString()
            return n[1] ? n : '0' + n
        }
        return [year, month, day].map(formatNumber).join('-')

    },
    onShow: function () {
        
        let userInfo=wx.getStorageSync('userInfo');
        this.setData({
            userInfo:userInfo
        })
        const end = this.getTime()
        this.setData({
            end: end
        })
        this.getList();
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