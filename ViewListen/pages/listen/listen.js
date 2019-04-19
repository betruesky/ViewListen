import formatUrl  from '../../utils/api.js'
const app = getApp()
const router = 'listen'
const toPause = '../images/new/zanting.png';
const toPlay = '../images/new/bofang.png';
const InnerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    InnerAudioContext: null,
    btnSrc: toPlay,
    duration: 0,
    percent: 0,
    opts: ['A', 'B', "C", "D"],
    question: [],
    answers: Array(4).fill(''),
    qLength: 0,
    mp3: null,
    questionIndex: 0,
    disabled: true,
    submited:false,
    myAudioUrl:""
  },
  onLoad: function() {
    const _this = this;
    const {
      question,
      mp3
    } = app.globalData[router]
    const qLength = question.length
    const res = wx.getSystemInfoSync()
    // let InnerAudioContext
    // if (res.platform == 'ios') {
    //   InnerAudioContext = wx.getBackgroundAudioManager()
    // } else {
    //   InnerAudioContext = wx.createInnerAudioContext();
    // }
    // const InnerAudioContext = wx.createInnerAudioContext()
    if (wx.setInnerAudioOption) {
      wx.setInnerAudioOption({
        obeyMuteSwitch: false
      })
    } else {
      InnerAudioContext.obeyMuteSwitch = false;
    }
    
    InnerAudioContext.title = ' ';
    InnerAudioContext.src = `https://www.mynew-miracle.com/Public/listenning/${mp3}`
    const thismyAudioUrl = `https://www.mynew-miracle.com/Public/listenning/${mp3}`;
    // console.log(thismyAudioUrl);
    _this.setData({
      // InnerAudioContext,
      question,
      qLength,
      mp3,
      myAudioUrl: thismyAudioUrl
    })
    console.log(InnerAudioContext.src);
    // let timer0=setInterval(function(){
      
    //   if (_this.data.InnerAudioContext.src===""){
    //     console.log(_this.data.InnerAudioContext.src);
    //     _this.data.InnerAudioContext.src = thismyAudioUrl;
    //   }else{
    //     clearInterval(timer0);
    //   }
      
    // },500);
    
    
    
  },
  onShow(){
    wx.hideShareMenu()
    // const {
    //   InnerAudioContext
    // } = this.data
    const _this = this;
    InnerAudioContext.onPlay(() => {
      console.log("onplay");
      _this.setData({
        btnSrc: toPause
      })
    })
    InnerAudioContext.onPause(() => {
      _this.setData({
        btnSrc: toPlay
      })
    })
    InnerAudioContext.onStop(() => {
      _this.setData({
        btnSrc: toPlay,
        percent: 0
      })
    })
    InnerAudioContext.onTimeUpdate(() => {
      const prePercent = _this.data.percent
      const percent = (InnerAudioContext.currentTime / InnerAudioContext.duration * 100).toFixed(1)
      if (prePercent !== percent) {
        return _this.setData({
          percent
        })
      }
    })
  },
  onUnload:function(){
    console.log('onUnload')
    this.unbindAudio()
  },
  onHide:function(){
    this.unbindAudio()
  },
  toggleAudioPlay2: function () {
    // const {
    //   InnerAudioContext
    // } = this.data
    InnerAudioContext.stop();
    
  },
  toggleAudioPlay: function() {
    const _this=this;
    // const {
    //   InnerAudioContext
    // } = this.data
    // if (_this.data.InnerAudioContext.src === "" || _this.data.InnerAudioContext.src===undefined){
    //   _this.data.InnerAudioContext.src = _this.data.myAudioUrl;
    // }
    
    // _this.data.InnerAudioContext.src ="https://www.mynew-miracle.com/Public/Uploads/%E5%B0%8F%E5%AD%A6-%E5%91%A8%E8%AE%A1%E5%88%92/Week%2001/1.mp3"
    console.log(InnerAudioContext.src);
    InnerAudioContext.paused ? InnerAudioContext.play() : InnerAudioContext.pause()
    
    // console.log(_this.data.InnerAudioContext.src);
  },
  handleAnswer: function(e) {
    const {
      dataset: {
        index,
        opt,
        idx
      }
    } = e.target;
    const newAnswers = this.data.answers.concat()
    newAnswers[index] = {
      idx,
      select: opt,
      right: this.data.question[index].right === opt
    }

    const answerNum = newAnswers.reduce((prev, item) => {
      if (item) ++prev
      return prev
    }, 0)
    console.log(answerNum)
    this.setData({
      answers: newAnswers,
      disabled: answerNum !== this.data.qLength
    })
  },
  submitListen: function() {
    const _this=this;
    const rightnum = this.data.answers.reduce((prev, item) => {
      if (item.right) prev++
        return prev
    }, 0)
    const union_id = wx.getStorageSync('union_id')
    wx.request({
      url: formatUrl(`submitListen`),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        union_id,
        rightnum,
      },
      success(res) {
        _this.setData({
          submited: true
        })
      }
    })

  },
  goHomePage(){
    wx.navigateBack()
  },
  goNextPass(){
    if (app.globalData.dayTasks[2].done) {
      return wx.showToast({
        title: '您已完成单词闯关，请返回首页',
        icon: 'none',
        duration: 3000,
      })
    }
    wx.navigateTo({
      url: `/pages/word/word`
    })
  },
  unbindAudio(){
    // const {
    //   InnerAudioContext
    // } = this.data
    !InnerAudioContext.paused && InnerAudioContext.pause()
    InnerAudioContext.offPlay()
    InnerAudioContext.offPause()
    InnerAudioContext.offTimeUpdate()
  }
})