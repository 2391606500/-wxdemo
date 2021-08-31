// pages/goods_detail/index.js
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        //商品是否被收藏过
        isCollect: false
    },
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function() {
        let Pages = getCurrentPages();
        let currentPages = Pages[Pages.length - 1]
        let options = currentPages.options
            //console.log(options);
        const { goods_id } = options;
        //console.log(goods_id);
        this.getGoodsDetail(goods_id)
    },
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } })
        this.GoodsInfo = goodsObj
            //console.log(this.GoodsInfo);
            //console.log(res);
            //获取缓存在商品收藏的数组
        let collect = wx.getStorageSync('collect') || [];
        //判断当前商品是否被收藏了
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics,

            },
            isCollect
        })
    },
    //点击轮播图放大预览
    handletapswiper(e) {
        // console.log('预览');
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
        //console.log(e);
        const current = e.currentTarget.dataset.url
            //接受传递过来的图片url
        wx.previewImage({
            current, // 当前显示图片的http链接
            urls // 需要预览的图片http链接列表
        })
    },
    //点击加入购物车功能
    handleCartIn() {
        //console.log('成功');
        //获取缓存中的购物车 数组
        let cart = wx.getStorageSync('cart') || []
            //判断商品对象是否存在于购物车内
            //findIndex如果为真返回的是索引值
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        if (index === -1) {
            //不存在 第一次添加
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo)
        } else {
            //已经存在
            //this.GoodsInfo.num++
            //console.log(index);
            cart[index].num++
        }
        //把购物车重新添加回缓存中
        wx.setStorageSync('cart', cart)
            //弹窗提示
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            //防止用户手抖 疯狂点击
            mask: true,
        })


    },
    // 点击 商品收藏图标
    handleiconchange() {
        let isCollect = false;
        // 1 获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect") || [];
        // 2 判断该商品是否被收藏过
        let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        // 3 当index！=-1表示 已经收藏过 
        if (index !== -1) {
            // 能找到 已经收藏过了  在数组中删除该商品
            collect.splice(index, 1);
            isCollect = false;
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true
            });

        } else {
            // 没有收藏过
            collect.push(this.GoodsInfo);
            isCollect = true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true
            });
        }
        // 4 把数组存入到缓存中
        wx.setStorageSync("collect", collect);
        // 5 修改data中的属性  isCollect
        this.setData({
            isCollect
        })


    }
})