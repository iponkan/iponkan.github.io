const baseLink = window.location.href.replace(/%26/g, '&')
const myPic = 'https://uss.sonicers.com/blog/logo.png'
const myTitle = document.querySelector("meta[property='og:title']").getAttribute("content")
const myDesc = document.querySelector("meta[property='og:description']").getAttribute("content")
console.log("myTitle:" + myTitle)
console.log("baseLink:" + baseLink)

//自定义微信分享
window.shareData = {
    url: baseLink,
    picUrl: myPic,
    title: myTitle,
    desc: myDesc,
    timelineTitle: myTitle,

    callback: function (type) {//分享成功回调，可以在这里做统计
        console.log("分享成功==========", type)
    }
}

function refreshShareData() {
    axios.get('https://api.sonicers.com/release/get_signature_temp', {
        params: {
            reqUrl: window.location.href
        }
    }).then((res) => {
        let data = res.data
        console.log("data==========", data)
        wx.config({
            debug: false, // 开启调试模式
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
                'updateTimelineShareData',
                'updateAppMessageShareData',
                'onMenuShareWeibo'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
    }).catch((error) => {
        console.log(error)
    })
    wx.ready(function () {

        wx.updateTimelineShareData({//朋友圈和QQ空间
            title: window.shareData.timelineTitle,
            link: window.shareData.url,// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: window.shareData.picUrl,
            success: function () {
                window.shareData.callback("sharetimeline")
            }
        })

        wx.updateAppMessageShareData({//QQ和微信
            title: window.shareData.title,
            desc: window.shareData.desc,
            link: window.shareData.url,
            imgUrl: window.shareData.picUrl,
            success: function () {
                window.shareData.callback("shareappmessage")
            }
        })

        wx.onMenuShareWeibo({//微博
            title: window.shareData.title,
            desc: window.shareData.desc,
            link: window.shareData.url,
            imgUrl: window.shareData.picUrl,
            success: function () {
                window.shareData.callback("shareweibo")
            }
        })
    })

}

const isWeixin = function () { //判断是否是微信
    const ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == "micromessenger";
};

if(isWeixin){
    refreshShareData()
}
