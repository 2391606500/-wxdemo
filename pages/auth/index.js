// pages/auth/index.js
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncWx"
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    // 获取用户信息
    async handlegetUserInfo(e) {
        //console.log(e);
        try {
            const { encryptedData, rawData, iv, signature } = e.detail;
            //获取小程序登录成功后的code
            const { code } = await login()
                //console.log(code);
            const loginParams = { encryptedData, rawData, iv, signature, code }
                //发送请求获取用户的token值
                // const res = await request({ url: "/users/wxlogin", data: loginParams, method: "post" })
                // console.log(res);
            wx.setStorageSync('token', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo")
            wx.navigateBack({
                delta: 1
            })

        } catch (error) {
            console.log(error);
        }
    }
})