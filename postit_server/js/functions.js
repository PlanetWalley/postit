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