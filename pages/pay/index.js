import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import { requestPayment, showToast } from '../../utils/asyncWx.js'

// pages/cart/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    //生命周期函数
    onShow() {
        //获取缓存中的收货地址
        const address = wx.getStorageSync("address");
        //获取缓存中的购物车数据
        const cart = wx.getStorageSync('cart') || []
            // 过滤后的购物车数组
        let checkedCart = cart.filter(v => v.checked)
            //给data中的address赋值
        this.setCart(checkedCart)
        this.setData({
            address
        })
    },
    //设置购物车状态的同时 重新计算 底部工具栏的数据 全选 总价格 购买数量
    setCart(cart) {
        let totalPrice = 0;
        let totalNum = 0;
        let midCart = [];
        midCart = cart.filter(value => value.checked)
        totalPrice = midCart.reduce((preval, value) => preval + value.num * value.goods_price, 0)
        midCart.forEach(v =>
            totalNum += v.num)
        this.setData({
            cart,
            totalPrice,
            totalNum,
        })
    },
    //点击支付
    async handlePay() {
        try {
            // 判断缓存中有没有token
            const token = wx.getStorageSync('token');
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index'
                });
                return;
            }
            //   创建订单
            //准备请求头参数
            // const header = { Authorization: token };
            //准备请求体参数
            const order_price = this.data.totalPrice;
            const consignee_addr = this.data.address.all;
            const cart = this.data.cart
            let goods = [];
            cart.forEach(v => goods.push({ goods_id: v.goods_id, goods_number: v.num, goods_price: v.goods_price }))
            const orderParams = { order_price, consignee_addr, goods }
                //准备发送请求 创建订单 获取订单编号
                // const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams, header })
            const order_number = "HMDD20190809000000001061"
                //  准备发起预支付接口
            const { pay } = await request({ url: "/my/orders/req_unifiedorder", methods: "POST", data: { order_number } })
                //console.log(pay);
                //发起微信支付
            await requestPayment(pay)
                //查询后台 订单状态
            const res = await request({ url: "/my/orders/chkOrder", methods: "POST", data: { order_number } })
                //console.log(res);
            await showToast({ title: "支付成功" })

        } catch (error) {
            //console.log(error);
            await showToast({ title: "支付失败" })
                //支付后手动删除缓存中已经存在的商品
            let newCart = wx.getStorageSync('cart');

            newCart = newCart.filter(v => !v.checked)
            console.log(newCart);
            wx.setStorageSync('cart', newCart)
                //支付成功后跳转到订单页面
            wx.navigateTo({
                url: '/pages/order/index'
            })
        }

    }
})