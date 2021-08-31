import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //左侧菜单数据
        leftMenuList: [],
        //右侧商品数据
        rightContent: [],
        //被点击的左侧的菜单
        currentIndex: 0,
        //右侧内容的滚动条距离顶部的距离
        ScrollTop: 0
    },
    //接口返回数据
    cates: [],
    //左侧菜单点击事件
    handleTap(e) {
        const { index } = e.currentTarget.dataset;
        let rightContent = this.cates[index].children
        this.setData({
            currentIndex: index,
            rightContent,
            //重新设置 右侧内容的scroll-view标签的距离顶部的距离
            ScrollTop: 0
        })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        /* 
        0 web中的本地存储和 小程序中的本地存储的区别
          1 写代码的方式不一样了 
            web: localStorage.setItem("key","value") localStorage.getItem("key")
        小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
          2:存的时候 有没有做类型转换
            web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
          小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
        1 先判断一下本地存储中有没有旧的数据
          {time:Date.now(),data:[...]}
        2 没有旧数据 直接发送新请求 
        3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
         */

        //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
        const Cates = wx.getStorageSync('cates');
        // 2 判断
        if (!Cates) {
            // 不存在  发送请求获取数据
            this.getCates();
        } else {
            // 有旧的数据 定义过期时间  10s 改成 5分钟
            if (Date.now() - Cates.time > 1000) {
                // 重新发送请求
                this.getCates();
            } else {
                // 可以使用旧的数据
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v => v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }

    },

    //获取分类数据
    async getCates() {
        // request({
        //         url: '/categories'
        //     })
        //     .then(res => {
        //         this.cates = res.data.message
        //         wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
        //             //构造左边大菜单数据
        //         let leftMenuList = this.cates.map(v => v.cat_name)
        //         let rightContent = this.cates[0].children
        //         this.setData({
        //             leftMenuList,
        //             rightContent
        //         })
        //     })
        const res = await request({ url: '/categories' })
        this.cates = res
        wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
            //构造左边大菜单数据
        let leftMenuList = this.cates.map(v => v.cat_name)
        let rightContent = this.cates[0].children
        this.setData({
            leftMenuList,
            rightContent
        })
    }
})