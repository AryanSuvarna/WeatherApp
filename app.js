// constannts are selecting the elements needed
const iconElement = document.querySelector(".weather-icon")
const locationIcon = document.querySelector(".location-icon")
const tempElement = document.querySelector(".temperature-value p")
const descElement = document.querySelector(".temperature-description p")
const locationElement = document.querySelector(".location p")
const notificationElement = document.querySelector(".notification")

var input1 = document.getElementById("search1")
var input2 = document.getElementById("search2")
let city = ""
let country= ""
let latitude = 0.0
let longitude = 0.0

input1.addEventListener("keyup", function(event) {
    if(event.keyCode ===13){
        event.preventDefault();

        city=input1.value
        console.log(city)
        input2.focus()
    }
})

input2.addEventListener("keyup", function(event) {
    if(event.keyCode ===13){
        event.preventDefault();

        country=input2.value
        getSearchWeather(city,country)
        console.log(country)
    }
})

const weather = {}

weather.temperature = {
    unit: "celsius"
}

const KELVIN=273
const key ="bd5a5272e3b23f27b0a0425e1f37d01e"
// WHAT IS A NAVIGATOR????
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

    getWeather(latitude,longitude)
}

locationIcon.addEventListener("click", function(event){
    console.log("HELLO")
    getWeather(latitude,longitude)
})

function showError(error) {
    notificationElement.style.display="block"
    notificationElement.innerHTML=`<p> Error: ${error.message}</p>`
}

function getSearchWeather(city,country){
    let api= `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${key}`

    fetch(api)
    .then(function(response){
        let data = response.json()
        return data
    })
    .then(function(data){
        weather.temperature.value=Math.floor(data.main.temp -KELVIN)
        weather.description=data.weather[0].description
        weather.iconID=data.weather[0].icon
        weather.city=data.name
        weather.country=data.sys.country
    })
    .then(function(){
        displayWeather()
    })
}

function getWeather(latitude,longitude){
    let api= `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`

    fetch(api)
    .then(function(response){
        let data = response.json()
        return data
    })
    .then(function(data){
        weather.temperature.value=Math.floor(data.main.temp -KELVIN)
        weather.description=data.weather[0].description
        weather.iconID=data.weather[0].icon
        weather.city=data.name
        weather.country=data.sys.country
    })
    .then(function(){
        displayWeather()
    })
}

// CAREFUL!!! GOTTA USE BACKTICKS NOT QUOTATION MARKS
function displayWeather() {
    iconElement.innerHTML=`<img src="icons/${weather.iconID}.png" style="width:128px;height:128px;">`
    tempElement.innerHTML=`${weather.temperature.value} °<span>C<span>`
    descElement.innerHTML=weather.description
    locationElement.innerHTML=`${weather.city}, ${weather.country}`
}