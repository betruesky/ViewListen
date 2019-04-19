// pages/prize/prize.js
import formatUrl from '../../utils/api.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picpath:"",
    userInfo: {},
    dataList:[],
    rankList:[],
    ifShowSelf:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.LoadData();
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
  LoadData : function(){
    const union_id = wx.getStorageSync('union_id');
    const _this=this;
    wx.request({
      url: formatUrl(`yourprize`),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        union_id
      },
      success(res) {
        let resu=res.data;
        if(parseInt(resu.status)===1){
          console.log(resu.data);
          let ranks = resu.rank;
          ranks.length=50;
          _this.setData({
            dataList: resu.data,
            rankList:ranks,
            picpath: resu.picpath
          });
        }else{
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
  ChangeNav1:function(){
    this.setData({
      ifShowSelf:true
    });
  },
  ChangeNav2: function () {
    this.setData({
      ifShowSelf: false
    });
  }
})