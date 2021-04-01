"use strict";
$(document).ready(function () {
    let city;
    //Connect with open weather API
    function weather(c) {
        if (c == null) c = "Warshav";
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${c}&appid=1fdba3d766afe3e65f851c547cb1d9f5`)
            .then((resp) => { return resp.json(); })
            .then((data) => {
                localStorage.setItem("city", c);
                $(".rainfall").text(data.weather[0].main);
                $(".city-country").text(String(data.name) + ", " + String(data.sys.country));
                $(".temperature").text(Math.round(data.main.temp - 273.15));
                $(".feel-like").text("Feels like: " + Math.round(data.main.feels_like - 273.15));
                $(".wind-speed").text(`Wind:  ${Math.round(data.wind.speed)} M/s`);
                $(".humidity").text(`Humidity:  ${data.main.humidity} %`);
                $(".city-error").removeClass("active");
                $(".loading").addClass("hide");
            }).catch(() => {
                $(".city-error").addClass("active");
                $(".loading").addClass("hide");
            });
    }

    $("#search").on("submit", function (e) {
        e.preventDefault();
    });
    $("#city").on("keydown", function (e) {
        if (e.keyCode == "13") {
            weather($(this).val());
        }
    });
    $("#search-icon").on("click", function (e) {
        weather($("#city").val());
    });

    /*Function to check if is exists city storage and select this 
    city or check user location and select, if storage not exists*/
    (function checkStorage() {
        if (!localStorage.getItem("city")) {
            $.ajax({
                url: "https://extreme-ip-lookup.com/json/",
                jsonpCallback: "callback",
                dataType: "jsonp",
            }).done((loc) => {
                city = loc.city.toLowerCase();
                weather(city);
            }).fail(() => {
                $(".city-country").text("Connect is failed");
                $(".loading").addClass("hide");
            });
        }
        else {
            city = localStorage.getItem("city");
            weather(city);
        }
    })();
});