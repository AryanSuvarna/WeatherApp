// constannts are selecting the elements needed
const iconElement = document.querySelector(".weather-icon")
const locationIcon = document.querySelector(".location-icon")
const tempElement = document.querySelector(".temperature-value p")
const descElement = document.querySelector(".temperature-description p")
const locationElement = document.querySelector(".location p")
const notificationElement = document.querySelector(".notification")
const eventElement = document.querySelector(".event")
const alertElement = document.querySelector(".alert-description ")
const senderElement = document.querySelector(".sender")



var input1 = document.getElementById("search1")
var input2 = document.getElementById("search2")
var hourly = document.getElementById("hourly-forecast")
let city = ""
let country= ""
let latitude = 0.0
let longitude = 0.0

input1.addEventListener("keyup", function(event) {
    if(event.keyCode ===13){
        event.preventDefault();

        weather.city=input1.value
        console.log(weather.city)
        input2.focus()
    }
})

input2.addEventListener("keyup", function(event) {
    if(event.keyCode ===13){
        event.preventDefault();

        weather.country=input2.value
        console.log(weather.country)
        getLatLong()
        
    }
})

const weather = {}

weather.temperature = {
    unit: "celsius"
}

const KELVIN=273
const key ="bd5a5272e3b23f27b0a0425e1f37d01e"

if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition,showError)
}
else {
    notificationElement.style.display ="block"
    notificationElement.innerHTML="<p> Browser does not support geolocation </p>"
}

function setPosition(position) {
    latitude = position.coords.latitude
    longitude = position.coords.longitude
    
    getName(latitude,longitude)
    getWeather(latitude,longitude)
}

// get name of location given the lat. and lon.
function getName(){
    let api = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${key}`

    fetch(api)
    .then(function(response){
        let data = response.json()
        return data
        
    })
    .then(function(data){
        weather.city = data[0].name
        weather.country = data[0].country
    })
}

locationIcon.addEventListener("click", function(event){
    hourly.innerHTML= ""; //removes all childs elements of hourly
    getWeather(latitude,longitude)
})

function showError() {
    hourly.innerHTML= ""; //removes all childs elements of hourlyK
    notificationElement.style.display="block"
    notificationElement.innerHTML=`<p> Error: User denied geolocation or invalid location</p>`
    iconElement.innerHTML=`<img src="icons/unknownIcon.png" style="width:128px;height:128px;">`
    tempElement.innerHTML=`- °<span>C<span>`
    descElement.innerHTML=`-`
    locationElement.innerHTML=`-`
    weather.event = "No Alerts"
    weather.sender = ""
    weather.alertDesc = ""
    weather.start = ""
    weather.end = ""
}

// gets the longitude and latitude of a city for the API call that provides all the info (current, hourly, alerts)
function getLatLong(){
    console.log(weather.city)
    console.log(weather.country)
    let api = `https://api.openweathermap.org/geo/1.0/direct?q=${weather.city},${weather.country}&appid=${key}`

    fetch(api)
    .then(function(response){
        let data = response.json()
        return data
    })
    .then(function(data){
        // finds length of json file
        var count = Object.keys(data).length
        if (count === 0) {
            showError()
        }
        weather.latitude = data[0].lat
        weather.longitude =data[0].lon
        console.log(weather.latitude)
        console.log(weather.longitude)
    })
    .then(function(){
        getSearchWeather()
    })
}

