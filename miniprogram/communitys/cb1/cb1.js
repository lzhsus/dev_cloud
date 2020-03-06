Page({
    data: {
        open: false,
        // mark 是指原点x轴坐标
        mark: 0,
        // newmark 是指移动的最新点的x轴坐标 
        newmark: 0,
        istoright: true
    },
    openBtn(){
        var a = this.data.open?false:true
        this.setData({
            open:a
        })
    }
})