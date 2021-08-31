//用来引用发送请求的方法
import { request } from '../../request/index.js'
Page({
    data: {
        //轮播图数组
        swiperList: [],
        cateLIst: [],
        floorList: []
    },
    //页面开始加载就会触发
    onLoad(options) {
        //1.发送异步请求来获取轮播图数据
        // wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //     success: (result) => {
        //         this.setData({
        //             swiperList: result.data.message
        //         })
        //     },
        // });
        this.getSwiperList()
        this.getCateList()
        this.getFloorList()
    },
    //获取轮播图数据
    getSwiperList() {
        request({
            url: '/home/swiperdata'
        }).then(result => {
            result.filter(item => {
                item.navigator_url = item.navigator_url.replace('main', 'index')
            })
            this.setData({
                swiperList: result,
            })

        })
    },
    // 获取导航栏数据
    getCateList() {
        request({
            url: "/home/catitems"
        }).then(result => {
            this.setData({
                cateLIst: result
            })
        })
    },
    //获取楼层数据
    getFloorList() {
        request({
            url: "/home/floordata"
        }).then(result => {
            //console.log(result);
            this.setData({
                floorList: result
            })
        })
    },
})