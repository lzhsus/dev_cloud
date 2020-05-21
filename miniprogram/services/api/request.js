import appConfig from "../../common/app_config.js";

var loginPromis;
export default async function request(name,url, params={},isShowLoading=true) {
    if(isShowLoading) {
        console.log('isShowLoading')
        wx.showLoading({
            title:'加载中',
            mask:true
        });
    }
    let data={
        name: name,
        data: {
            $url: url,
            data: params,
        }
    }
    let userInfo=wx.getStorageSync('userInfo');
    if(!userInfo){
        if(!loginPromis){        
            loginPromis=login('login');
        }
        userInfo=await loginPromis;
    }
    // 检查是否过期
    let header={
        'authorization':'Bearer '+userInfo.token,
        'appid':appConfig.appid
    }
    data.data.header = header

    let res;
    try{
        res=await wx.cloud.callFunction(data)
    }catch(e){
        //console.log("系统忙，请重试！",e)
        wx.showModal({
            title: '',
            content: '网络错误，请重试！',
            showCancel:false,
        })
        if(isShowLoading) {
            wx.hideLoading()
        }
    }
    if(isShowLoading) {
        wx.hideLoading()
    }
    
    res=res.result;

    if( typeof res!=='object' ){
        return {
            msg: '网络错误！'
        }
    }
    
    return res;
}
async function login(url, params, method, isShowError){
    let data = {
        name:url
    }
    let res=await wx.cloud.callFunction(data)
    try {
        wx.setStorageSync('userInfo', res.result);
    } catch (e) {    

    }
    return res.result;
}
function checkSession(){
    return new Promise(function(resolve, reject) {
        wx.checkSession({
            success: ()=>{
                resolve(0)    
            },
            fail: (res)=>{
                console.log(res)
                login('login').then(()=>{
                    resolve(1);
                });
            }
        })
    })
}