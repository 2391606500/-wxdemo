// pages/feedback/index.js
import { showToast } from '../../utils/asyncWx'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                value: "体验问题",
                isActive: true
            },
            {
                id: 1,
                value: "商品、商家投诉",
                isActive: false
            },
        ],
        // 被选中的图片路径
        imageList: [],
        //文本域类容
        textValue: ''
    },
    // 外网图片路径数组
    UploadImageList: [],
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
    //点击加号选择图片事件
    handlebutton() {
        // 调用小程序内置的选择图片api
        wx.chooseImage({
            count: 9, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: (res) => {

                this.setData({
                    // 图片数组进行拼接
                    imageList: [...this.data.imageList, ...res.tempFilePaths]
                })
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    // 点击自定义图片组件删除操作
    handleImageRemove(e) {
        // 获取被点击的组件的索引
        const { index } = e.currentTarget.dataset;
        // 获取data中的图片数组
        let { imageList } = this.data;
        // 删除元素
        imageList.splice(index, 1);
        // 重新填充到data中
        this.setData({
            imageList
        })
    },
    //文本域的输入事件
    handleTextInput(e) {
        this.setData({
            textValue: e.detail.value
        })
    },
    // 提交按钮点击事件
    handleFormInput() {
        // 获取文本域内容
        const { textValue, imageList } = this.data;

        //合法域验证
        if (!textValue.trim()) {
            // 不合法
            showToast({ title: "您输入的不合法" })
            return

        }
        // 准备上传图片到专门的图片服务器
        wx.showLoading({
            title: '正在上传中',
            mask: true,
        });
        if (imageList.length != 0) {
            imageList.forEach((v, i) => {
                wx.uploadFile({
                    url: 'https://img.coolcr.cn/api/upload',
                    filePath: v,
                    name: 'image',
                    success: res => {
                        //console.log(res);
                        let url = JSON.parse(res.data)
                        this.UploadImageList.push(url)
                            //所有图片都上传完毕才触发
                        if (i === imageList.length - 1) {
                            wx.hideLoading();
                            this.setData({
                                    textValue: '',
                                    imageList: []
                                })
                                // 返回上一个页面
                            showToast({ title: '反馈成功' })
                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 800)
                        }
                    }
                })
            })
        } else {
            showToast({ title: '反馈成功' })
            wx.hideLoading();
            setTimeout(() => {
                wx.navigateBack({
                    delta: 1
                })
            }, 500)

        }

    }
})