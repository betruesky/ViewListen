import formatUrl from '../../utils/api.js'
const app = getApp()
Page({
  data: {
    rankData:[],
    rankDataLast:[],
    ifShowNewWeek:true
  },
  onLoad: function(res) {
    const _this=this;
  //  this.setData({
  //    myHtml:"hi world"
  //  })
    console.log(this.myHtml,"hi world");
    wx.showShareMenu({
      withShareTicket: true
    })
    const {
      shareTicket
    } = app.globalData
    wx.getShareInfo({
      shareTicket,
      success(res) {
        const {
          encryptedData,
          iv
        } = res;
        app.fetchKeys().then(
          ({
            unionid,
            session_key
          }) => {
            console.log('union_id: '+ unionid,
              '\nsession_key: '+ session_key,
              '\nshareTicket: ' +shareTicket,
              '\nencryptedData: ' +encryptedData,
              '\niv: ' +iv)
            wx.request({
              url: formatUrl(`shareMark`),
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                union_id: unionid,
                sessionkey:session_key,
                shareTicket,
                encryptedData,
                iv
              },
              success(res) {
                let resu=res.data;
                _this.setData({
                  rankData:res.data.data,
                  rankDataLast: res.data.lastdata
                });
                console.log(res)
              },
              fail(res) {
                console.log(res)
                wx.showToast({
                  title: '查看群排名失败',
                  icon: 'none',
                  duration: 2000
                })
              },
              complete(res){
                //console.log(res)
              }
            })
          }
        )
      }
    })
  },
  onShareAppMessage: function(ops) {
    const {
      userInfo
    } = app.globalData
    return {
      title: `${userInfo.nickName}邀请您挑战新琦迹小程序`,
      path: '/pages/index/index',
    }
  },
  ChoseNewWeek:function(){
    if (!this.data.ifShowNewWeek){
      this.setData({
        ifShowNewWeek: true
      });
    }
    
  },
  ChoseLastWeek:function(){
    if (this.data.ifShowNewWeek) {
      this.setData({
        ifShowNewWeek: false
      });
    }
  }
})