const app = new Vue({
  el: '#app',
  data() {
    return{
      nowDATE: [2022, 2, 5, 4, 18, 12],//접속일시: [년, 월, 일, 요일, 시간, 분]
      selectDATE: '',
      selectMonth: '',
      selectendDATE: '',
      startDATE: '',
      endDATE: '',
      setDATE: '',
      remainBlank: '',
      monthNum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      dayList: ['일', '월', '화', '수', '목', '금', '토'],
      monthDAYs: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      HOWDAYS: '',
      resultCalendar: [],
      resultCalendarRow: [{dayNumber: [], weather: [], holiday: []}, {dayNumber: [], weather: [], holiday: []}, {dayNumber: [], weather: [], holiday: []}, {dayNumber: [], weather: [], holiday: []}, {dayNumber: [], weather: [], holiday: []}, {dayNumber: [], weather: [], holiday: []}, ],
      leapYear: false,
      selectedWeather: [{sDate:['-', '-', '-', '-', '-', '-', '-'], weather:['-', '-', '-', '-', '-', '-', '-'], tempMin:['-', '-', '-', '-', '-', '-', '-'], tempMax:['-', '-', '-', '-', '-', '-', '-'], tempAvg:['-', '-', '-', '-', '-', '-', '-'] }],
    }
  },
  created() {
    this.nowTIME()
    
    console.log("BEFORE AXIOS ACCESS")
    this.insertWeather()
    this.leapChecked()
    console.log(this.resultCalendarRow)
  },

  computed() {
    this.YearMonthSelected()
  },

  methods: {
    monthMOVER() {
      if(this.nowDATE[1] == 12){
        this.nowDATE[1] = 1
        this.nowDATE[0]++

        console.log("nowDATE: " + this.nowDATE)
        console.log("remainBlank: "+this.remainBlank)
        console.log(this.resultCalendar)
        console.log(this.leapYear)
      } else {
        this.nowDATE[1]++

        console.log("nowDATE: " + this.nowDATE)
        console.log("remainBlank: "+this.remainBlank)
        console.log(this.resultCalendar)
        console.log(this.leapYear)
      }
      this.YearMonthSelected()
    },

    monthMOVEL() {
      if(this.nowDATE[1] == 1){
        this.nowDATE[1] = 12
        this.nowDATE[0]--

        console.log("nowDATE: " + this.nowDATE)
        console.log("remainBlank: "+this.remainBlank)
        console.log(this.resultCalendar)
        console.log(this.leapYear)
      } else {
        this.nowDATE[1]--

        console.log("nowDATE: " + this.nowDATE)
        console.log("remainBlank: "+this.remainBlank)
        console.log(this.resultCalendar)
        console.log(this.leapYear)
      }
      this.YearMonthSelected()
    },

    nowTIME() {
      var getDATE = new Date() // 현재 날짜
      var getYEAR = String(getDATE.getFullYear()) // 현재 년도
      var getMonth = String(getDATE.getMonth() + 1) // 현재 월
      var getDAYS = String(getDATE.getDate()) // 현재 일
      var nowDAYS = new Date(getYEAR+"-"+getMonth+"-01").getDay() // 현재 요일
      var nowHour = getDATE.getHours()
      var nowMin = getDATE.getMinutes()
      this.nowDATE = [getYEAR, getMonth, getDAYS, nowDAYS, nowHour, nowMin] // nowDATE로 현재 년월일 데이터 보내기
      this.HOWDAYS = String(this.monthDAYs[getDATE.getMonth()])

      console.log("getDATE: " + getDATE)
      console.log("getYEAR: " + getYEAR)
      console.log("getMonth: " + getMonth)
      console.log("getDAYS: " + getDAYS)
      console.log("nowDAYS: " + nowDAYS)
      console.log("nowHour: " + nowHour)
      console.log("nowMin: " + nowMin)
      console.log("nowDATE: " + this.nowDATE)
      console.log("HOWDAYS: " + this.HOWDAYS)
    },

    selectDayNum() {
      for(i=0; i<6; i++){
        this.selectedWeather[0].tempAvg[i] = '-'
        this.selectedWeather[0].tempMin[i] = '-'
        this.selectedWeather[0].tempMax[i] = '-'
        this.selectedWeather[0].sDate[i] = '-'
        this.selectedWeather[0].weather[i] = '-'
      }

      if(this.selectDATE < 10) {
        this.selectendDATE = Number(this.selectDATE)+6
        this.selectDATE = '0'+String(this.selectDATE)
      } else {
        this.selectendDATE = Number(this.selectDATE)+6
      }

      if(this.selectendDATE < 10) {
        this.selectendDATE = '0' + String(this.selectendDATE)
      } else {
        this.selectendDATE = String(this.selectendDATE)
      }

      var selectedMonth = this.nowDATE[1]

      if(selectedMonth < 10) {
        selectedMonth = '0' + String(selectedMonth)
      } else {
        selectedMonth = String(selectedMonth)
      }

      this.startDATE = this.nowDATE[0]+selectedMonth+this.selectDATE

      if(Number(this.selectDATE) == Number(this.HOWDAYS)) {
        this.endDATE = this.nowDATE[0]+selectedMonth+this.HOWDAYS
        console.log("1: this.selectDATE) == Number(this.HOWDAYS)")
      } 
      else if(Number(this.selectDATE) < Number(this.HOWDAYS)-6) {
        this.endDATE = this.nowDATE[0]+selectedMonth+this.selectendDATE
        console.log("2: Number(this.selectDATE) < Number(this.HOWDAYS)-6")
      } 
      else {
        this.endDATE = this.nowDATE[0]+selectedMonth+this.HOWDAYS
      }

      // ===== 단기 예보 ===== 당일 이전의 기상자료 조회
      
      var weatherApiShort = 'https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&dataCd=ASOS&dateCd=DAY&startDt='+this.startDATE+'&endDt='+this.endDATE+'&stnIds=159'
      axios.get(weatherApiShort)
        .then(data => {
          console.log("AXIOS ACCESS")
          console.log("단기예보 API: "+weatherApiShort)
          console.log("단기예보: "+data.data.response.body.items.item[0].avgTa)
          console.log("HOWDAYS: "+this.HOWDAYS)
          console.log("selectendDATE: "+this.selectendDATE)
          if(this.HOWDAYS < this.selectendDATE){
            // this.selectedWeather[0].tempAvg.splice(0)
            // this.selectedWeather[0].tempMin.splice(0)
            // this.selectedWeather[0].tempMax.splice(0)
            // this.selectedWeather[0].sDate.splice(0)
            var rotateNum = Number(this.HOWDAYS) - Number(this.selectDATE) + 1
            console.log("rotateNum: "+rotateNum)
            for(i=0; i<=rotateNum; i++){
              console.log("i=0; i<=rotateNum; i++")
              this.selectedWeather[0].tempAvg[i] = Math.round(data.data.response.body.items.item[i].avgTa)
              this.selectedWeather[0].tempMin[i] = Math.round(data.data.response.body.items.item[i].minTa)
              this.selectedWeather[0].tempMax[i] = Math.round(data.data.response.body.items.item[i].maxTa)
              this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
            }
          } else {
            // this.selectedWeather[0].tempAvg.splice(0)
            // this.selectedWeather[0].tempMin.splice(0)
            // this.selectedWeather[0].tempMax.splice(0)
            // this.selectedWeather[0].sDate.splice(0)
            for(i=0; i<7; i++) {
              console.log("i=0; i<7; i++")
              this.selectedWeather[0].tempAvg[i] = Math.round(data.data.response.body.items.item[i].avgTa)
              this.selectedWeather[0].tempMin[i] = Math.round(data.data.response.body.items.item[i].minTa)
              this.selectedWeather[0].tempMax[i] = Math.round(data.data.response.body.items.item[i].maxTa)
              this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
            }
          }
          
          console.log(String(this.selectedWeather[0].sDate))
          console.log(String(this.selectedWeather[0].tempAvg))
          console.log(String(this.selectedWeather[0].tempMin))
          console.log(String(this.selectedWeather[0].tempMax))
        })
        .catch(error => {
          console.log("에러 발생 ERROR"+error)
        })

        // ===== 중기 예보 ===== 당일 이후의 기상자료 조회
        // if(6 < this.nowHour <= 18) {
        //   this.setDATE = this.startDATE + '0600'
        // } else {
        //   this.setDATE = this.startDATE + '1800'
        // }
        // // this.selectedWeather[0].tempMin.splice(0)
        
        // var weatherApi3to10 = 'https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&pageNo=1&numOfRows=10&dataType=json&regId=11H20201&tmFc='+this.setDATE
        // axios.get(weatherApi3to10)
        //   .then(data => {
        //     console.log("AXIOS ACCESS")
        //     console.log(weatherApi3to10)
        //     console.log(data.data.response.body.items.item[0].taMin3)
            
        //     if(this.HOWDAYS < this.selectendDATE){
        //       this.selectedWeather[0].tempMin.splice(0)
        //       this.selectedWeather[0].tempMax.splice(0)
        //       this.selectedWeather[0].tempAvg.splice(0)
        //       var rotateNum = Number(this.HOWDAYS) - Number(this.selectDATE) + 1
        //       for(i=0; i<=rotateNum; i++){
        //         console.log("this.HOWDAYS < this.selectendDATE ACCESS")
        //         this.selectedWeather[0].tempMin[i] = '-'
        //         this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
        //       }
        //     } else {
        //       this.selectedWeather[0].tempMin.splice(0)
        //       this.selectedWeather[0].tempMax.splice(0)
        //       this.selectedWeather[0].tempAvg.splice(0)
        //       for(i=2; i<7; i++){
        //         console.log("i=2; i<7; i++ ACCESS")
        //         this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
        //       }
        //       this.selectedWeather[0].tempMin[2] = data.data.response.body.items.item[0].taMin3
        //       this.selectedWeather[0].tempMin[3] = data.data.response.body.items.item[0].taMin4
        //       this.selectedWeather[0].tempMin[4] = data.data.response.body.items.item[0].taMin5
        //       this.selectedWeather[0].tempMin[5] = data.data.response.body.items.item[0].taMin6
        //       this.selectedWeather[0].tempMin[6] = data.data.response.body.items.item[0].taMin7
        //       this.selectedWeather[0].tempMax[2] = data.data.response.body.items.item[0].taMax3
        //       this.selectedWeather[0].tempMax[3] = data.data.response.body.items.item[0].taMax4
        //       this.selectedWeather[0].tempMax[4] = data.data.response.body.items.item[0].taMax5
        //       this.selectedWeather[0].tempMax[5] = data.data.response.body.items.item[0].taMax6
        //       this.selectedWeather[0].tempMax[6] = data.data.response.body.items.item[0].taMax7
        //     }
            
        //     console.log(this.selectedWeather[0].sDate)
        //     console.log(this.selectedWeather[0].tempMin)
        //     console.log(this.selectedWeather[0].tempMax)
        //   })
        //   .catch(error => {
        //     console.log("에러 발생 ERROR"+error)
        //   })

      console.log(this.selectDATE)
      console.log(this.selectendDATE)
      console.log(this.startDATE)
      console.log(this.endDATE)
    },

    YearMonthSelected() {
      
      for(i=0; i < 6; i++){
        this.resultCalendar.splice(0)
        this.resultCalendarRow[i].dayNumber.splice(0)
      }

      var getYEAR = String(this.nowDATE[0]) // 현재 년도
      var getMonth = String(this.nowDATE[1]) // 현재 월
      // var getDAYS = String(this.nowDATE[2]) // 현재 일
      this.nowDATE[3] = new Date(getYEAR+"-"+getMonth+"-01").getDay() // 현재 요일
      this.HOWDAYS = String(this.monthDAYs[getMonth-1]) // 선택한 달은 몇 일

      // <===== 윤년 체크하기 START =====>
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
      // <===== 윤년 체크하기 END =====>

      // <===== 달력에 들어가는 숫자 데이터 삽입 =====>
      for(let i=0; i<this.nowDATE[3]; i++) {
        this.resultCalendar.push("")
      }// 선택한 달의 1일에 해당하는 요일보다 1일 적게 빈칸을 앞쪽에 삽입

      for(let i=1; i<=this.HOWDAYS; i++) {
        this.resultCalendar.push(String(i))
      }// 1일 부터 이번달 날짜수(this.HOWDAYS) 만큼 숫자 삽입

      this.remainBlank = 7 - (this.resultCalendar.length%7)
      for(let i=1; i<this.remainBlank; i++) {
        this.resultCalendar.push("")
      }// 선택한 달의 마지막 주(7일)에서 채워진 날짜를 뺀 만큼을 빈칸으로 삽입

      for(let i=0; i<=6; i++) {
        this.resultCalendarRow[0].dayNumber[i] = this.resultCalendar[i]
      }
      for(let i=7; i<=13; i++) {
        this.resultCalendarRow[1].dayNumber[i-7] = this.resultCalendar[i]
      }
      for(let i=14; i<=20; i++) {
        this.resultCalendarRow[2].dayNumber[i-14] = this.resultCalendar[i]
      }
      for(let i=21; i<=27; i++) {
        this.resultCalendarRow[3].dayNumber[i-21] = this.resultCalendar[i]
      }
      for(let i=28; i<=34; i++) {
        this.resultCalendarRow[4].dayNumber[i-28] = this.resultCalendar[i]
      }
      for(let i=35; i<=41; i++) {
        this.resultCalendarRow[5].dayNumber[i-35] = this.resultCalendar[i]
      }
      
      console.log("remainBlank: "+this.remainBlank)
      console.log(this.resultCalendar)
      console.log(this.leapYear)
      console.log(this.nowDATE)
    },

    leapChecked() {
      for(i=0; i<7; i++){
        this.selectedWeather[0].sDate[i] = Number(this.nowDATE[2])+i
      }
      
      // <===== 윤년 체크하기 START =====>
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
      // <===== 윤년 체크하기 END =====>

      
      // <===== 달력에 들어가는 숫자 데이터 삽입 =====>
      for(let i=0; i<this.nowDATE[3]; i++) {
        this.resultCalendar.push("")
      }// 선택한 달의 1일에 해당하는 요일보다 1일 적게 빈칸을 앞쪽에 삽입

      for(let i=1; i<=this.HOWDAYS; i++) {
        this.resultCalendar.push(String(i))
      }// 1일 부터 이번달 날짜수(this.HOWDAYS) 만큼 숫자 삽입

      this.remainBlank = 7 - (this.resultCalendar.length%7)
      for(let i=1; i<this.remainBlank; i++) {
        this.resultCalendar.push("")
      }// 선택한 달의 마지막 주(7일)에서 채워진 날짜를 뺀 만큼을 빈칸으로 삽입
      
      for(let i=0; i<=6; i++) {
        this.resultCalendarRow[0].dayNumber[i] = this.resultCalendar[i]
      }
      for(let i=7; i<=13; i++) {
        this.resultCalendarRow[1].dayNumber[i-7] = this.resultCalendar[i]
      }
      for(let i=14; i<=20; i++) {
        this.resultCalendarRow[2].dayNumber[i-14] = this.resultCalendar[i]
      }
      for(let i=21; i<=27; i++) {
        this.resultCalendarRow[3].dayNumber[i-21] = this.resultCalendar[i]
      }
      for(let i=28; i<=34; i++) {
        this.resultCalendarRow[4].dayNumber[i-28] = this.resultCalendar[i]
      }
      for(let i=35; i<=41; i++) {
        this.resultCalendarRow[5].dayNumber[i-35] = this.resultCalendar[i]
      }

      console.log("startDATE: "+this.startDATE)
      console.log("endDATE: "+this.endDATE)
      console.log("remainBlank: "+this.remainBlank)
      console.log(this.resultCalendar)
      console.log(this.leapYear)
      console.log(this.nowDATE)

      
    },

    insertWeather() {
      this.selectDATE = this.nowDATE[2] //시작 시 첫 selectDATE 설정

      // ===== START / END DATE 설정 =====
      if(this.selectDATE < 10) {
        this.selectendDATE = Number(this.selectDATE)+6
        this.selectDATE = '0'+this.selectDATE
      } else {
        this.selectendDATE = Number(this.selectDATE)+6
      }

      if(this.selectendDATE < 10) {
        this.selectendDATE = '0' + String(this.selectendDATE)
      } else {
        this.selectendDATE = String(this.selectendDATE)
      }

      var selectedMonth = this.nowDATE[1]

      if(selectedMonth < 10) {
        selectedMonth = '0' + String(selectedMonth)
      } else {
        selectedMonth = String(selectedMonth)
      }

      this.startDATE = this.nowDATE[0]+selectedMonth+this.selectDATE
      this.endDATE = this.startDATE
      // ===== START / END DATE 설정 =====

      console.log("startDATE: "+this.startDATE)
      console.log("endDATE: "+this.endDATE)
      console.log("selectDATE: "+this.selectDATE)
      console.log("selectendDATE: "+this.selectendDATE)
      console.log("setDATE: "+this.setDATE)

      if(6 < this.nowDATE[4] <= 18) {
        this.setDATE = String(this.startDATE) + '0600'
        console.log("setDATE: " + this.setDATE)
      } else {
        this.setDATE = String(this.startDATE) + '1800'
        console.log("setDATE: " + this.setDATE)
      }
      // this.selectedWeather[0].tempMin.splice(0)
      
      
      var weatherApi3to10 = 'https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&pageNo=1&numOfRows=10&dataType=json&regId=11H20201&tmFc='+this.setDATE
      

      axios.get(weatherApi3to10)
        .then(data => {
          console.log("중기 기온: AXIOS ACCESS")
          console.log(weatherApi3to10)
          console.log(data.data.response.body.items.item[0].taMin3)
          
          if(this.HOWDAYS < this.selectendDATE){
            this.selectedWeather[0].tempMin.splice(2,5)
            this.selectedWeather[0].tempMax.splice(2,5)
            var rotateNum = Number(this.HOWDAYS) - Number(this.selectDATE) + 1
            for(i=0; i<=rotateNum; i++){
              console.log("this.HOWDAYS < this.selectendDATE ACCESS")
              this.selectedWeather[0].tempMin[i] = '-'
              this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
            }
          } else {
            this.selectedWeather[0].tempMin.splice(2,5)
            this.selectedWeather[0].tempMax.splice(2,5)
            for(i=2; i<7; i++){
              console.log("i=2; i<7; i++ ACCESS")
              this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
            }
            this.selectedWeather[0].tempMin[2] = data.data.response.body.items.item[0].taMin3
            this.selectedWeather[0].tempMin[3] = data.data.response.body.items.item[0].taMin4
            this.selectedWeather[0].tempMin[4] = data.data.response.body.items.item[0].taMin5
            this.selectedWeather[0].tempMin[5] = data.data.response.body.items.item[0].taMin6
            this.selectedWeather[0].tempMin[6] = data.data.response.body.items.item[0].taMin7
            this.selectedWeather[0].tempMax[2] = data.data.response.body.items.item[0].taMax3
            this.selectedWeather[0].tempMax[3] = data.data.response.body.items.item[0].taMax4
            this.selectedWeather[0].tempMax[4] = data.data.response.body.items.item[0].taMax5
            this.selectedWeather[0].tempMax[5] = data.data.response.body.items.item[0].taMax6
            this.selectedWeather[0].tempMax[6] = data.data.response.body.items.item[0].taMax7
          }
          
          console.log("sDate: " + this.selectedWeather[0].sDate)
          console.log("tempMin: " + this.selectedWeather[0].tempMin)
          console.log("tempMax: " + this.selectedWeather[0].tempMax)
        })
        .catch(error => {
          console.log("에러 발생 ERROR"+error)
        })

        // ===== 중기 하늘 상태 =====
        var weatherApi3to10SKY = 'https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&pageNo=1&numOfRows=10&dataType=json&regId=11H20000&tmFc='+this.setDATE
      axios.get(weatherApi3to10SKY)
        .then(data => {
          console.log("중기 하늘: AXIOS ACCESS")
          console.log(weatherApi3to10SKY)
          console.log(data.data.response.body.items.item[0].wf3Pm)
          
          if(this.HOWDAYS < this.selectendDATE){
            this.selectedWeather[0].weather.splice(2,5)
            var rotateNum = Number(this.HOWDAYS) - Number(this.selectDATE) + 1
            for(i=0; i<=rotateNum; i++){
              console.log("this.HOWDAYS < this.selectendDATE ACCESS")
              this.selectedWeather[0].weather[i] = '-'
            }
          } else {
            this.selectedWeather[0].weather.splice(2,5)
            for(i=2; i<7; i++){
              console.log("i=2; i<7; i++ ACCESS")
              // this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
            }
            this.selectedWeather[0].weather[2] = data.data.response.body.items.item[0].wf3Pm
            this.selectedWeather[0].weather[3] = data.data.response.body.items.item[0].wf4Pm
            this.selectedWeather[0].weather[4] = data.data.response.body.items.item[0].wf5Pm
            this.selectedWeather[0].weather[5] = data.data.response.body.items.item[0].wf6Pm
            this.selectedWeather[0].weather[6] = data.data.response.body.items.item[0].wf7Pm
          }
          
          console.log(this.selectedWeather[0].sDate)
          console.log(this.selectedWeather[0].tempMin)
          console.log(this.selectedWeather[0].tempMax)
          console.log(this.selectedWeather[0].weather)
        })
        .catch(error => {
          console.log("에러 발생 ERROR"+error)
        })


        // ===== 당일 / 모레 =====
      //   if(this.nowDATE[4] >= 0 && this.nowDATE[4] <= 2) {
      //     this.setDATE = this.startDATE+'2300'
      //     console.log("setDATE: " + this.setDATE)
      //   } else if(this.nowDATE[4] >= 3 && this.nowDATE[4] <= 5) {
      //     this.setDATE = this.startDATE+'0200'
      //     console.log("setDATE: " + this.setDATE)
      //   } else if(this.nowDATE[4] >= 6 && this.nowDATE[4] <= 8) {
      //     this.setDATE = this.startDATE+'0500'
      //     console.log("setDATE: " + this.setDATE)
      //   } else if(this.nowDATE[4] >= 9 && this.nowDATE[4] <= 11) {
      //     this.setDATE = this.startDATE+'0800'
      //     console.log("setDATE: " + this.setDATE)
      //   } else if(this.nowDATE[4] >= 12 && this.nowDATE[4] <= 14) {
      //     this.setDATE = this.startDATE+'1100'
      //     console.log("setDATE: " + this.setDATE)
      //   } else if(this.nowDATE[4] >= 15 && this.nowDATE[4] <= 17) {
      //     this.setDATE = this.startDATE+'1400'
      //     console.log("setDATE: " + this.setDATE)
      //   } else if(this.nowDATE[4] >= 18 && this.nowDATE[4] <= 20) {
      //     this.setDATE = this.startDATE+'1700'
      //     console.log("setDATE: " + this.setDATE)
      //   } else if(this.nowDATE[4] >= 21 && this.nowDATE[4] <= 23) {
      //     this.setDATE = this.startDATE+'2000'
      //     console.log("setDATE: " + this.setDATE)
      //   }



      // var resultData = data?.slice(0, 12);
      // console.log("resultData: " + resultData)

      // var weathertmp = resultData?.filter(filterData => filterData.category === 'TMP')[0]?.fcstValue;
      // var weathertmn = resultData?.filter(filterData => filterData.category === 'TMN')[0]?.fcstValue;
      // var weathertmx = resultData?.filter(filterData => filterData.category === 'TMX')[0]?.fcstValue;
      // var weathersky = resultData?.filter(filterData => filterData.category === 'SKY')[0]?.fcstValue;
      // console.log("TMP: "+weathertmp)
      // console.log("TMN: "+weathertmn)
      // console.log("TMX: "+weathertmx)
      // console.log("SKY: "+weathersky)


      // let result = []

      // for (let i = 0; i < data?.length; i += 12) {
      //     if (result.length > 2 || data.length < 0) {
      //         return
      //     } else {
      //             var resultData = data?.slice(i, i + 12);
      //             console.log(resultData)

      //             var fcstTime = resultData[0].fcstTime.slice(0, 2);
      //             var pop = resultData?.filter(filterData => filterData.category === 'TMP')[0]?.fcstValue;
      //             var tmp = resultData?.filter(filterData => filterData.category === 'TMN')[0]?.fcstValue;
      //             var tmp = resultData?.filter(filterData => filterData.category === 'TMX')[0]?.fcstValue;
      //             var tmp = resultData?.filter(filterData => filterData.category === 'SKY')[0]?.fcstValue;
      //             //ForecastSky는 enum
      //             result.push({
      //                 fcstTime,
      //                 pop,
      //                 tmp,
      //                 sky
      //             })
              
      //       }
      //     }        
      //     console.log("결과: "+result)
              

      //   var weatherApi1to2 = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&pageNo=1&numOfRows=1000&dataType=json&base_date="+this.setDATE+"&base_time=0200&nx=98&ny=77"
      // axios.get(weatherApi1to2)
      //   .then(data => {
      //     console.log("AXIOS ACCESS")
      //     console.log(weatherApi1to2)
      //     console.log("당일 기온: " + data.data.response.body.items.item[0].taMin3)
          
      //     // if(this.HOWDAYS < this.selectendDATE){
      //     //   this.selectedWeather[0].tempMin.splice(0,2)
      //     //   this.selectedWeather[0].tempMax.splice(0,2)
      //     //   this.selectedWeather[0].tempAvg.splice(0,2)
      //     //   var rotateNum = Number(this.HOWDAYS) - Number(this.selectDATE) + 1
      //     //   for(i=0; i<=rotateNum; i++){
      //     //     console.log("this.HOWDAYS < this.selectendDATE ACCESS")
      //     //     this.selectedWeather[0].tempMin[i] = '-'
      //     //     this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
      //     //   }
      //     // } else {
      //     //   this.selectedWeather[0].tempMin.splice(0,2)
      //     //   this.selectedWeather[0].tempMax.splice(0,2)
      //     //   this.selectedWeather[0].tempAvg.splice(0,2)
      //     //   for(i=2; i<7; i++){
      //     //     console.log("i=2; i<7; i++ ACCESS")
      //     //     this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
      //     //   }
      //     //   this.selectedWeather[0].tempMin[2] = data.data.response.body.items.item[0].taMin3
      //     //   this.selectedWeather[0].tempMin[3] = data.data.response.body.items.item[0].taMin4
      //     //   this.selectedWeather[0].tempMin[4] = data.data.response.body.items.item[0].taMin5
      //     //   this.selectedWeather[0].tempMin[5] = data.data.response.body.items.item[0].taMin6
      //     //   this.selectedWeather[0].tempMin[6] = data.data.response.body.items.item[0].taMin7
      //     //   this.selectedWeather[0].tempMax[2] = data.data.response.body.items.item[0].taMax3
      //     //   this.selectedWeather[0].tempMax[3] = data.data.response.body.items.item[0].taMax4
      //     //   this.selectedWeather[0].tempMax[4] = data.data.response.body.items.item[0].taMax5
      //     //   this.selectedWeather[0].tempMax[5] = data.data.response.body.items.item[0].taMax6
      //     //   this.selectedWeather[0].tempMax[6] = data.data.response.body.items.item[0].taMax7
      //     // }
          
      //     console.log(this.selectedWeather[0].sDate)
      //     console.log(this.selectedWeather[0].tempMin)
      //     console.log(this.selectedWeather[0].tempMax)
      //   })
      //   .catch(error => {
      //     console.log("에러 발생 ERROR"+error)
      //   })
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