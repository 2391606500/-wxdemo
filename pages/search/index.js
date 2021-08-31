// pages/search/index.js
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        //取消按钮是否显示
        isFocus: false,
        //输入框的值
        inputValue: ""
    },
    TimeId: -1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    //输入框值改变了就会触发的事件
    handleInput(e) {
        //console.log(e);
        //获取输入框的值
        const { value } = e.detail;
        //检测合法性
        if (!value.trim()) {
            //值不合法
            clearTimeout(this.TimeId);
            this.setData({
                goods: [],
                isFocus: false
            })
            return
        }
        //准备发送请求获取数据
        this.setData({
            isFocus: true
        })
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.qsearch(value)
        }, 300)

    },
    //点击取消按钮后 触发事件
    handleCancel() {
        this.setData({
            inputValue: "",
            isFocus: false,
            goods: []
        })
    },
    // 发送请求获取搜索建议 数据
    async qsearch(query) {
        const res = await request({
                url: "/goods/qsearch",
                data: {
                    query
                }
            })
            // console.log(res);
        this.setData({
            goods: res
        })
    }
})