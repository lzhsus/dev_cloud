const app = getApp()

let uploadFile = async (imgList, dir) => {
    console.log(imgList, dir)
    let promiseAll = [];
    return new Promise(async function (resolve, reject) {
        for (let index = 0; index < imgList.length; index++) {
            let item = imgList[index];
            var url = await wxUploadFile(item,dir).catch(error => {
                wx.showModal({
                    content: '资源上传失败，请重新上传！',
                    showCancel: false
                })
                reject(error)
                wx.hideLoading()
            })
            promiseAll.push(url)
        }
        resolve(promiseAll)
    })
}
let wxUploadFile = (file, dir) => {
    return new Promise(function (resolve, reject) {
        wx.getFileSystemManager().readFile({
            filePath: file, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
                wx.cloud.callFunction({
                    name: 'uploadFile',
                    data: {
                        path: (dir || 'share_img') +'/' + app.common.createImgName(dir, 'png'),
                        file: res.data
                    },
                    success(_res) { 
                        resolve(_res)
                    }, fail(_res) {
                        console.log((dir || 'share_img') + '/' + app.common.createImgName(dir, 'png'))
                        console.log(res.data)
                        reject(_res)
                    }
                })
            }
        })
    })
}
let setImgLink =async (list)=>{
    return new Promise(function (resolve, reject) {
        let promiseAll = [];
        list.forEach((obj, index) => {
            promiseAll.push(wx.cloud.callFunction({
                name: 'add',
                data: {
                    fileID: list[index].fileID,
                    statusCode: list[index].statusCode,
                    create_time: app.common.getNewTime()
                }
            }))
        })
        Promise.all(promiseAll).then((fileURL) => {
            var success = true;
            var item = fileURL[0]
            fileURL.forEach(res=>{
                if (res.errMsg!="cloud.callFunction:ok"){
                    success = false;
                    item = res
                }
            })
            resolve(item)
        }).catch(error => {
            console.log('error', error)
            wx.showModal({
                content: '资源上传失败，请重新上传！',
                showCancel: false
            })
            reject(error)
            wx.hideLoading()
        })
        
    })
}
let uploadFiles = async function (filePath,dir) {
    const cloudPath = [];
    filePath.forEach((item, i) => {
        cloudPath.push((dir || 'share_img') + '/' + app.common.createImgName(dir, 'png'))
    })

    let promiseAll = [];
    return new Promise(async function (resolve, reject) {
        for (let index = 0; index < filePath.length; index++) {
            var file = await wxUploadFile2(cloudPath[index], filePath[index]).catch(error => {
                    wx.showModal({
                        content: '资源上传失败，请重新上传！',
                        showCancel: false
                    })
                    reject(error)
                    wx.hideLoading()
                })
            promiseAll.push(file)
        }
        resolve(promiseAll)
    })
}
let wxUploadFile2 = (cloudPath, filePath) => {
    return new Promise(function (resolve, reject) {
        wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: filePath,
            success: res => {
                resolve(res)
            },
            fail: e => {
                reject(e)
            },
            complete: () => {

            }
        })
    })
}
export {
    uploadFiles, setImgLink

}