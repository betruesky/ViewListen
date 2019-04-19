import dayjs from './dayjs.js'
const rootApi = "https://www.mynew-miracle.com/index.php?g=Admin&m=Wxapp&a=";

const formatUrl = (params) => `${rootApi}${params}`
const queryDayTasks = (union_id, obj, successCB) => {
  wx.request({
    url: formatUrl(`getyourmark`),
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      union_id,
      this_date: dayjs().format('YYYY-MM-DD'),
    },
    success(res) {
      // console.log(res.data.qrcode);
      const {
        dayTasks,
        weekdata,
        qrcode,
        qrcodemsg,
        wechatno
      } = res.data
      const formatWeekData = weekdata.concat().reverse().reduce((prev, item, index) => {
        const under = parseInt(index / 7)
        if (!prev[under]) {
          prev[under] = []
        }
        const {
          date_status,
          date
        } = item
        const dateFromDayjs = dayjs(date)
        const m = dateFromDayjs.month() + 1
        const d = dateFromDayjs.date()
        prev[under][index - 7 * under] = {
          status: date_status,
          m,
          d: d > 9 ? d : '0' + d,
          date
        }
        return prev
      }, [])
      obj.globalData.dayTasks = dayTasks;
      obj.globalData.qrcode=qrcode;
      obj.globalData.qrcodemsg = qrcodemsg;
      obj.globalData.wechatno = wechatno;
      
      
      obj.globalData.weekdata = formatWeekData;
      successCB && setTimeout(() => {
        successCB({
          dayTasks,
          qrcode,
          qrcodemsg,
          wechatno,
          weekdata:formatWeekData
        })
      }, 0)
    }
  })
}

export default formatUrl;
export {
  queryDayTasks
}