import formatUrl from '../../utils/api.js'
const app = getApp()
const router = 'words'
const innerAudioContext = wx.createInnerAudioContext()
const audioUrl = (src) => `https://www.mynew-miracle.com/${src.replace('__PUBLIC__','Public')}`
Page({
  data: {
    current: 0,
    rightNum:0,
    words: [],
    currentWord: {},
    currentWordLength: 0,
    currentWordLengthArr: [],
    input: '',
    selection: 1,
    focused: true,
    useTime:0,
    timeInt:'',
  },
  onLoad: function() {
    wx.hideShareMenu()
    const words = app.globalData[router]
    const currentWord = words[this.data.current]
    const currentWordLength = currentWord.word.length
    this.setData({
      words,
      currentWord,
      currentWordLength,
      currentWordLengthArr: Array(currentWordLength).fill('')
    })
    innerAudioContext.src = audioUrl(currentWord.audio) 
    let _this=this;
    _this.useTime=0;
    _this.data.timeInt=setInterval(function(){
      //_this.data.useTime=parseInt(_this.data.useTime)+1;
      _this.setData({
        useTime: parseInt(_this.data.useTime) + 1
      })
      console.log(_this.data.useTime);
    },1000);
  },
  BlurItemInputFocus:function(){
    if (this.data.focused)
      this.setData({
        focused:false
      });
  },
  BlurItemInputFocus2: function () {
    if (this.data.focused)
      this.setData({
        focused: false
      });
  },
  bindItemInputFocus(e) {
    const {
      index
    } = e.currentTarget.dataset
    const {
      input
    } = this.data;
    const inputLen = input.length
    this.setData({
      selection: index + 1 === inputLen ? index + 2 : input[index] ? index + 1 : inputLen ? inputLen + 1 : 1
    })
    if (!this.data.focused){
      this.setData({
        focused: true
      });
    }
  },
  bindInput: function(e) {
    const input = e.detail.value
    const {
      selection,
      input: prevInput,
      currentWordLength,
      currentWord
    } = this.data;
    const preInputLen = prevInput.length
    const nextInputLen = input.length
    const newSelection = nextInputLen - preInputLen
    const isDelete = newSelection < 0
    if ((currentWordLength === preInputLen && !isDelete) || preInputLen === input.length) return
    this.setData({
      input,
      selection: selection + newSelection
    })
    this.bindInputCheck();
  },
  bindInputCheck:function(e){
    const {
      current,
      words,
      rightNum,
      currentWord,
      input
    } = this.data
    
    if (currentWord.word.toLowerCase() !== input.toLowerCase()) return;
    const nextCurrent = current + 1
    const rightN = rightNum + 1
    const nextCurrentWord = words[nextCurrent]
    let currentWordLength;
    if (nextCurrentWord!==undefined){
      currentWordLength = nextCurrentWord.word.length
      innerAudioContext.src = audioUrl(nextCurrentWord.audio)
      this.setData({
        current: nextCurrent,
        rightNum: rightN,
        currentWord: nextCurrentWord,
        currentWordLength,
        currentWordLengthArr: Array(currentWordLength).fill(''),
        input: '',
        selection: 1
      }, () => {
        if (nextCurrent === words.length) {
          this.submitWord()
        }
      })
    }else{
      this.setData({
        rightNum: rightN
      }, () => {
        if (nextCurrent === words.length) {
          this.submitWord()
        }
      })
    }
  },
  bindInputConfirm: function(e) {
    const {
      current,
      words,
      currentWord,
      rightNum,
      input
    } = this.data
    if (currentWord.word.toLowerCase() !== input.toLowerCase()) return wx.showToast({
      title: '您的拼写不正确',
      icon: 'none',
      duration: 2000
    })
    const nextCurrent = current + 1
    const rightN = rightNum+1
    const nextCurrentWord = words[nextCurrent]
    const currentWordLength = nextCurrentWord.word.length
    innerAudioContext.src = audioUrl(nextCurrentWord.audio) 
    this.setData({
      current: nextCurrent,
      rightNum: rightN,
      currentWord: nextCurrentWord,
      currentWordLength,
      currentWordLengthArr: Array(currentWordLength).fill(''),
      input: '',
      selection: 1
    }, () => {
      if (nextCurrent === words.length) {
        this.submitWord()
      }
    })
  },
  audioPlay: function (e) {
    // console.log(innerAudioContext.src)
    innerAudioContext.play()
    // console.log(this.data.focused);
    this.setData({
      focused: true,
      input: '',
      selection:1
    });
  },
  submitSkipWord:function(){
    console.log(this.data.rightNum,this.data.current);
    const {
      current,
      words,
      currentWord,
      input
    } = this.data
    const nextCurrent = current + 1
    const nextCurrentWord = words[nextCurrent]
    const currentWordLength = nextCurrentWord.word.length
    innerAudioContext.src = audioUrl(nextCurrentWord.audio)
    this.setData({
      current: nextCurrent,
      currentWord: nextCurrentWord,
      currentWordLength,
      currentWordLengthArr: Array(currentWordLength).fill(''),
      input: '',
      selection: 1
    }, () => {
      if (nextCurrent === words.length) {
        this.submitWord()
      }
    })
  },
  submitWord: function() {
    // clearInterval(this.data.timeInt);
    // console.log(this.data.useTime);
    let _this=this.data;
    const {
      current,
      currentWord,
      rightNum,
      input,
      words,
      useTime,
      timeInt,
    } = this.data
    if (!current) return wx.showToast({
      title: '您尚未闯关',
      icon: 'none',
      duration: 2000
    })
    const union_id = wx.getStorageSync('union_id')
    // clearInterval(this.data.timeInt);
    console.log(rightNum, useTime);
    wx.request({
      url: formatUrl(`submitSpell`),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        union_id,
        rightnum: rightNum,
        useTime
      },
      success(res) {

        clearInterval(timeInt);
        console.log(res)
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 3000,
        })
        wx.navigateTo({
          url: `/pages/index/index`,
        })
      }
    })
  }
})