// communitys/cb/cb.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    // 点击左下角小图标事件
    openSlider: function (e) {
        if (this.data.open) {
            this.setData({
                open: false
            }); 
        } else {
            this.setData({
                open: true
            });
        }
    },
    tap_start: function (e) {
        // touchstart事件
        // 把手指触摸屏幕的那一个点的 x 轴坐标赋值给 mark 和 newmark
        this.data.mark = this.data.newmark = e.touches[0].pageX;
    },
    tap_drag: function (e) {
        // touchmove事件
        this.data.newmark = e.touches[0].pageX;
        // 手指从左向右移动
        if (this.data.mark < this.data.newmark) {
            this.istoright = true;
        }
        // 手指从右向左移动
        if (this.data.mark > this.data.newmark) {
            this.istoright = false;
        }
        this.data.mark = this.data.newmark;
    },
    tap_end: function (e) {
        // touchend事件
        this.data.mark = 0;
        this.data.newmark = 0;
        // 通过改变 opne 的值，让主页加上滑动的样式
        if (this.istoright) {
            this.setData({
                open: true
            });
        } else {
            this.setData({
                open: false
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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