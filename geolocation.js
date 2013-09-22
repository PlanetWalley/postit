
// if can show position
// call this function
var showPosition = function(position){
    // get longitude
    var longitude = position.coords.longitude
    // get latitude
    var latitude = position.coords.latitude
    console.log("Longitude: "+longitude)
    console.log("Latitude: "+latitude)
}

// print error message
function showError(error){
    switch(error.code) 
    {
    case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.")
        break;
    case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.")
        break;
    case error.TIMEOUT:
        alert("The request to get user location timed out.")
        break;
    case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.")
        break;
    }
}

// check geolocation support 
if (user.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition, showError)
}
else{
    alert("Sorry, Ur browser does not support geolocation")
}

