// promise 形式 showModal
export const showModal = ({ content }) => {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: '提示',
                content,
                success: res => {
                    resolve(res);
                },
                fail: err => {
                    reject(err)
                }
            })
        })
    }
    // promise 形式 showToast
export const showToast = ({ title }) => {
        return new Promise((resolve, reject) => {
            wx.showToast({
                title,
                icon: 'none',
                success: res => {
                    resolve(res);
                },
                fail: err => {
                    reject(err)
                }
            })
        })
    }
    // promise 形式 wx.login微信登录
export const login = () => {
        return new Promise((resolve, reject) => {
            wx.login({
                success: function(res) {
                    resolve(res)
                },
                fail: function(err) {
                    reject(err)
                }
            })
        })
    }
    // promise 形式 requestPayment微信支付
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: function(res) {
                resolve(res)
            },
            fail: function(err) {
                reject(err)
            }
        })
    })
}