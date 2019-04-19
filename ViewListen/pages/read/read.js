import formatUrl from '../../utils/api.js'
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

const options = {
  duration: 320000,
  sampleRate: 8000,
  numberOfChannels: 1,
  encodeBitRate: 48000,
  format: 'mp3',
}


const router = 'read'
Page({
  data: {
    originalCN: '',
    originalEN: '',
    original: '',
    recording: false,
    recordUrl: '',
    score: '',
    voiceHtml: []
  },
  onLoad: function() {
    wx.hideShareMenu()
    const _this = this;
    console.log(app)
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success(res) {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log(res)
            }
          })
        }
      }
    })
    const {
      ENGone: originalEN,
      CNone: originalCN,
      mp3path: original
    } = app.globalData[router]
    _this.setData({
      originalCN,
      originalEN,
      original
    })
    recorderManager.onStop((res) => {
      console.log(res)
      const {
        tempFilePath
      } = res
      wx.showLoading({
        title: '正在评分',
      })
      _this.setData({
        recordUrl: tempFilePath
      })

      innerAudioContext.src = tempFilePath
      const union_id = wx.getStorageSync('union_id')
      wx.uploadFile({
        url: formatUrl(`matchtext`),
        filePath: tempFilePath,
        name: 'record',
        formData: {
          union_id
        },
        success(res) {
          const {
            score,
            yourVoice
          } = JSON.parse(res.data)
          const voiceHtml = Object.values(yourVoice).reduce((node, item) => {
            console.log(item)
            node.push({
              name: 'span',
              attrs: {
                class: item.flag,
              },
              children: [{
                type: 'text',
                text: `${item.word}&nbsp;&nbsp;`
              }]
            })
            return node
          }, [])
          _this.setData({
            score,
            voiceHtml
          }, () => {
            wx.hideLoading()
          })
        }
      })
    })
  },
  readerStart: function() {
    this.setData({
      recording: true,
      recordUrl: '',
      score: '',
    })
    console.log('start')
    recorderManager.start(options)
  },
  readerEnd: function() {
    this.setData({
      recording: false
    })
    recorderManager.stop()
  },
  audioPlay: function(e) {
    const {
      dataset: {
        audiourl
      }
    } = e.target
    const newSrc = this.data[audiourl]
    if (innerAudioContext.src !== newSrc) innerAudioContext.src = newSrc

    innerAudioContext.paused ? innerAudioContext.play() : innerAudioContext.pause()
  },
  goBack: function() {
    wx.navigateBack()
  },
  submit() {
    if (!this.data.recordUrl) {
      return wx.showToast({
        title: '您尚未录音',
        icon: 'none',
        duration: 2000
      })
    }
    if (app.globalData.dayTasks[1].done) {
      if (app.globalData.dayTasks[2].done) {
        return wx.showToast({
          title: '您已完成全部挑战，请返回首页',
          icon: 'none',
          duration: 3000,
        })
      }
      return wx.showModal({
        title: '您已完成听力练习',
        content: '去单词闯关？',
        showCancel: true,
        cancelText: '返回首页',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: `/pages/word/word`
            })
          } else if (res.cancel) {
            wx.navigateBack()
          }
        }
      })
      wx.showToast({
        title: '',
        icon: 'none',
        duration: 2000,
      })
    }
    wx.navigateTo({
      url: `/pages/listen/listen`
    })

  },
  unbindRecord() {
    !InnerAudioContext.paused && InnerAudioContext.pause()
  }
})