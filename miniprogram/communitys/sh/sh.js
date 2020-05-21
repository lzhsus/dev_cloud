// communitys/sh/sh.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
import {
    setImgLink,
    uploadFiles
} from '../../services/uploadFile.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        images:[],
        imagesList:[]
    },
    getImg(type) {
        var _this = this;
        console.log(_this.data.userInfo)
        var imagesList = this.data.imagesList;
        db.collection('comments').get().then(res => {
            res.data.forEach(obj=>{
                imagesList.push({
                    fileID:obj.fileIDs[0]
                })
            })
            
            _this.setData({
                imagesList: imagesList
            })
        })

        if (type) {
            db.collection('db_user_images').where({
                openid: _this.data.userInfo.openId
            }).get().then(res => {
                _this.setData({
                    imagesList: imagesList.concat(res.data)
                })
            })
        } else {
            db.collection('db_user_images').get().then(res => {
                console.log(res.data)
                _this.setData({
                    imagesList: res.data
                })
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getImg()
    },

    // 选择图片
    chooseImage(e) {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                var images = this.data.images.concat(res.tempFilePaths)
                images = images.length <= 9 ? images : images.slice(0, 9);
                this.setData({
                    images: images
                })
            }
        })
    },
    // 删除
    closeImg(e){
        var index = e.currentTarget.dataset.index;
        var images = this.data.images;
            images.splice(index, 1);
            this.setData({
                images: images
            })
    },
    submitBtn(){
        var _this =this;
        wx.showModal({
            content: '确认上传图片?',
            success(res) {
                if (res.confirm) {
                    _this.submitForm()
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 提交图片
    async submitForm(e) {
        var that = this;
        wx.showLoading({
            title: '上传中...',
        })
        // 上传资源(图片，文件名称)
        var images = await uploadFiles(this.data.images, 'sh_img')
        // var images = await uploadFile(this.data.images, 'test')
        console.log('images', images)
        // 记录数据
        var res = await setImgLink(images);
        console.log('res', res)
        wx.hideLoading()
        if (res.errMsg == "cloud.callFunction:ok") {
            that.setData({
                images:[]
            })
            that.getImg()
            wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
            })
        } else {
            wx.showModal({
                content: res.errMsg,
                showCancel: false
            })
        }
    },
    lookImg(e) {
        var item = e.currentTarget.dataset.item;
        console.log(item)
        wx.previewImage({
            current: item.fileID, // 当前显示图片的http链接
            urls: [item.fileID] // 需要预览的图片http链接列表
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
    onShow: function () {

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