function getSearchWeather(){
    hourly.innerHTML= ""; //removes all childs elements of hourly
    let api= `https://api.openweathermap.org/data/2.5/onecall?lat=${weather.latitude}&lon=${weather.longitude}&exclude=minutely,daily&appid=${key}`

    fetch(api)
    .then(function(response){
        let data = response.json()
        return data
    })
    .then(function(data){
        if (data.cod === "404") {
            showError()
        }
        
        if (data.hasOwnProperty('alerts')) {
            let alerts = data.alerts[0]
            weather.event = alerts.event
            weather.sender = alerts.sender_name
            weather.alertDesc = alerts.description
            weather.start = "Time: " +timestampToTime(alerts.start)
            weather.end = " - " + timestampToTime(alerts.end)
        }

        else {
            weather.event = "No Alerts"
            weather.sender = ""
            weather.alertDesc = ""
            weather.start = ""
            weather.end = ""
        }

        weather.temperature.value=Math.floor(data.current.temp -KELVIN)
        weather.description=data.current.weather[0].description
        weather.iconID=data.current.weather[0].icon

        // for each hour
        for (x=0; x<24;x++){
            let currentTime = data.hourly[x]
            let time = timestampToTime(currentTime.dt)
            let description = currentTime.weather[0].description
            let icon = currentTime.weather[0].icon
            let temp = Math.floor(currentTime.temp - KELVIN)
            let feelsLike = Math.floor(currentTime.feels_like - KELVIN)
            displayWeatherHourly(time,description, icon, temp, feelsLike)
        }
    })
    .then(function(){
        displayWeather()
    })
}

function getWeather(latitude,longitude){
    hourly.innerHTML= ""; //removes all childs elements of hourly
    let api= `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,daily&appid=${key}`

    fetch(api)
    .then(function(response){
        let data = response.json()
        return data
    })
    .then(function(data){
        
        if (data.hasOwnProperty('alerts')) {
            let alerts = data.alerts[0]
            weather.event = alerts.event
            weather.sender = alerts.sender_name
            weather.alertDesc = alerts.description
            weather.start = "Time: " +timestampToTime(alerts.start)
            weather.end = " - " + timestampToTime(alerts.end)
        }

        else {
            weather.event = "No Alerts"
            weather.sender = ""
            weather.alertDesc = ""
            weather.start = ""
            weather.end = ""
        }
        
        weather.temperature.value=Math.floor(data.current.temp -KELVIN)
        weather.description=data.current.weather[0].description
        weather.iconID=data.current.weather[0].icon

        // for each hour
        for (x=0; x<24;x++){
            let currentTime = data.hourly[x]
            let time = timestampToTime(currentTime.dt)
            let description = currentTime.weather[0].description
            let icon = currentTime.weather[0].icon
            let temp = Math.floor(currentTime.temp - KELVIN)
            let feelsLike = Math.floor(currentTime.feels_like - KELVIN)
            displayWeatherHourly(time,description, icon, temp, feelsLike)
        }
    })
    .then(function(){
        displayWeather()
    })
}

let displayWeatherHourly = function(time,description, icon, temp, feelsLike) {
    let out = "<div class='hourly-container'><h2>" + time + "</h2>"
    out += `<div1 class = "weather-icon"> <img src="icons/${icon}.png" style="width:128px;height:128px;"></div1>`
    out += "<h1>" + temp + "°<span>C</span></h1>";
    out += "<p>Feels like: " + feelsLike + "°C</p>";
    out += "<p>" + description + "</p></div>";
    hourly.innerHTML += out;
}
// CAREFUL!!! GOTTA USE BACKTICKS NOT QUOTATION MARKS
function displayWeather() {
    // current weather
    getName()
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${weather.city}')`
    notificationElement.style.display="none"
    iconElement.innerHTML=`<img src="icons/${weather.iconID}.png" style="width:128px;height:128px;">`
    tempElement.innerHTML=`${weather.temperature.value} °<span>C<span>`
    descElement.innerHTML=weather.description
    locationElement.innerHTML=`${weather.city}, <span>${weather.country}<span>`
    eventElement.innerHTML= `${weather.event}`
    senderElement.innerHTML=`${weather.sender}`
    alertElement.innerHTML=`${weather.alertDesc}<br><br> ${weather.start} ${weather.end}`

}


let timestampToTime = function(timeStamp) {
    let date = new Date(timeStamp * 1000);
    let hours = date.getHours();
    let minutes = "";
    if (date.getMinutes() < 10) {
        minutes = "0" + date.getMinutes();
    } else {
        minutes = date.getMinutes();
    }
    return hours + ":" + minutes;
}