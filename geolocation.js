
// if can show position
var longitude = 0; // current longitude
var latitude = 0;  // current latitude
var Google_Map = null;
// call this function
var showPosition = function(position){
    // get longitude
    longitude = position.coords.longitude
    // get latitude
    latitude = position.coords.latitude
    document.getElementById("latInfo").innerHTML = "Latitude: " + latitude;
    document.getElementById("lonInfo").innerHTML = "Longitude: " + longitude;
    //console.log("Longitude: "+longitude)
    //console.log("Latitude: "+latitude)
    
    // google map
    var latlon=new google.maps.LatLng(latitude, longitude)
    var mapholder=document.getElementById('mapholder')
      //mapholder.style.height='100px';
      //mapholder.style.width='100px';
      //mapholder.style.border-radius='250px';

    var myOptions={
          draggable:false,
          disableDoubleClickZoom:true,
          panControl:false,
          zoomControl:false,
          mapTypeControl:false,
          scaleControl:false,
          streetViewControl:false,
          overviewMapControl:false,
          rotateControl:false,
          center:latlon,
          zoom:18,
          mapTypeId:google.maps.MapTypeId.ROADMAP,
          mapTypeControl:false,
          navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
      };

      if (Google_Map == null){
        Google_Map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
      }
      else{
        Google_Map.setCenter(latlon)
      }
      //Google_Map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
      var marker=new google.maps.Marker({position:latlon,map:Google_Map,title:"You are here!"});
      google.maps.event.addListener(marker, 'click', function() {
            alert("U clicked me")
         });
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
if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition, showError,
                                             {timeout:1000 ,// update every 1 sec 
                                              enableHighAccuracy: true} // enable high accuracy
                                              )
}
else{
    alert("Sorry, Ur browser does not support geolocation")
}

