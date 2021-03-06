var userLongitude;
var userLatitude;
var map;
var infoWindow;
var m_apiKey = "AIzaSyCkAdpuaUbF88OegKKWanqZaEDmKhD_CL4";
var apiKey_displayMap = "AIzaSyCueVCjk8CMDfzmqSfhBzWpr2GQ_I8O9Pk";

// this function initializes Google Maps and prompts user for their location and storing them
function initMap() {

  infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
      };
      userLongitude = position.coords.longitude;
      userLatitude =  position.coords.latitude;

      getUserCityName();

    }, function() {
            // hardcoding user's location to Evanston if user does not allow to disclose their location
            handleLocationError(true, infoWindow);
            userLongitude = -87.6818861111;
            userLatitude = 42.0497277778;
            getUserCityName();
          });
  } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow);
     }
}

// this function is called when browser does not support Geo location
function handleLocationError(browserHasGeolocation, infoWindow) {
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}


// function to get user's city name from user's latitutde and longitude from initial page load
function getUserCityName(){
    var m_queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+userLatitude+"," + userLongitude + "&key=" + m_apiKey


      $.ajax({url: m_queryURL, method: 'GET'}).done(function(response) {
          $("#city").val(response.results[3].formatted_address);
      });
}

// function to calculate distance and time from user's location to restaurant
function getDistance(resLat,resLong,disID,durationID){
    var m_queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + userLatitude + "," + userLongitude + "&destinations=" + resLat + "," + resLong + "&key=" + m_apiKey;


  $.when($.ajax({url: m_queryURL, method: 'GET' })).done(function(response) {

    var distance = (response.rows[0].elements["0"].distance.text);
    var duration = (response.rows[0].elements["0"].duration.text);

    $("#" + disID).text(`${distance} away`);
    $("#" + durationID).text(`${duration} away`);
  });


}

// function to display location of restaurant on the map
function displayMap(resLat,resLong,pId){
   $("#"+pId).append("<iframe width='250' height='250' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/view?zoom=18&center=" + resLat + "," + resLong + "&key=" + apiKey_displayMap + "' allowfullscreen></iframe>");
}

// function to get Latitude and Longitude for user's location
function getLatLong(index){
  var m_queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + $("#city").val().trim() + "&key=" + m_apiKey
    $.ajax({ url: m_queryURL, method: 'GET' }).done(function (response) {
      userLatitude =  response.results[0].geometry.location.lat;
      userLongitude = response.results[0].geometry.location.lng;
      getData(index);
    });
}
