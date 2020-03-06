// communitys/sc/sc.js
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;//查询指令
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        spList:[]
    },
    getList(){
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        var _this = this;
        db.collection('db_sc_list').where({
            
        }).get({
            success: function (res) {
                // 输出 [{ "title": "The Catcher in the Rye", ... }]
                if(res.errMsg == 'collection.get:ok'){
                    let data = res.data;
                    _this.setData({
                        spList:data
                    })
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getList()
    },
})