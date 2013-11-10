var user_name = "planetwalley" // user name
var information; // information that will be stored in local, categorized by user name
var MARKERS = {} // save marker object
var INFOWINDOWS = {} // save infowindows object

// read user_name if it is in local Storage
if(window.localStorage!==undefined && window.localStorage["user_name"]!==undefined){
	user_name = window.localStorage["user_name"]
}
/*
var createPostInformation = function(user_longitude, user_latitude, user_message, post_date, user_name){
	
		sample that will be saved to information
		if user post
	
	var post_information = {
		latitude:user_latitude,   // post location latitude
		longitude:user_longitude, // post location longitude
		message:user_message,     // user post message
		time:post_date,           // user post time
		comment:{}                // other users comment
	}

	if (information[user_name]===undefined)
		information[user_name] = {}

	information[user_name][post_date] = post_information

	// save information local storage
	if(window.localStorage){
		window.localStorage["postit"] = JSON.stringify(information) // save data to local storage
		//alert("Successfully PostIt!")
		User_Location_Marker_InfoWindow.setContent("<p>Successfully PostIt !</p>")

		// get icon from google
		var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
		// init latlon
		var latlon=new google.maps.LatLng(latitude, longitude)
		// set marker
		var marker=new google.maps.Marker({position:latlon,
										   map:Google_Map,
										   icon:iconBase + 'schools_maps.png', // set icon
										   title:user_name+":"+post_date}); 
		// init info window
		var infowindow = new google.maps.InfoWindow();
		// show user posted information
		google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent("<strong>"+user_name+":</strong></br>"+user_message) // show basic user name and user post message
            infowindow.open(Google_Map, marker)                
            });

	}
	else{
		alert("Cannot post cuz ur browser does not support local storage")
	}

	// close after 1.5 s
	setTimeout(function(){
		User_Location_Marker_InfoWindow.close()                
	}, 1500)
}*/

var PostIt = function(){
	var message = document.getElementById('post_message').value;
	message = message.replace(/\n/g,"</br>");

	//var userName = document.getElementById('user_name').value;
	//user_name = userName
	// save user_name to local storage
	var user_name = CURRENT_USER_NAME;
	// window.localStorage["user_name"] = user_name
	
	var post_information = {
		latitude:latitude,   // post location latitude
		longitude:longitude, // post location longitude
		message:message,     // user post message
		time: String(new Date()),           // user post time
		comment:[],                // other users comment
		user_name:user_name, // user name
	}

	socket.emit("User_Sent_Message", post_information )
	User_Location_Marker_InfoWindow.close()
	// createPostInformation(longitude, latitude, message, new Date(), userName)
	// $('#openPostCard').qtip('hide')

}
















