// 同时发布异步代码的次数
let ajaxTimes = 0;
export const request = (params) => {
    //判断url是否带有/my/请求的是私有的路径 带上header token
    let header = {...params.header };
    if (params.url.includes('/my/')) {
        //拼接header 带上token
        header["Authorization"] = wx.getStorageSync('token')
    }
    ajaxTimes++
    //显示加载中效果
    wx.showLoading({
            title: '加载中',
            mask: true
        })
        // 定义公共url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            //不管成功还是失败都会触发的消息
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading()
                }
            }
        })
    })
}