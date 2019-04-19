import formatUrl, {
  queryDayTasks
} from '../../utils/api.js'
import dayjs from '../../utils/dayjs.js'
const app = getApp()
let timeout = null,
timeout0=null;
const defaultDiffSelection = ['三年级以下', '三年级以上', '中学', '高中']
Page({
  data: {
    remarks:{},
    ifShowRightBox:false,
    ifShowShare: false,
    ifShowCanvas:false,
    ifHasShow:false,
    cWidth:375,
    cHeight:667,
    userInfo: {},
    hasUserInfo: false,
    showContainer: false,
    today: dayjs().format('YYYY-MM-DD'),
    dayTasks: [],
    weekdata: [],
    weekdataShowAll: false,
    routers: ['read', 'listen', 'word'],
    defaultDiffSelections: defaultDiffSelection,
    ifShowOutbox:false,
    ifShowQRCode:false,
    qrcode:"",
    qrcodemsg:"",
    wechatno:"",
    sharecardsrc:"",
    diffSelection: ['未选择', ...defaultDiffSelection],
    // diff: parseInt(wx.getStorageSync('diff')) || 0,
    diff: 0,
    myHtml:""
  },
  onLoad: function(){
    // console.log(formatUrl(`edituserinfo`));
    const that=this;
    //console.log(this.data.diff);
    const newDiff = parseInt(wx.getStorageSync('diff'));
    //console.log(newDiff);
    this.setData({
      myHtml: that.data.diffSelection[that.data.diff]
    });
    timeout0 = setInterval(() => {
      if (parseInt(that.data.diff) > 0){
        //console.log(parseInt(that.data.diff));
        clearInterval(timeout0);
        
      }else{
        let unionssId=wx.getStorageSync("unionssId");
        if (unionssId){
          that.setData({
            ifShowOutbox: true
          });
        }
        
        //console.log(0);
      }
    }, 300)
    this.Remarks();
    this.PostShareTicket();
    // setTimeout(function(){
    //   that.RightboxBtnLoad();
    // },3000);

  },
  onShow: function() {
    //let asd = this.getData({});
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getUserInfo()
    this.renderData()
    console.log("check");
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      weekdataShowAll:true
    })
    
  },
  PostShareTicket:function(){
    const {
      shareTicket
    } = app.globalData;
    const _this=this;
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
            // console.log('union_id: ' + unionid,
            //   '\nsession_key: ' + session_key,
            //   '\nshareTicket: ' + shareTicket,
            //   '\nencryptedData: ' + encryptedData,
            //   '\niv: ' + iv)
            wx.request({
              url: formatUrl(`groupMark`),
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                union_id: unionid,
                sessionkey: session_key,
                shareTicket,
                encryptedData,
                iv
              },
              success(res) {
                // console.log(res.code)
              },
              fail(res) {
                // console.log(res)
                wx.showToast({
                  title: '查看群排名失败',
                  icon: 'none',
                  duration: 2000
                })
              },
              complete(res) {
                //console.log(res)
              }
            })
          }
        )
      }
    })
  },
  Test: function () {
    //wx.setStorageSync('diff', 0);
    //console.log("refresh");
    
  },
  Remarks:function(){
    const { remarks}=this.data;
    const _this=this;
    //let ctxW, ctxH;
    // const query = wx.createSelectorQuery()
    // query.select('.myCanvas').boundingClientRect().exec(function (res) {
    //   remarks.ctxW = res[0].width;
    //   remarks.ctxH = res[0].height;
    //   console.log(remarks, remarks.ctxW, remarks.ctxH);
    // });
    wx.getSystemInfo({
      success: function(res) {
        remarks.ctxW=res.screenWidth;
        remarks.ctxH = res.screenHeight;
        _this.setData({
          cWidth: res.screenWidth,
          cHeight: res.screenHeight
        });
        // console.log(res.screenHeight,res.screenWidth);
      },
    })
  },
  RightboxBtn:function(){
    const _this=this;
    _this.setData({
      ifShowShare: true
    });
    wx.showLoading({
      title: "成就卡生成中"
    });
    _this.SaveImage();
  },
  RightboxBtnLoad:function(num){
    const _this=this;
    const unionid = wx.getStorageSync("union_id");
    // console.log(unionid);
    


    // _this.CanvasPic("老王士大夫子", "南大街宋科长v就爱的JFK了大你就辞职空的案件多发", "https://www.mynew-miracle.com/Public/Uploads/myqrcode.jpg", 5);
    // _this.setData({
    //   ifShowShare: true
    // });
   
    wx.request({
      url: formatUrl(`achievementcard`),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        union_id: unionid
      },
      success(res) {
        // console.log(res);
        if (parseInt(res.data.status)===1){
          let datas=res.data;
          let headimgurl = datas.headimgurl,
            nickname = datas.nickname,
            remark1 = datas.remark1,
            remark2= datas.remark2,
            stars = parseInt(datas.stars),
            totalscore = datas.totalscore;
          // console.log(headimgurl, nickname, remark, stars, totalscore);
          _this.CanvasPic(nickname, remark1, remark2, headimgurl, stars, totalscore,num);
          // _this.setData({
          //   ifShowRightBox: true
          // });
          // _this.CanvasPic("撒旦克里夫斯基", "南大街宋科长v就爱的JFK了大你就辞职空的案件多发是第几次下加都是佛大家记得发的JFK了大你就辞职空的案件多发是第几次下加都是佛大家记得发的JFK了大你就辞职空的案件多发是第几次下加都是佛大家记得发的JFK了大你就辞职空的案件多发是第几次下加都是佛大家记得发", headimgurl, 5, totalscore);
          
        }    
      },
      fail() {
        wx.showToast({
          title: '生成成就卡失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  CanvasPic: function (nickname, word1,word2, picUrl, codeNum, totalscore,num){
    const ctx = wx.createCanvasContext('myCanvas');
    const _this=this;

    // const nickname="老王士大夫子";
    // const word ="南大街宋科长v就爱的JFK了大你就辞职空的案件多发是第几次下加都是佛大家记得发的JFK了大你就辞职空的案件多发是第几次下加都是佛大家记得发的JFK了大你就辞职空的案件多发是第几次下加都是佛大家记得发的JFK了大你就辞职空的案件多发是第几次下加都是佛大家记得发";
    // const picUrl ="https://www.mynew-miracle.com/Public/Uploads/myqrcode.jpg";
    // const codeNum=3;

    let codePic="",codeWidth="";
    const { remarks}=this.data;
    const nickname0 = nickname.substring(0, 6);
    const word0 = word1.substring(0, 30);
    const word20 = word2.substring(0, 30);
    const gender = parseInt(wx.getStorageSync("gender"));
    // console.log(gender);
    const thatW = remarks.ctxW, thatH = remarks.ctxH;
    const pecentW = thatW/375;
    const pecentH= thatH/667;
    let pecents;
    if (pecentW > pecentH){
      pecents = pecentH;
    }else{
      pecents = pecentW;
    }
    
    // console.log(picUrl, thatH);
    _this.setData({
      ifShowCanvas: true
    });
    // const codeNum=codeN;
    // console.log(codeNum);
    if (codeNum===5){
      codePic="../images/newcanvas/5.png";
      codeWidth=158;
    } else if (codeNum===4){
      codePic = "../images/newcanvas/4.png";
      codeWidth = 126;
    } else if (codeNum === 3) {
      codePic = "../images/newcanvas/3.png";
      codeWidth = 95;
    } else if (codeNum === 2) {
      codePic = "../images/newcanvas/2.png";
      codeWidth = 62;
    } else if (codeNum === 1) {
      codePic = "../images/newcanvas/1.png";
      codeWidth = 30;
    }else if(codeNum === 0){
      codePic ="../images/newcanvas/7.png";
      codeWidth=30;
    }else{
      codePic = "";
      codeWidth = 30;
    }
    wx.downloadFile({
      url: picUrl,
      success: function (res){
        var _avatarPath = res.tempFilePath
        // console.log(_avatarPath);

        let fontColor1 = "", fontColor2 = "" , bgUrl = "";
        if (gender === 2) {
          fontColor1 = "#7B2D34";
          fontColor2 = "#2D1E14";
          bgUrl = "../images/newcanvas/girl_011.jpg"
        } else {
          fontColor1 = "#F7D900";
          fontColor2 = "#E7EE3A";
          bgUrl = "../images/newcanvas/boy_015.jpg"
        }

        // let fontStyle = ctx.createLinearGradient(0, 0, 0, 40);
        // fontStyle.addColorStop(0,"#aaa"); 
        // fontStyle.addColorStop(0.5, '#555');
        // fontStyle.addColorStop(1, '#000');

        ctx.setFillStyle('#37ABF2')
        ctx.fillRect(0, 0, 375 * pecents, 577 * pecents)
        ctx.drawImage(bgUrl, 0, 0, 375 * pecents, 600 * pecents)//背景

        // ctx.drawImage(_avatarPath, 90 * pecents, 155 * pecents, 190 * pecents, 190 * pecents)
        ctx.drawImage(_avatarPath, 50 * pecents, 60 * pecents, 30 * pecents, 30 * pecents)
        // ctx.drawImage("../images/img.jpg", 50 * pecents, 60 * pecents, 30 * pecents, 30 * pecents)
        
        
        ctx.setFillStyle('#1A0F23')
        ctx.setFontSize(22 * pecents)
        ctx.fillText(nickname0, 120 * pecents, 85 * pecents, 120 * pecents);//名字
        
        if (codeNum >= 0 && codeNum <= 5) {
          ctx.drawImage(codePic, 40 * pecents, 95 * pecents, codeWidth * pecents, 30 * pecents);//星星
        }
        ctx.drawImage("../images/newcanvas/6.png", 210 * pecents, 110 * pecents,70 * pecents, 15 * pecents);//战斗力
         
        ctx.setFillStyle(fontColor1)
        ctx.setFontSize(14 * pecents)
        ctx.fillText(totalscore, 290 * pecents, 124 * pecents, 50 * pecents);//战斗力

        ctx.setFillStyle(fontColor2)
        ctx.setFontSize(14 * pecents)
        _this.drawText(ctx, word0, 70 * pecents, 425 * pecents, 20 * pecents, 240 * pecents);
        ctx.setFillStyle(fontColor2)
        ctx.setFontSize(14 * pecents)
        _this.drawText(ctx, word20, 70 * pecents, 460 * pecents, 20 * pecents, 240 * pecents);

        ctx.draw(false, function (e) {
          wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            x: 0,
            y: 0,
            width: thatW,
            height: thatH,
            destWidth: thatW*6,
            destHeight: thatH*6,
            success: function (res) {
              // console.log("get tempfilepath(success) is:", res.tempFilePath);
              _this.setData({
                sharecardsrc: res.tempFilePath
              });
              _this.setData({
                // ifShowShare: true,
                ifShowRightBox: true,
                ifShowCanvas: false
              });
              //ads
              const { ifHasShow}=_this.data;
              if (parseInt(num) === 4 && !ifHasShow) {
                _this.setData({
                  ifShowShare: true,
                  ifHasShow:true
                });
              }
              
              // wx.saveImageToPhotosAlbum({
              //   filePath: res.tempFilePath,
              //   success(res) {
              //     console.log(res)
              //     wx.showToast({
              //       title: '一张成就卡已保存',
              //       icon: 'none',
              //       duration: 2000
              //     })
              //   },
              //   fail: function () {
              //     wx.showToast({
              //       title: '您的手机无法保存成就卡',
              //       icon: 'none',
              //       duration: 2000
              //     })
              //   }
              // })
            },
            fail: function () {
              wx.showToast({
                title: '生成成就卡失败',
                icon: 'none',
                duration: 2000
              })
            },

          }, this)
        })
      }
    });
    
  },
  SaveImage:function(){
    const {
      sharecardsrc
    }=this.data;
    // console.log(sharecardsrc);
    wx.saveImageToPhotosAlbum({
      filePath: sharecardsrc,
      success(res) {
        // console.log(res)
        wx.hideLoading();
        wx.showToast({
          title: '一张成就卡已保存',
          icon: 'none',
          duration: 2000
        })
        
      },
      fail: function () {
        // console.log("save photo is fail")
        wx.showToast({
          title: '保存成就卡失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 16; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },
  renderData() {
    // console.log('fecth')
    const _this = this;
    const unionid = wx.getStorageSync('union_id')
    clearTimeout(timeout)
    if (unionid) {
      queryDayTasks(unionid, app, (res) => {
        const {
          dayTasks,
          weekdata,
          qrcode,
          qrcodemsg,
          wechatno
        } = res;
        console.log(dayTasks);
        _this.setData({
          dayTasks,
          weekdata,
          qrcode,
          qrcodemsg,
          wechatno,
          showContainer: true,
          diff: parseInt(app.globalData.diff)
        })

        let dayTasksNum = 0;
        for (let dayTask of dayTasks) {
          if (dayTask.done) {
            dayTasksNum++;
          }
        }
        console.log(dayTasksNum);
        //成就卡
        _this.RightboxBtnLoad(dayTasksNum);

      })
      // console.log(_this.data.diff);
      const newDiff = parseInt(wx.getStorageSync('diff'));
      if (newDiff === 0 || newDiff === null || newDiff === undefined){
        let unionssId = wx.getStorageSync("unionssId");
        if (unionssId) {
          _this.setData({
            ifShowOutbox: true
          });
        }
      }else{
        _this.setData({
          ifShowOutbox: false,
          diff: newDiff,
          myHtml: _this.data.diffSelection[newDiff]
        });
      }
    } else {
      timeout = setTimeout(() => {
        _this.renderData()
      }, 300)
    }
  },
  
  handleGetUserInfo: function(e) {
    const that=this;
    app.JustLogin();
    that.onLoad();   
    let timer=setInterval(function(){
      const {
        userInfo
      } = e.detail;
      console.log(userInfo);
      if (!userInfo) return
      app.globalData.userInfo = userInfo
      that.setData({
        userInfo,
        hasUserInfo: true
      })
      let unionssId = wx.getStorageSync("unionssId");
      if (!unionssId) return
        
        clearInterval(timer);
      that.onLoad();
      that.onShow(); 
        setTimeout(function(){
          that.renderData();
        },300);
        that.setData({
          ifShowOutbox: true,
          showContainer: true
        });
      
      
    },1000);
    
  },
  getUserInfo() {
    // 获取用户信息
    const _this = this;
    return new Promise((resolve, reject) => {
      const {
        userInfo
      } = app.globalData
      
      if (userInfo) {
        _this.setData({
          userInfo,
          hasUserInfo: true
        })
        return resolve(userInfo)
      }
      const union_id = wx.getStorageSync('union_id')
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              withCredentials: true,
              success: res => {
                const resUserInfo = res.userInfo
                _this.setData({
                  userInfo: resUserInfo,
                  hasUserInfo: true
                })
                app.globalData.userInfo = resUserInfo
                // console.log(resUserInfo,resUserInfo.nickName,resUserInfo.avatarUrl, union_id);
                return resolve(resUserInfo)
              }
            })
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  handleDiffSelection() {
    const _this = this;
    wx.showActionSheet({
      itemList: defaultDiffSelection,
      itemColor: '#666',
      success({
        tapIndex
      }) {
        const {
          diff
        } = _this.data;
        const nextDiff = tapIndex + 1;
        if (nextDiff === diff) return;
        wx.showLoading({
          title: '请稍后',
        })
        const union_id = wx.getStorageSync('union_id')
        // console.log(_this.data.userInfo.nickName);
        wx.request({
          url: formatUrl(`edituserinfo`),
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            union_id,
            diff: nextDiff,
            nickname:_this.data.userInfo.nickName,
            headimgurl: _this.data.userInfo.avatarUrl
          },
          success(res) {
            _this.setData({
              diff: nextDiff,
              myHtml: _this.data.diffSelection[nextDiff]
            })
            wx.setStorageSync('diff', nextDiff)
            wx.setStorageSync('nickName', _this.data.userInfo.nickName)
            app.fetchTasks(union_id)
            _this.renderData()
          },
          fail() {
            wx.showToast({
              title: '更新难度失败',
              icon: 'none',
              duration: 2000
            })
          },
          complete() {
            wx.hideLoading()
          }
        })
      },
      fail(res) {
        // console.log(res.errMsg)
      }
    })
  },
  handleDiffSelects: function (e){
    const _this = this;
    // var $id =parseInt(e.currentTarget.dataset.index)+1; 
    // console.log($id);
    const {
      diff
    } = _this.data;
    const nextDiff = parseInt(e.currentTarget.dataset.index) + 1;
    // console.log(nextDiff);
    if (nextDiff === diff) return;
    wx.showLoading({
      title: '请稍后',
    })
    const union_id = wx.getStorageSync('union_id')
    wx.request({
      url: formatUrl(`edituserinfo`),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        union_id,
        diff: nextDiff,
        nickName: _this.data.userInfo.nickName,
        headimgurl: _this.data.userInfo.avatarUrl
      },
      success(res) {
        _this.setData({
          diff: nextDiff,
          myHtml: _this.data.diffSelection[nextDiff]
        })
        
        _this.setData({
          ifShowOutbox: false
        });
        // console.log(_this.data.ifShowOutbox);
        wx.setStorageSync('diff', nextDiff)
        wx.setStorageSync('nickName', _this.data.userInfo.nickName)
        app.fetchTasks(union_id)
        _this.renderData()
      },
      fail() {
        wx.showToast({
          title: '更新难度失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  viewtap: function(e) {
    const {
      id,
      dataset: {
        disabled,
        indx   
      }
    } = e.currentTarget
    // console.log(indx, disabled);
    if (disabled && indx===1) {
      return wx.showToast({
        title: '您已完成该挑战',
        icon: 'none',
        duration: 2000
      })
    }
    const router = this.data.routers[id]
    return wx.navigateTo({
      url: `../${router}/${router}`
    })
  },
  toggleWeekdataShowAll: function() {
    this.setData({
      weekdataShowAll: !this.data.weekdataShowAll
    })
  },
  // toggleWeekdayShowAll: function () {
  //   if (!this.data.weekdataShowAll){
  //     this.setData({
  //       weekdataShowAll: !this.data.weekdataShowAll
  //     })
  //   }
  // },
  ChangeWeekDay:function(){
    if (this.data.weekdataShowAll){
      // console.log("stop");
    }
    
  },
  gotoIntroduce: function () {
    wx.navigateTo({
      url: `/pages/introduce/introduce`,
    })
  },
  gotoBurse: function() {
    wx.navigateTo({
      url: `/pages/prize/prize`,
    })
    // return wx.showToast({
    //   title: '此功能暂未开放',
    //   icon: 'none',
    //   duration: 2000
    // })
  },
  handleGroupRank() {
    const {
      shareTicket
    } = app.globalData
    if (!shareTicket) {
    return  wx.showModal({
        title: '提示',
        content: '只有在群组中打开小程序才能看到群排名，您可以点击右侧“分享给好友”将小程序分享到任意群，从分享链接中打开此小程序',
        showCancel: false,
      })
    }
    wx.navigateTo({
      url: `/pages/groupRank/groupRank?shareTicket=${shareTicket}`,
    })
  },
  onShareAppMessage: function(ops) {
    const {
      userInfo
    } = app.globalData
    const _this=this;
    // _this.setData({
    //   ifShowShare:true
    // });
    // setTimeout(function(){
    //   _this.setData({
    //     ifShowShare: false
    //   })
    // },1000);
    return {
      title: `${userInfo.nickName}邀请您挑战英语天天练`,
      path: '/pages/index/index',
      success:function(e){
        // console.log(e);
        _this.setData({
          ifShowShare: false
        });
      },
      fail: function(e){
        _this.setData({
          ifShowShare: false
        });
      },
      complete:function(){
        _this.setData({
          ifShowShare: false
        });
      }
    }
  },
  LeftboxBtn:function(){
    this.setData({
      ifShowQRCode:true
    })
  },
  LeftboxHide:function(){
    this.setData({
      ifShowQRCode: false
    });
  },
  SharecardHide: function () {
    this.setData({
      ifShowShare: false
    });
  },
  ShareCanvasHide: function () {
    this.setData({
      ifShowCanvas: false
    });
  },
  previewImage: function (e) {
    
    const _this=this;
    var current = e.target.dataset.src;
    // console.log(_this.data.qrcode);
    wx.previewImage({
      current: current, // 当前显示图片的http链接   
      urls: [current]  // 需要预览的图片http链接列表   
    })
    // wx.getImageInfo({// 获取图片信息（此处可不要）
    //   src: 'https://www.cslpyx.com/weiH5/jrkj.jpg',
    //   success: function (res) {
    //     console.log(res.width)
    //     console.log(res.height)
    //   }
    // })

  },
  scancode: function () {
    let that = this;
    let result;
    wx.scanCode({
      success: (res) => {
        this.result = res.result;
        that.setData({
          result: this.result
        })
      }
    })
  },
  BindToService:function(){
    wx.showLoading({
      title: '点我的对话框哦！'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  CipBoardData: function (e) {
    const wechat = e.currentTarget.dataset.items;
    console.log(wechat);
    const _this = this;
    wx.setClipboardData({
      data: wechat,
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '复制微信号成功',
          icon: 'none',
          duration: 2000
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '复制微信号成功',
        //   showCancel:false,
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('确定')
        //     } else if (res.cancel) {
        //       console.log('取消')
        //     }
        //   }
        // })
      }
    });
  }
})