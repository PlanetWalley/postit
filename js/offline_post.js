var user_name = "planetwalley" // user name
var information = {} // information that will be stored in local, categorized by user name


var createPostInformation = function(user_longitude, user_latitude, user_message, post_date, user_name){
	/*
		sample that will be saved to information
		if user post
	*/
	var post_information = {
		latitude:user_latitude, 
		longitude:user_longitude,
		message:user_message,
		time:post_date
	}

	if (information[user_name]===undefined)
		information[user_name] = {}

	information[user_name][post_date] = post_information

	// save information local storage
	if(window.localStorage){
		window.localStorage["postit"] = information
		alert("Successfully PostIt!")

		// get icon from google
		var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
		// init latlon
		var latlon=new google.maps.LatLng(latitude, longitude)
		// set marker
		var marker=new google.maps.Marker({position:latlon,
										   map:Google_Map,
										   icon:iconBase + 'schools_maps.png', // set icon
										   title:user_name+":"+post_date}); 
		google.maps.event.addListener(marker, 'click', function() {
                                    alert(user_name + ": "+information[user_name][post_date]["message"])
                                });

	}
	else{
		alert("Cannot post cuz ur browser does not support local storage")
	}
}


var PostIt = function(){
	var message = document.getElementById('post_message').value;
	var userName = document.getElementById('user_name').value;
	createPostInformation(longitude, latitude, message, new Date(), userName)
}
