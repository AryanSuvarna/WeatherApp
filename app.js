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
    getWeather(latitude,longitude)
})

function showError() {
    notificationElement.style.display="block"
    notificationElement.innerHTML=`<p> Error: User denied geolocation or invalid location</p>`
    iconElement.innerHTML=`<img src="icons/unknownIcon.png" style="width:128px;height:128px;">`
    tempElement.innerHTML=`- °<span>C<span>`
    descElement.innerHTML=`-`
    locationElement.innerHTML=`-`
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
        weather.temperature.value=Math.floor(data.current.temp -KELVIN)
        weather.description=data.current.weather[0].description
        weather.iconID=data.current.weather[0].icon
    })
    .then(function(){
        displayWeather()
    })
}

function getWeather(latitude,longitude){
    let api= `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,daily&appid=${key}`

    fetch(api)
    .then(function(response){
        let data = response.json()
        return data
    })
    .then(function(data){
        // 
        weather.temperature.value=Math.floor(data.current.temp -KELVIN)
        weather.description=data.current.weather[0].description
        weather.iconID=data.current.weather[0].icon
    })
    .then(function(){
        displayWeather()
    })
}


// CAREFUL!!! GOTTA USE BACKTICKS NOT QUOTATION MARKS
function displayWeather() {
    getName()
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${weather.city}')`
    notificationElement.style.display="none"
    iconElement.innerHTML=`<img src="icons/${weather.iconID}.png" style="width:128px;height:128px;">`
    tempElement.innerHTML=`${weather.temperature.value} °<span>C<span>`
    descElement.innerHTML=weather.description
    locationElement.innerHTML=`${weather.city}, <span>${weather.country}<span>`
}