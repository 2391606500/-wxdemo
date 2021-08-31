// pages/goods_list/index.js
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                value: "综合",
                isActive: true
            },
            {
                id: 1,
                value: "销量",
                isActive: false
            },
            {
                id: 2,
                value: "价格",
                isActive: false
            },
        ],
        goodsList: []
    },
    QueryParams: {
        query: '',
        cid: '',
        pagenum: 1,
        pagesize: 10
    },
    totalPage: 1,
    handleTabsItemChange(e) {
        //console.log(e);
        const { index } = e.detail;
        //console.log(index);
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
        this.setData({
            tabs
        })
    },
    onReachBottom() {
        //console.log(1);
        if (this.QueryParams.pagenum >= this.totalPage) {
            //console.log('没有下一页数据了');
            wx.showToast({
                title: '没有下一页数据了'
            })
        } else {
            //console.log('还有下一页数据');
            this.QueryParams.pagenum++;
            this.getGoodsList()
        }
    },
    //生命周期函数
    onPullDownRefresh() {
        //console.log(1);
        this.setData({
            goodsList: []
        })
        this.QueryParams.pagenum = 1
        this.getGoodsList()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.QueryParams.cid = options.cid || '';
        this.QueryParams.query = options.query || '';
        this.getGoodsList()
    },
    async getGoodsList() {
        const res = await request({
                url: "/goods/search",
                data: this.QueryParams
            })
            //获取总条数
        const total = res.total;
        //计算总页数
        this.totalPage = Math.ceil(total / this.QueryParams.pagesize)
            //console.log(this.totalPage);
            //console.log(res.goods);
        this.setData({
                goodsList: [...this.data.goodsList, ...res.goods]
            })
            //关闭下拉刷新的窗口
        wx.stopPullDownRefresh()
    }

})