// pages/introduce/introduce.js
import formatUrl from '../../utils/api.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:"",
    showTab:1,
    data:[ ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this=this;
    wx.request({
      url: formatUrl(`introduce`),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {},
      success(res) {
        let resu = res.data;
        if (parseInt(resu.status) === 1) {
          _this.setData({
            src: resu.picpath,
            data:resu.data
          });
        } else {
          wx.showToast({
            title: resu.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail() {
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  ChoseTabO:function(){
    this.setData({
      showTab:1
    });
  },
  ChoseTabT:function(){
    this.setData({
      showTab: 2
    });
  },
  

})