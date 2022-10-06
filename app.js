const app = new Vue({
  el: '#app',
  data() {
    return{
      nowDATE: [2022, 10, 5],
      selectDATE: '',
      endDATE: '',
      monthNum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      dayList: ['일', '월', '화', '수', '목', '금', '토'],
      monthDAYs: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      HOWDAYS: 30,
      resultCalendar: [],
      resultCalendarRow1: [],
      resultCalendarRow2: [],
      resultCalendarRow3: [],
      resultCalendarRow4: [],
      resultCalendarRow5: [],
      resultCalendarRow6: [],
      leapYear: false,
      weekTemp: [],
    }
  },
  beforeMount() {
    this.insertWeather()
  },
  mounted() {
    this.leapChecked()
  },

  methods: {
    selectDayNum() {
      var aaaaa = $(td).className()
      console.log(aaaaa)
    },

    leapChecked() {
      this.resultCalendar = []

      var getDATE = new Date()
      var getYEAR = String(getDATE.getFullYear())
      var getMonth = String(getDATE.getMonth() + 1)
      var getDAYS = String(getDATE.getDate() < 10 ? '0' + getDATE.getDate() : getDATE.getDate())
      var nowDAYS = new Date(getYEAR+"-"+getMonth+"-01").getDay()
      this.nowDATE = [getYEAR, getMonth, getDAYS]

      if(this.nowDATE[0]%400 == 0) {
        this.leapYear = true
        this.monthDAYs[1] = 29
      } else if(this.nowDATE[0]%100 == 0) {
        this.leapYear = false
        this.monthDAYs[1] = 28
      } else if(this.nowDATE[0]%4 == 0) {
        this.leapYear = true
        this.monthDAYs[1] = 29
      } else {
        this.leapYear = false
        this.monthDAYs[1] = 28
      }

      var HOWDAYs = this.monthDAYs[getDATE.getMonth()]

      for(let i=0; i<nowDAYS; i++) {
        this.resultCalendar.push("")
      }

      for(let i=1; i<=this.HOWDAYS; i++) {
        this.resultCalendar.push(String(i))
      }

      var remainBlank = 7 - (this.resultCalendar.length%7)
      for(let i=1; i<remainBlank; i++) {
        this.resultCalendar.push("")
      }

      for(let i=0; i<=6; i++) {
        this.resultCalendarRow1.push(this.resultCalendar[i])
      }
      for(let i=7; i<=13; i++) {
        this.resultCalendarRow2.push(this.resultCalendar[i])
      }
      for(let i=14; i<=20; i++) {
        this.resultCalendarRow3.push(this.resultCalendar[i])
      }
      for(let i=21; i<=27; i++) {
        this.resultCalendarRow4.push(this.resultCalendar[i])
      }
      for(let i=28; i<=34; i++) {
        this.resultCalendarRow5.push(this.resultCalendar[i])
      }
      for(let i=35; i<=41; i++) {
        this.resultCalendarRow6.push(this.resultCalendar[i])
      }
      

      console.log(getDATE)
      console.log(getYEAR)
      console.log(getMonth)
      console.log(getDAYS)
      console.log(nowDAYS)
      console.log(HOWDAYs)
      console.log("remainBlank: "+remainBlank)
      console.log(this.resultCalendar)
      console.log(this.leapYear)
      console.log(this.nowDATE)
    },

    insertWeather() {
      var openWeatherMapURL = "https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&dataCd=ASOS&dateCd=DAY&startDt=20220101&endDt=20220102&stnIds=159"

      axios
        .get(openWeatherMapURL)
        .then(data => {
          console.log(data.data.response.body.items.item[0].avgTa)
        })
        .catch(error => {
          console.log("에러 발생 ERROR"+error)
        })
    }
  }
})


// {"response":
//   {"header": {"resultCode":"00","resultMsg":"NORMAL_SERVICE"},
//     "body":{
//       "dataType":"JSON",
//       "items":{
//         "item":[
//         {"stnId":"159","stnNm":"부산","tm":"2022-01-01","avgTa":"1.9","minTa":"-3.9","minTaHrmt":"0645","maxTa":"7.4","maxTaHrmt":"1332","mi10MaxRn":"","mi10MaxRnHrmt":"","hr1MaxRn":"","hr1MaxRnHrmt":"","sumRnDur":"","sumRn":"","maxInsWs":"11.7","maxInsWsWd":"320","maxInsWsHrmt":"0017","maxWs":"7.1","maxWsWd":"320","maxWsHrmt":"0635","avgWs":"2.2","hr24SumRws":"1938","maxWd":"320","avgTd":"-16.6","minRhm":"17","minRhmHrmt":"1041","avgRhm":"24.4","avgPv":"1.7","avgPa":"1019.6","maxPs":"1030.8","maxPsHrmt":"1014","minPs":"1026.7","minPsHrmt":"2322","avgPs":"1028.4","ssDur":"9.9","sumSsHr":"9.2","hr1MaxIcsrHrmt":"1200","hr1MaxIcsr":"2.14","sumGsr":"12.72","ddMefs":"","ddMefsHrmt":"","ddMes":"","ddMesHrmt":"","sumDpthFhsc":"","avgTca":"3.4","avgLmac":"0.4","avgTs":"1.0","minTg":"-9.5","avgCm5Te":"3.3","avgCm10Te":"4.1","avgCm20Te":"5.1","avgCm30Te":"6.2","avgM05Te":"7.0","avgM10Te":"11.6","avgM15Te":"14.7","avgM30Te":"19.4","avgM50Te":"19.8","sumLrgEv":"2.6","sumSmlEv":"3.7","n99Rn":"","iscs":"","sumFogDur":""},
//         {"stnId":"159","stnNm":"부산","tm":"2022-01-02","avgTa":"4.8","minTa":"0.7","minTaHrmt":"0725","maxTa":"11.1","maxTaHrmt":"1402","mi10MaxRn":"","mi10MaxRnHrmt":"","hr1MaxRn":"","hr1MaxRnHrmt":"","sumRnDur":"","sumRn":"","maxInsWs":"7.7","maxInsWsWd":"340","maxInsWsHrmt":"2310","maxWs":"5.0","maxWsWd":"250","maxWsHrmt":"1136","avgWs":"3.0","hr24SumRws":"2623","maxWd":"320","avgTd":"-10.4","minRhm":"18","minRhmHrmt":"0120","avgRhm":"32.9","avgPv":"3.0","avgPa":"1016.1","maxPs":"1026.7","maxPsHrmt":"0001","minPs":"1022.7","minPsHrmt":"1411","avgPs":"1024.7","ssDur":"9.9","sumSsHr":"9.2","hr1MaxIcsrHrmt":"1200","hr1MaxIcsr":"2.06","sumGsr":"12.2","ddMefs":"","ddMefsHrmt":"","ddMes":"","ddMesHrmt":"","sumDpthFhsc":"","avgTca":"0.5","avgLmac":"0.0","avgTs":"3.1","minTg":"-3.2","avgCm5Te":"4.8","avgCm10Te":"4.9","avgCm20Te":"5.5","avgCm30Te":"6.2","avgM05Te":"3.8","avgM10Te":"11.4","avgM15Te":"14.6","avgM30Te":"19.4","avgM50Te":"19.7","sumLrgEv":"2.7","sumSmlEv":"3.8","n99Rn":"","iscs":"","sumFogDur":""}
//       ]},
//       "pageNo":1,
//       "numOfRows":10,
//       "totalCount":2
//     }
//   }
// }