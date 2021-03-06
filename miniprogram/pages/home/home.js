// pages/home/home.js
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;//查询指令
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        radioIndex: 2,
        date_time: "",
        starg: "未知期",
        start: "2019-01-01",
        end: "",
        msgList:[],
        periodobj:{},
        userInfo:{},
        endTime:'',
        msgList2L:[],
        msgList2:[],
        module:1,
        page:1,
        lastPage:false
    },
    // 页面方法
    changeRadio() {
        var _this =this;
        if(_this.data.radioIndex==2){
            return
        }
        console.log(_this.data.periodobj._id);
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
                            period_reality_continue_long: _this.data.periodobj.new_time,
                            updata_time:app.common.getNewTime()
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
            period_month_long:this.data.periodobj.period_month_long||15,
            create_time:app.common.getNewTime()
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
                
                data_info.new_time = app.common.getTimeToTimeDay(app.common.getTime(),e.detail.value)+1
                _this.setData({
                    radioIndex: 1,
                    periodobj:data_info,
                    date_time: e.detail.value,
                    endTime:app.common.getDayEndTime(data_info.period_continue_long,e.detail.value)
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
    getWenzhuang(){
        var _this =this;
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        wx.request({
            url: 'https://v1.alapi.cn/api/new/toutiao?start=' + _this.data.page,
            success(res){
                res = res.data
                if(res.msg == 'success'){
                    var msgList2 = _this.data.msgList2||[];
                    var page = _this.data.page
                    if (page <= 1) {
                        msgList2 = []
                    }
                    if (app.stopPullDownRefresh) {
                        wx.stopPullDownRefresh()
                        app.stopPullDownRefresh = false
                    } 
                    if(page>1){
                        for (const key in res.data) {
                            if (res.data.hasOwnProperty(key)) {
                                const element = res.data[key];
                                msgList2.push(element)
                            }
                        }
                    }else{
                        msgList2 = res.data;
                    }
                    page++

                    _this.setData({
                        msgList2: msgList2,
                        page: page
                    })
                }else{
                    wx.showModal({ 
                        content: res.msg,
                        showCancel: false
                    })
                }
                wx.hideLoading()
            }
        })
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
    getPeriodList() {
        wx.showLoading({
            title:'加载中',
            mask:true
        });
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
                        dataObj.new_time = app.common.getTimeToTimeDay(app.common.getTime(),dataObj.period_time)+1
                        dataObj.static_txt = decodeURIComponent(dataObj.static_txt)
                        dataObj.static_txt_c = dataObj.static_txt
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
                            endTime:app.common.getDayEndTime(dataObj.period_continue_long,dataObj.period_time)
                        }) 
                    }
                }else{
                    wx.showModal({
                        content: res.errMsg, 
                        showCancel: false
                    })
                }
                wx.hideLoading()
                _this.setData({
                    pageShow:true
                })
            }
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
                    if (dataObj.alapi == 1){
                        // _this.getWenzhuang()
                        _this.getList();
                    } else if (dataObj.alapi == 2){
                        _this.getWenzhuang()
                    }
                }else{

                }
            }
        })
    },
    goWbeViewPage(e){
        var item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/detail/detail?docid=' + item.docid,
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
        let userInfo=wx.getStorageSync('userInfo');
        this.setData({
            userInfo:userInfo,
            end:app.common.getTime()//可选择的最后时间
        })
        this.getPeriodList()
    },
    // 上拉监控
    onPullDownRefresh(){     
        this.setData({
            page:1,
            lastPage:false
        })       
        app.stopPullDownRefresh = true
        this.getWenzhuang()
    },
    // 到底监控
    onReachBottom(){
        if( this.data.lastPage ) return
        this.getWenzhuang()
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