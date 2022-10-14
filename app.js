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
      virtualstartDAY: '',
      virtualstartDAYPlus: '',
      virtualstartTime: '',
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

  beforeCreate() {
  },
  
  created() {
    this.nowTIME()
    this.dateStartEnd()
    console.log("BEFORE AXIOS ACCESS")

    this.weather1to2()
    this.weather3to7()
    this.firstRander()
    console.log(this.resultCalendarRow)
    
  },

  computed() {
    this.YearMonthSelected()
    this.selectDayNum()
  },

  updated() {
    
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
      this.YearMonthSelected() // 달력 리뉴얼
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
      this.YearMonthSelected() // 달력 리뉴얼
    },

    nowTIME() {
      var getDATE = new Date() // 현재 날짜
      var getYEAR = String(getDATE.getFullYear()) // 현재 년도
      var getMonth = String(getDATE.getMonth() + 1) // 현재 월
      var getDAYS = String(getDATE.getDate()) // 현재 일
      var nowDAYS = new Date(getYEAR+"-"+getMonth+"-01").getDay() // 현재 요일
      var nowHour = getDATE.getHours() // 현재 시간
      var nowMin = getDATE.getMinutes() // 현재 분
      this.nowDATE = [getYEAR, getMonth, getDAYS, nowDAYS, nowHour, nowMin] // nowDATE로 현재 년월일 데이터 보내기
      this.HOWDAYS = String(this.monthDAYs[getDATE.getMonth()]) // 이 달의 일 수

      console.log("getDATE: " + getDATE+"\n"+
                  "getYEAR: " + getYEAR+"\n"+
                  "getMonth: " + getMonth+"\n"+
                  "getDAYS: " + getDAYS+"\n"+
                  "nowDAYS: " + nowDAYS+"\n"+
                  "nowHour: " + nowHour+"\n"+
                  "nowMin: " + nowMin+"\n"+
                  "nowDATE: " + this.nowDATE+"\n"+
                  "HOWDAYS: " + this.HOWDAYS)
    },

    selectDayNum() { // 달력의 날짜를 누르면 작동하는 함수
      
      for(i=0; i<7; i++){
        //주간 날씨에 들어가는 모든 기록(index[0]부터 [6]까지) 초기화
        this.selectedWeather[0].tempAvg[i] = '-'
        this.selectedWeather[0].tempMin[i] = '-'
        this.selectedWeather[0].tempMax[i] = '-'
        this.selectedWeather[0].sDate[i] = '-'
        this.selectedWeather[0].weather[i] = '-'
      }

      if(this.selectDATE < 10) {
        //if - 선택한 시기의 시작일자가 한 자리수 일 경우
        this.selectendDATE = Number(this.selectDATE)+6 //마지막 일자는 선택한 날에서 6을 더하고,
        this.selectDATE = '0'+String(this.selectDATE) // 시작일자 앞에 0을 붙인다
      } else {
        //else - 시작일자는 두자리수 이므로 원래대로 출력되고,
        this.selectendDATE = Number(this.selectDATE)+6 //마지막 일자는 선택한 날에서 6을 더한다(if/else 공통)
      }
      // ===========> selectDATE 설정 완료


      if(this.selectendDATE < 10) {
        //선택한 시기의 마지막 일자가 한 자리수 일 경우
        this.selectendDATE = '0' + String(this.selectendDATE)
      } else {
        this.selectendDATE = String(this.selectendDATE)
      }
      // ===========> selectendDATE 설정 완료

      if(Number(this.nowDATE[2]) < Number(this.selectendDATE)){
        //if - 선택한 시기의 마지막 날이 당일을 넘어가는 경우
        var beforeDate = Number(this.nowDATE[2]) - Number(this.selectDATE) // 당일 이전의 일 수
        var midDate = 2 // 당일 및 다음날
        var afterDate = Number(this.selectendDATE) - Number(this.nowDATE[2])-1 // 3일 후부터의 일수
      } else if(Number(this.nowDATE[2])+2 < Number(this.selectDATE)){
        //if - 선택한 시기의 시작일이 당일보다 3일을 초과하는 경우
        var beforeDate = Number(this.nowDATE[2]) - Number(this.selectDATE) //당일 이전의 일 수
        var midDate = 2 // 당일 및 다음날
        var afterDate = Number(this.selectendDATE) - Number(this.nowDATE[2])-1 // 3일 후부터의 일수
      } else {
        // else - 별도의 변수 필요 없음
      }

      var selectedMonth = this.nowDATE[1] // 현재 월 지역변수로 재설정

      if(selectedMonth < 10) {
        //if - 선택한 월이 한 자리수 일 경우
        selectedMonth = '0' + String(selectedMonth) //한 자리수 이므로 0을 붙여 문자로 출력
      } else {
        selectedMonth = String(selectedMonth) // 두 자리수 이므로 그대로 문자로 출력
      }

      this.startDATE = this.nowDATE[0]+selectedMonth+this.selectDATE //API에 들어가는 6자리 시작일자

      if(Number(this.selectDATE) == Number(this.HOWDAYS)) {
        // END01: 선택한 날짜가 그 달의 마지막 날인 경우
        this.endDATE = this.nowDATE[0]+selectedMonth+this.HOWDAYS
        console.log("1: this.selectDATE) == Number(this.HOWDAYS)")
      } 
      else if(Number(this.selectDATE) < Number(this.HOWDAYS)-6) {
        // END02: 선택한 시기(선택한 날짜(1일)+6일=일주일)가 그 달의 마지막 날을 넘어가는 경우
        this.endDATE = this.nowDATE[0]+selectedMonth+this.selectendDATE
        console.log("2: Number(this.selectDATE) < Number(this.HOWDAYS)-6")
      } 
      else {
        // END03: 선택한 시기가 그 달의 마지막 날에서 일주일 이상 차이나는 경우
        this.endDATE = this.nowDATE[0]+selectedMonth+this.HOWDAYS
      }

      

      // ===== 과거 예보 ===== 당일 이전의 기상자료 조회
      
      var weatherApiShort = 'https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&dataCd=ASOS&dateCd=DAY&startDt='+this.startDATE+'&endDt='+this.endDATE+'&stnIds=159'
      axios.get(weatherApiShort)
        .then(data => {
          console.log("AXIOS ACCESS")
          console.log("과거예보 API: "+weatherApiShort)
          console.log("과거예보: "+data.data.response.body.items.item[0].avgTa)
          console.log("HOWDAYS: "+this.HOWDAYS)
          console.log("selectendDATE: "+this.selectendDATE)
          if(this.HOWDAYS < this.selectendDATE){
            var rotateNum = Number(this.HOWDAYS) - Number(this.selectDATE) + 1
            console.log("rotateNum: "+rotateNum)

            for(i=rotateNum; i<7-rotateNum+1; i++){
              this.selectedWeather[0].tempAvg[i] = '-'
              this.selectedWeather[0].tempMin[i] = '-'
              this.selectedWeather[0].tempMax[i] = '-'
              this.selectedWeather[0].sDate[i] = '-'
            }
            for(i=0; i<=rotateNum; i++){
              console.log("i=0; i<=rotateNum; i++")
              this.selectedWeather[0].tempAvg[i] = Math.round(data.data.response.body.items.item[i].avgTa)
              this.selectedWeather[0].tempMin[i] = Math.round(data.data.response.body.items.item[i].minTa)
              this.selectedWeather[0].tempMax[i] = Math.round(data.data.response.body.items.item[i].maxTa)
              this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
            }
          } else {
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

          this.YearMonthSelected()
        })
        .catch(error => {
          console.log("에러 발생 ERROR"+error)
        })

      console.log(this.selectDATE)
      console.log(this.selectendDATE)
      console.log(this.startDATE)
      console.log(this.endDATE)
    },

    leapCheck() {
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
    },

    YearMonthSelected() { // 연도 혹은 월을 바꾼 후 조회를 누르면 달력이 리뉴얼되는 함수
      
      this.resultCalendar.splice(0) // 달력 데이터 전체 삭제

      for(i=0; i < 6; i++){
        this.resultCalendarRow[i].dayNumber.splice(0) // 각 열의 달력 데이터 삭제
      }

      for(i=0; i<7; i++){ // 주간 날씨에 들어갈 선택 날짜 7개 선정
        this.selectedWeather[0].sDate[i] = Number(this.nowDATE[2])+i
      }

      var getYEAR = String(this.nowDATE[0]) // 현재 년도
      var getMonth = String(this.nowDATE[1]) // 현재 월
      this.nowDATE[3] = new Date(getYEAR+"-"+getMonth+"-01").getDay() // 현재 요일
      this.HOWDAYS = String(this.monthDAYs[getMonth-1]) // 선택한 달은 몇 일

      // <===== 윤년 체크하기 START =====>
      this.leapCheck()
      // <===== 윤년 체크하기 END =====>

      // <===== 달력에 들어가는 숫자 데이터 삽입 =====>
      this.calendarDateInsert()
      // <===== 달력에 들어가는 숫자 데이터 삽입 =====>
    },

    calendarDateInsert() {
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
    },

    firstRander() { // 브라우저 로딩 후 달력을 처음 랜더링하는 함수
      
      for(i=0; i<7; i++){
        this.selectedWeather[0].sDate[i] = Number(this.nowDATE[2])+i
      }
      
      // <===== 윤년 체크하기 START =====>
      this.leapCheck()
      // <===== 윤년 체크하기 END =====>

      // <===== 달력에 들어가는 숫자 데이터 삽입 =====>
      this.calendarDateInsert()
      // <===== 달력에 들어가는 숫자 데이터 삽입 =====>
      

      console.log("startDATE: "+this.startDATE)
      console.log("endDATE: "+this.endDATE)
      console.log("remainBlank: "+this.remainBlank)
      console.log(this.resultCalendar)
      console.log(this.leapYear)
      console.log(this.nowDATE)
    },

    dateStartEnd() { //브라우저 첫 접속 시 주간날씨의 날짜범위 설정
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
      console.log("==date START/END 함수=="+"\n"+
                  "startDATE: "+this.startDATE+"\n"+
                  "endDATE: "+this.endDATE+"\n"+
                  "selectDATE: "+this.selectDATE+"\n"+
                  "selectendDATE: "+this.selectendDATE+"\n"+
                  "setDATE: "+this.setDATE)
    },

    weather3to7() { // 브라우저 첫 로딩 후 현재일을 기준으로 3~7일 사이의 날씨를 랜더링하는 함수
      // this.dateStartEnd()

      // ======================================= 당일 부터 3~7일까지의 중기 기온 API ======================================= 

      // ====== 접속 시간에 따른 호출 시간 설정 ======
      if(6 < this.nowDATE[4] <= 18) {
        this.setDATE = String(this.startDATE) + '0600'
        console.log("setDATE: " + this.setDATE)
      } else {
        this.setDATE = String(this.startDATE) + '1800'
        console.log("setDATE: " + this.setDATE)
      }
      
      
      var weatherApi3to10 = 'https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&pageNo=1&numOfRows=10&dataType=json&regId=11H20201&tmFc='+this.setDATE
      
      axios.get(weatherApi3to10)
        .then(data => {
          console.log("중기 기온: AXIOS ACCESS")
          console.log(weatherApi3to10)
          console.log(data.data.response.body.items.item[0].taMin3)
          
          if(this.HOWDAYS < this.selectendDATE){
            this.selectedWeather[0].tempMin.splice(2,5)
            this.selectedWeather[0].tempMax.splice(2,5)
            this.selectedWeather[0].sDate.splice(2,5)

            var rotateNum = Number(this.HOWDAYS) - Number(this.selectDATE) + 1
            for(i=0; i<=rotateNum; i++){
              console.log("this.HOWDAYS < this.selectendDATE ACCESS")
              this.selectedWeather[0].tempMin[i] = '-'
              this.selectedWeather[0].sDate[i] = Number(this.selectDATE)+i
            }
          } else {
            this.selectedWeather[0].tempMin.splice(2,5)
            this.selectedWeather[0].tempMax.splice(2,5)
            this.selectedWeather[0].sDate.splice(2,5)
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
          console.log(this.selectedWeather[0].weather)
        })
        .catch(error => {
          console.log("에러 발생: "+error)
        })

        //===== 공휴일 =====

        if(this.nowDATE[1] < 10) {
          var stringMonth = '0'+String(this.nowDATE[1])
        } else {
          var stringMonth = String(this.nowDATE[1])
        }
        var holidayApi = 'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&solYear='+this.nowDATE[0]+'&solMonth='+stringMonth
        axios.get(holidayApi).then(data => {
          console.log('공휴일 API: '+holidayApi)
          console.log(data.data.response.body.items.item[0].dateName)
        }).catch(error => {
          console.log("에러 발생: "+error)
        })
        
    },

    weather1to2() {
      // ===== 당일 / 모레 ===== (단기예보(구 동네예보) API 사용)
      if(this.nowDATE[4] >= 0 && this.nowDATE[4] <= 2) {
        // 현재 시간이 자정에서 2시 사이라면, (--> 하루 전 23시의 예보(=현재보다 1~3시간 전)를 바탕으로 출력하기 위해 시간 설정)
        var selectDATELocal = this.selectDATE
        var HOWDAYSLocal = this.HOWDAYS

        if(0<Number(this.selectDATE)-1 && Number(this.selectDATE)-1 < 10) {
          // 전날이 10보다 작으면서 0보다 큰 경우,
          selectDATELocal = '0'+String(Number(this.selectDATE)-1) // 날짜 앞에 0을 붙인다
        } else if(Number(this.selectDATE)-1 == 0) {
        // 당일이 1일인 경우,

        var nowMonth = Number(nowDATE[1])-2 // 적용 월은 직전 월
        if(nowMonth < 0) {
          // 현재 월이 1월이었던 경우,
          HOWDAYSLocal = this.monthDAYs[11] //12월의 마지막 일수를 적용
        } else {
          HOWDAYSLocal = this.monthDAYs[nowMonth] // 직전 월 그대로 적용
        }
        
          selectDATELocal = String(HOWDAYSLocal) // 적용 일은 직전 월의 마지막 날

          var selectYEARLocal = Number(this.nowDATE[0])
          var selectedMonth = Number(this.nowDATE[1])-1
          if(0<selectedMonth && selectedMonth<10) {
            // if - 직전 월이 0보다 크고 10보다 작다면,
            selectedMonth = '0' + String(selectedMonth) // selectedMonth 앞에 0 붙일 것
          } else if(selectedMonth == 0){
            // else if - 값이 0이라면 직전 월은 12월이고, 연도 또한 전 년도로 변경
            selectedMonth = 12
            selectYEARLocal = String(Number(this.nowDATE[0])-1)
          }else {
            // else -  10보다 크면 직전 월은 그대로 사용한다
            selectedMonth = String(selectedMonth)
            selectYEARLocal = String(this.nowDATE[0])
          }
        }
  
        startDATELocal = selectYEARLocal+selectedMonth+selectDATELocal
        this.virtualstartDAY = startDATELocal
        this.virtualstartDAYNone = startDATELocal
        this.virtualstartDAYPlus = this.startDATE
        this.virtualstartTime = "2300"

        this.setDATE = startDATELocal+'2300' // 자정~새벽 2시 사이 = 전날 밤 11시 데이터부터 호출
        console.log("setDATE: " + this.setDATE)
      } else {
        this.setDATE = this.startDATE+'0200'
        this.virtualstartDAY = this.startDATE+'0200'
        this.virtualstartDAYNone = this.startDATE
        this.virtualstartDAYPlus = String(this.nowDATE[0])+String(this.nowDATE[1])+String(Number(this.nowDATE[2])+1)
        this.virtualstartTime = "0200"
        console.log("setDATE: " + this.setDATE) // 새벽 2시 이후부터 오후 11시 까지 = 당일 새벽 2시 데이터 호출
      } 
      // else if(this.nowDATE[4] >= 6 && this.nowDATE[4] <= 8) {
      //   this.setDATE = startDATELocal+'0500'
      //   console.log("setDATE: " + this.setDATE)
      // } else if(this.nowDATE[4] >= 9 && this.nowDATE[4] <= 11) {
      //   this.setDATE = startDATELocal+'0800'
      //   console.log("setDATE: " + this.setDATE)
      // } else if(this.nowDATE[4] >= 12 && this.nowDATE[4] <= 14) {
      //   this.setDATE = startDATELocal+'1100'
      //   console.log("setDATE: " + this.setDATE)
      // } else if(this.nowDATE[4] >= 15 && this.nowDATE[4] <= 17) {
      //   this.setDATE = startDATELocal+'1400'
      //   console.log("setDATE: " + this.setDATE)
      // } else if(this.nowDATE[4] >= 18 && this.nowDATE[4] <= 20) {
      //   this.setDATE = startDATELocal+'1700'
      //   console.log("setDATE: " + this.setDATE)
      // } else if(this.nowDATE[4] >= 21 && this.nowDATE[4] <= 23) {
      //   this.setDATE = startDATELocal+'2000'
      //   console.log("setDATE: " + this.setDATE)
      // }

      var weatherApi1to2 = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=UmNcoQgZJ%2FJt4NzOju%2BLwwnLlK0AIuRFcJSDIH3QP32%2B3MBj7yYcL2RTGOkzKskBph1h3mlsUQZwcotcHSX1GA%3D%3D&pageNo=1&numOfRows=610&dataType=json&base_date="+this.setDATE+"&base_time=0200&nx=98&ny=77"
      axios.get(weatherApi1to2)
        .then(data => {
          console.log("weatherApi1to2 ACCESS")
          console.log(weatherApi1to2)
          console.log(data.data.response.body.items.item[12].category)
          console.log("None: "+this.virtualstartDAYNone)
          console.log("Plus: "+this.virtualstartDAYPlus)
          console.log(data)

          var todaySky = data.data.response.body.items.item[5].fcstValue // 관측 현재의 하늘 상태

          if(0 <= todaySky || todaySky <= 5) { // 숫자로 표현되는 하늘상태를 한글로 변환
            todaySky = "맑음"
          } else if(6 <= todaySky || todaySky <= 8) {
            todaySky = "구름많음"
          } else {
            todaySky = "흐림"
          }

          this.selectedWeather[0].tempAvg[0] = Math.round(data.data.response.body.items.item[0].fcstValue) // 관측 현재의 기온
          this.selectedWeather[0].weather[0] = todaySky // 한글로 변환된 하늘 상태

          for(i=0; i<=600; i++) {
            if(data.data.response.body.items.item[i].category === 'SKY' 
            && data.data.response.body.items.item[i].fcstDate === this.virtualstartDAYPlus
            && data.data.response.body.items.item[i].fcstTime === "1200"){
              var tomorrowSky = data.data.response.body.items.item[i].fcstValue

              if(0 <= tomorrowSky || tomorrowSky <= 5) { // 숫자로 표현되는 하늘상태를 한글로 변환
                tomorrowSky = "맑음"
              } else if(6 <= tomorrowSky || tomorrowSky <= 8) {
                tomorrowSky = "구름많음"
              } else {
                tomorrowSky = "흐림"
              }

              this.selectedWeather[0].weather[1] = tomorrowSky

              console.log("PLUS/SKY/if문: "+i+"번째"+"\n"
                          +this.selectedWeather[0].weather[1]+"\n"
                          +String(this.selectedWeather[0].weather))
            } else if(data.data.response.body.items.item[i].category === 'TMP' 
            && data.data.response.body.items.item[i].fcstDate === this.virtualstartDAYPlus
            && data.data.response.body.items.item[i].fcstTime === "1200") {
              this.selectedWeather[0].tempAvg[1] = Math.round(data.data.response.body.items.item[i].fcstValue)
              console.log("PLUS/TMP/else-if문: "+i+"번째"+"\n"
                          +this.selectedWeather[0].tempAvg[1]+"\n"
                          +String(this.selectedWeather[0].tempAvg))
            }
          }

          for(i=0; i<=600; i++) {
            if(data.data.response.body.items.item[i].category === 'TMN' && data.data.response.body.items.item[i].fcstDate === this.virtualstartDAYNone){
              this.selectedWeather[0].tempMin[0] = Math.round(data.data.response.body.items.item[i].fcstValue)
              console.log("None/TMN/if문: "+i+"번째"+"\n"
                          +this.selectedWeather[0].tempMin[0]+"\n"
                          +String(this.selectedWeather[0].tempMin))
            } else if(data.data.response.body.items.item[i].category === 'TMX' && data.data.response.body.items.item[i].fcstDate === this.virtualstartDAYNone) {
              this.selectedWeather[0].tempMax[0] = Math.round(data.data.response.body.items.item[i].fcstValue)
              console.log("None/TMX/else-if문: "+i+"번째"+"\n"
                          +this.selectedWeather[0].tempMax[0]+"\n"
                          +String(this.selectedWeather[0].tempMax))
            } else if(data.data.response.body.items.item[i].category === 'TMN' && data.data.response.body.items.item[i].fcstDate === this.virtualstartDAYPlus) {
              this.selectedWeather[0].tempMin[1] = Math.round(data.data.response.body.items.item[i].fcstValue)
              console.log("Plus/TMN/else-if문: "+i+"번째"+"\n"
                          +this.selectedWeather[0].tempMin[1]+"\n"
                          +String(this.selectedWeather[0].tempMin))
            } else if(data.data.response.body.items.item[i].category === 'TMX' && data.data.response.body.items.item[i].fcstDate === this.virtualstartDAYPlus) {
              this.selectedWeather[0].tempMax[1] = Math.round(data.data.response.body.items.item[i].fcstValue)
              console.log("Plus/TMX/else-if문: "+i+"번째"+"\n"
                          +this.selectedWeather[0].tempMax[1]+"\n"
                          +String(this.selectedWeather[0].tempMax))
            } 
            // console.log(i+"번째 값: 해당없음" )
          }

          console.log("평균기온: "+String(this.selectedWeather[0].tempAvg)+"\n"+
                      "최고기온: "+String(this.selectedWeather[0].tempMax)+"\n"+
                      "최저기온: "+String(this.selectedWeather[0].tempMin)+"\n"+
                      "하늘상태: "+String(this.selectedWeather[0].weather)+"\n")

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