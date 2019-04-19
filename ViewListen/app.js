//app.js
import formatUrl from './utils/api.js'
// import page from './pages/index/index.js'
App({
  globalData: {
    userInfo: null,
    shareTicket: null,
    read: {},
    listen: {},
    words: [],
  },
  onShow: function(res) {
    const {
      shareTicket
    } = res;
    this.globalData.shareTicket = shareTicket;
  },
  onLaunch() {
    this.fetchKeys().then(({
      unionid
    }) => {
      this.fetchTasks(unionid)
    })
  },
  // 发送 res.code 到后台换取 openId, sessionKey, unionId
  fetchKeys() {
    const _this=this;
    
    // console.log()
    return new Promise(resolve => {
      if (!wx.getStorageSync('session_key')){
        console.log("no session_key")
        return _this.wxLogin(successCB) 
      }
      
      _this.wxLogin(successCB) 
      wx.checkSession({
        success() {
          // console.log('session_key 未过期');
          console.log(wx.getStorageSync('session_key'));
          // session_key 未过期，并且在本生命周期一直有效
          resolve({
            unionid: wx.getStorageSync('union_id'),
            session_key: wx.getStorageSync('session_key'),
            openid: wx.getStorageSync('openid')
          })
        },
        fail() {
          console.log("session_key过期")
          _this.wxLogin(successCB) 
        }
      })
      function successCB(res) {
        // session_key 已经失效，需要重新执行登录流程
        const {
          unionid,
          session_key,
          openid,
          
        } = res.data
         
        wx.setStorageSync('union_id', unionid);
        wx.setStorageSync('session_key', session_key);
        wx.setStorageSync('openid', openid);
        resolve(res.data);
       
      }

    })
  },
  WxgetUserI(session_key){
    
  },
  JustLogin(){
    const that=this;
    wx.login({
      success: res => {
        console.log(res);
        wx.request({
          url: formatUrl(`returnUnionid&code=${res.code}`),
          success(res) {
            const session_key = res.data.session_key;
            wx.getUserInfo({
              success: res => {
                wx.request({
                  url: formatUrl(`newreturnUnionid`),
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  data: {
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    session_key
                  },
                  success(res) {
                    console.log(res);
                    wx.setStorageSync("gender", res.data.gender);
                    wx.setStorageSync("unionssId", res.data.unionId);
                    // that.onLoad();
                    that.onLaunch();
                  }
                })
              }
            })

          }
        })
      }
    })
  },
  wxLogin(callback){
    let that=this;
    wx.login({
      success: res => {
        console.log(res);
        wx.request({
          url: formatUrl(`returnUnionid&code=${res.code}`),
          success(res) {
            console.log(res);
            const session_key=res.data.session_key;
            wx.getUserInfo({
              success: res => {
                //console.log(res);
                //const session_key=wx.getStorageSync('session_key');
                console.log(session_key);
                wx.request({
                  url: formatUrl(`newreturnUnionid`),
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  data: {
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    session_key
                  },
                  success(res) {
                    console.log(res);
                    wx.setStorageSync("gender", res.data.gender);
                    wx.setStorageSync("unionssId", res.data.unionId);
                    callback && callback(res);
                    // that.onLaunch();
                  }
                })
              }
            })
            // callback && callback(res);
            
          }
        })
      }
    })

  },
  fetchTasks(unionid) {
    const _this = this;
    wx.request({
      url: formatUrl(`newgetnewday`),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        union_id: unionid
      },
      success(res) {
        const {
          step1,
          step2,
          step3,
          diff
        } = res.data
        _this.globalData.read = step1
        _this.globalData.listen = step2
        _this.globalData.words = step3.words
        _this.globalData.diff =diff
      }
    })
  }
})