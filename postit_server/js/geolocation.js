//ATTENTION
/*

        //draggable:false, // temporarily allowed


*/
// if can show position
var longitude = 0; // current longitude
var latitude = 0;  // current latitude
var Google_Map = null;
var User_Location_Marker = null
var User_Location_Marker_InfoWindow = null
var hasInitGeolocation = false
// call this function
var showPosition = function(position){
    // get longitude
    longitude = position.coords.longitude
    // get latitude
    latitude = position.coords.latitude
    
    // google map
    var latlon=new google.maps.LatLng(latitude, longitude)
    var mapholder=document.getElementById('mapholder')
      //mapholder.style.height='100px';
      //mapholder.style.width='100px';
      //mapholder.style.border-radius='250px';

      var myOptions={
        //draggable:false, // temporarily allowed
        scrollwheel: false,
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
        Google_Map=new google.maps.Map(document.getElementById("mapholder"),myOptions); // init google map
      }
      else{
        Google_Map.setCenter(latlon)
      }
      // User Position Marker does not exist
      // So create new one
      if (User_Location_Marker == null){
        User_Location_Marker = new google.maps.Marker({position:latlon,map:Google_Map,title:"You are here!"});
        // init info window
        User_Location_Marker_InfoWindow = new google.maps.InfoWindow();
        google.maps.event.addListener(User_Location_Marker, 'click', function() {
                //                        alert(user_name + ": "+information[user_name][post_date]["message"])
                User_Location_Marker_InfoWindow.setContent("<div style='width: 300px; height: 190px'>\
                  <label style='color:black;' id='label_user_name'>User Name  </label>\
                  <input id='user_name' value='"+user_name+"' onclick=\'this.value=\"\"\'/>\
                  </br>\
                  <label style='color:black;'>Post Message: </label>\
                  </br>\
                  <textarea id='post_message' onclick=\'this.value=\"\"\'> Edit ur post message here</textarea>\
                  </br>\
                  <button id='postit' onclick='PostIt()'> PostIt!</button>\
                  </div>")
                User_Location_Marker_InfoWindow.open(Google_Map, User_Location_Marker)                
              });

        // show hint
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent('<p>Touch Me to PostIt!</p>');
        infowindow.open(Google_Map, User_Location_Marker);
        // hide hint after 4 second
        setTimeout(function(){infowindow.close()},4000)
      } 
    // update user marker position
    else{
      User_Location_Marker.setPosition(latlon)
    }

    hasInitGeolocation = true
  }

// print error message
function showError(error){
  switch(error.code) 
  {
    case error.PERMISSION_DENIED:
    console.log("User denied the request for Geolocation.")
    break;
    case error.POSITION_UNAVAILABLE:
    console.log("Location information is unavailable.")
    break;
    case error.TIMEOUT:
    console.log("The request to get user location timed out.")
    break;
    case error.UNKNOWN_ERROR:
    console.log("An unknown error occurred.")
    break;
  }
}

// check geolocation support 
if (navigator.geolocation){
  navigator.geolocation.watchPosition(showPosition, showError,
                                             {timeout:5000 ,// wait for up to 5 seconds to get location
                                              enableHighAccuracy: true} // enable high accuracy
                                              )
}
else{
  alert("Sorry, Ur browser does not support geolocation")
}











