/*
	GLOBAL VARIABLE for Client
	
	this file is used to save global variable
*/
var CONNECTED_TO_SERVER = false;
var socket; // socket
var USER_LOGIN = false;
var CURRENT_USER_NAME = "";
var FRIENDS_REQUEST = []; // friend request list
var USER_FRIENDS = []; // user friends
var NOTIFICATIONS_DATA = []; // save notification data
var LONGITUDE = 0;
var LATITUDE = 0;

var FRIENDS_LONGITUDE = {};
var FRIENDS_LATITUDE = {};
var FRIENDS_MARKERS = {};

var SHOW_FRIEND_LIST = false;
var SHOW_NOTIFICATIONS = false;

// if can show position
var longitude = 0; // current longitude
var latitude = 0;  // current latitude
var Google_Map = null;
var User_Location_Marker = null
var User_Location_Marker_InfoWindow = null
var hasInitGeolocation = false

var CHAT_INPUT_ID = 0;
var CHAT_DIV_ID = 0;
var CHAT_DIV = {}; // key is user1:user2
var TO_USER_INFORWINDOW = {} // save inforwindow 

var FRIENDS_NEARBY = {};
var FRIENDS_DISTANCE = {};

var PUBLIC_MESSAGE = {} ; // key is post date + user_name
var NEARBY_PUBLIC_MESSAGE = {}; // near by public message

var NOTIFICATION_MESSAGE = ""; // notification message