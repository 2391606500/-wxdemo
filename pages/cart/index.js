// pages/cart/index.js
import { showModal, showToast } from '../../utils/asyncWx'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        allchecked: false,
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
            //给data中的address赋值
            //计算全选
            //空数组调用every返回值依旧为true
        this.setCart(cart)
        this.setData({
            address
        })
    },
    //点击收获按钮
    handleChooseAddress() {
        //console.log('成功');
        //获取收获地址
        wx.chooseAddress({
            success: (result) => {
                result.all = result.provinceName + result.cityName + result.countyName + result.detailInfo
                wx.setStorageSync('address', result);

            },
        });

    },
    //商品的选中事件
    handlechange(e) {
        //获取被修改的事件源的id
        const goods_id = e.currentTarget.dataset.id;
        //获取购物车数组
        let { cart } = this.data;
        //找到被修改的商品对象
        let index = cart.findIndex(v => v.goods_id === goods_id)
            //选中状态取反
        cart[index].checked = !cart[index].checked
        this.setCart(cart)
    },
    //商品全选按钮
    handleallchange() {
        //获取Data中的数据
        let { cart, allchecked } = this.data;
        //2修改值
        allchecked = !allchecked;
        //循环修改cart数组中商品的选中状态
        cart.forEach(v => v.checked = allchecked);
        //修改后的值全部填充回data中和缓存中
        this.setCart(cart)
    },
    //商品数量编辑功能
    async handleCountchange(e) {
        const { operation, id } = e.currentTarget.dataset;
        //获取购物车数组
        let { cart } = this.data;
        //找到需要修改的商品索引
        const index = cart.findIndex(v => v.goods_id === id)
            //修改数量
            //判断是否要执行删除
        if (cart[index].num === 1 && operation === -1) {
            //弹窗提示
            const res = await showModal({ content: '您是否要删除？' })
                //此时res为此次弹窗的状态
            if (res.confirm) {
                cart.splice(index, 1);
                this.setCart(cart)
            }
        } else {
            cart[index].num += operation
                //修改后的值全部填充回data中和缓存中
            this.setCart(cart)
        }
    },
    //结算功能
    async handleToPay() {
        const { address, totalNum } = this.data;
        //判断用户有没有选择商品
        if (!totalNum) {
            await showToast({ title: "您还没有选购商品" })
            return;
        }
        // 判断收货地址
        if (!address.userName) {
            await showToast({ title: "您还没有选择收货地址" })
            return;
        }
        //跳转到支付页面
        wx.navigateTo({
            url: '/pages/pay/index',
        })
    },
    //设置购物车状态的同时 重新计算 底部工具栏的数据 全选 总价格 购买数量
    setCart(cart) {
        const allchecked = cart.length ? cart.every(v => v.checked) : false
        let totalPrice = 0;
        let totalNum = 0;
        let midCart = [];
        midCart = cart.filter(value => value.checked === true)
        totalPrice = midCart.reduce((preval, value) => preval + value.num * value.goods_price, 0)
        midCart.forEach(v =>
            totalNum += v.num)
        wx.setStorageSync('cart', cart);
        this.setData({
            cart,
            totalPrice,
            totalNum,
            allchecked
        })
    }
})