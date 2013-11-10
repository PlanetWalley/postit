var convertDomToString = function(dom_obj){
	var tmp = document.createElement("div"); // create temp dom
	tmp.appendChild(dom_obj);	// append dom_obj
	return tmp.innerHTML; // return string format of dom_obj
}
var convertArrayToString = function(arr){
	var i = 0
	var output = ""
	while(i<arr.length){
		output = output + arr[i]
		i++
	}
	return output
}

var distanceBetweenTwoPoint=function(lon1,lat1,lon2,lat2){

                  /*
	              var R = 6371; // km
	              var d = Math.acos(Math.sin(lat1)*Math.sin(lat2) + 
                  Math.cos(lat1)*Math.cos(lat2) *
                  Math.cos(lon2-lon1)) * R;                        
                  */
                          // need to change to Radians to pass to trig func
                    var R = 6371000; // m
                	var dLat = (lat2-lat1)*Math.PI/180;
                    var dLon = (lon2-lon1)*Math.PI/180;
                    var lat1 = lat1*Math.PI/180;
                    var lat2 = lat2*Math.PI/180;
                    
                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                    var d = R * c;            
                    return d;      
            }            