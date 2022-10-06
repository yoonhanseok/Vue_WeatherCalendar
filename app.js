const app = new Vue({
  el: '#app',
  data() {
    return{
      nowDATE: [2022, 10, 5],
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
      localCODE: [],
      openweatherURL: '',
      // selectedDate: null
    }
  },
  mounted() {
    this.leapChecked()
    this.insertWeather()
  },

  methods: {
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
      navigator.geolocation.getCurrentPosition(function locationInfo(pos) {
        var latitude = pos.coords.latitude
        var longitude = pos.coords.longitude
        const openWeatherKey = "2f9208d55a53fee47a90364a43a9ef73"
        var locationURL = "https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid="+openWeatherKey+"&lang=kr&units=metric"
        
        this.localCODE = [latitude, longitude]
        this.openweatherURL = locationURL
        console.log(this.localCODE)
        console.log(this.openweatherURL)
      })

      axios
        .get(this.openweatherURL)
        .then(res => {
          console.log(response.data)
        })
        .catch(error => {
          console.log("에러 발생 ERROR")
        })
        // // ===== Ajax를 이용한 위치정보 API START =====
        // $ajax({
        //   url: locationURL,
        //   type: "get",
        // }).done(function(data){
        //   var weaIcon = data.weather[0].icon;
        //   var weaIconURL = "<img src='https://openweathermap.org/img/wn/"+weaIcon+"@2x.png'>"
  
        //   $(".nowTemp").append(data.main.temp+"℃,")
        //   $(".nowWeather").append(data.weather[0].description+" 입니다.")
        //   $(".yourCityName").append(data.name+" 입니다.")
        //   $(".weatherIcon").append(weaIconURL)

        //   console.log("날씨 불러오기 성공")
        // }).fail(function(error){
        //   console.log(error)
        // })
        // // ===== Ajax를 이용한 위치정보 API END =====
      
    }

  },

})

