var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(9001);
var information = {}
var inforindow_marker_count = 0

// mongodb data base
var dbURL = "mongodb://shd101wyy:4rfv5tgb@ds053698.mongolab.com:53698/postit"
var collections = ['users'];
var db = require("mongojs").connect(dbURL, collections);
//  db.users.update({name:"shd101wyy"}, {'$set': {password:"hello world 12"}});
//  db.users.save({name:"yuting", password:"hello world 3"});
//  db.users.update({name:"yuting"}, {'$set': {password:"hello world 12"}});

/*
  save to data base

  {
    name: ____,
    password: _____,
    friend: [friend1, friend2, ....]
    friend_request_from: []
  }
*/

/*
  put users and user_passwd to data base
*/

var USER_PASSWD = {};  // user_naem : user_password
var USER_FRIENDS = {}; // user_name : [user_friends_list]
var USER_FRIEND_REQUSET = {}; // user_name : [friend_request...]
var SOCKET_ID = {};    // used to save user id

var USER_LONGITUDE = {}; // save user longitude
var USER_LATITUDE = {};   // save user latitude
var SOCKET_ID_TO_USER_NAME = {}; // socket.id -> user_name

var CURRENT_ONLINE_USERS = {}; // save online users

// retrieve data from data base
db.users.find({}, function(error, data)
{
  if(error || !data)
  {
    console.log("Error...");
    return;
  }
  else{
    for(var i=0; i < data.length; i++)
    {
      var d = data[i];
      var user_name = d["name"];
      var pwd = d["password"];
      var fl = d["friends_list"]; // friends list
      var fr = d["friend_request_from"] // friend request

      USER_PASSWD[user_name] = pwd;
      USER_FRIENDS[user_name] = fl;
      USER_FRIEND_REQUSET[user_name] = fr;
    }
  }
  console.log("Finish Retrieve Data from Data Base");
  console.log(USER_PASSWD);
  console.log(USER_FRIENDS);
  console.log(USER_FRIEND_REQUSET);

})


function handler (req, res) {
  var file = __dirname + (req.url == '/' ? '/index.html' : req.url);
  fs.readFile(file, function(error, data) {
        if (error) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data, 'utf-8');
    });
}

io.sockets.on('connection', function (socket) {
  console.log("User Connected... USER_ID: ") // user connected
  console.log(socket.id); // print socket id

  socket.emit('connect_to_server$',[]);
  socket.emit('updateMapForFirstTimeConnectedUser', information); // update map for user that first connected

  socket.on('my other event', function (data) {
    console.log(data);                                            //  nothing
  });
  socket.on('User_Sent_Message',function(data){
    console.log("Get Post Message")                               // get post from user
    /*
    var post_information = {
      latitude:latitude,       // post location latitude
      longitude:longitude,     // post location longitude
      message:message,         // user post message
      time: new Date(),        // user post time
      comment:{},              // other users comment
      user_name:user_name      // post user name

      comment:[{user0,comment0} , {user1,comment1}]


    return data
    var post_information = {
      latitude:latitude,       // post location latitude
      longitude:longitude,     // post location longitude
      message:message,         // user post message
      time: new Date(),        // user post time
      comment:{},              // other users comment
      user_name:user_name      // post user name
      // add this one
      inforindow_marker_count:inforindow_marker_count // marker and comment and infowindow count id
    }


    */

    var longitude = data['longitude']
    var latitude = data['latitude']
    var user_message = data['message']
    var user_name = data['user_name']
    var post_date = data['time']
    var comment = data['comment']
    data['inforindow_marker_count'] = String(inforindow_marker_count)

    if (information[user_name] === undefined)
      information[user_name]={}
    information[user_name][post_date] = data

    io.sockets.emit('Update_Map', data);

    inforindow_marker_count++ // update count
  })

  // receive user request to check post
  socket.on('requirePostContent',function(data){
    var user_name = data[0]
    var post_date = data[1]
    var user_post_data = information[user_name][post_date]
    socket.emit('sendPostContent',user_post_data)

  })

  // receive comment from other user
  socket.on("OtherUserComment",function(data){
    var host_user_name = data[0]
    var comment_user_name = data[1]
    var host_user_post_date = data[2]
    var comment_message = data[3]
    var infowindow_id = information[host_user_name][host_user_post_date]
    var comment_obj = information[host_user_name][host_user_post_date]['comment']
    comment_obj.push({
                                        comment_user_name:comment_user_name, //save comment user name
                                        comment_message:comment_message, // save comment message
                                      })
    console.log("Sent data")
    console.log(information[host_user_name][host_user_post_date])
    socket.emit("Update_InfoWindow_Information_From_User_Comment", information[host_user_name][host_user_post_date] )
  })

  /* user try to login */
  socket.on("user_login", function(data)
  {
    var user_name = data[0];
    var user_pwd = data[1];
    if(user_name in USER_PASSWD)
    {
      var correct_pwd = USER_PASSWD[user_name];
      if(correct_pwd === user_pwd) // successfully login
      {
        console.log("User Login====");
        console.log("User Socket ID: "+socket.id);
        socket.emit("successfully-login",[user_name, USER_FRIEND_REQUSET[user_name], USER_FRIENDS[user_name]]); 

         // set user socket id
        SOCKET_ID[user_name] = socket
        SOCKET_ID_TO_USER_NAME[socket.id] = user_name;
        CURRENT_ONLINE_USERS[user_name] = true;
        // socket.id = user_name;

        // get friend locations
        for(var i = 0; i < USER_FRIENDS[user_name].length; i++)
        {
          var friend_name = USER_FRIENDS[user_name][i];
          if(friend_name in USER_LONGITUDE)
          {
            var friend_longitude = USER_LONGITUDE[friend_name];
            var friend_latitude = USER_LATITUDE[friend_name];
            socket.emit("update_friend_location", [friend_longitude, friend_latitude, friend_name]);
          }
        }

      }
      else // wrong password
      {
        socket.emit("login--wrong_user_name_or_wrong_password", "Sorry... Your user name or password is wrong")
      }
    }
    else
    {
      socket.emit("login--wrong_user_name_or_wrong_password", "Sorry... Your user name or password is wrong")
    }
  })


  /* check with server whether user existed */
  socket.on("user_wants_to_signup", function(data)
  {
    var user_name = data[0];
    var user_pwd = data[1];
    if(data[0] in USER_PASSWD)
    {
      socket.emit("user_already_registered", data); // that means user already registed 
    }
    else // user haven't registered
    {
      USER_PASSWD[user_name] = user_pwd; // save user name and password
      USER_FRIENDS[user_name] = []; // init friend list

      db.users.save({
        name:user_name, 
        password:user_pwd, 
        friends_list:[],
        friend_request_from:[]
        }) // save user and password to data base

      socket.emit("user_successfully_registered", user_name); // successfully signup
      console.log("User Signup");
      console.log("User Socket ID: " + socket.id);

      // set user socket id
      SOCKET_ID[user_name] = socket;
      SOCKET_ID_TO_USER_NAME[socket.id] = user_name;
      CURRENT_ONLINE_USERS[user_name] = true;
      // socket.id = user_name;
    }
  })

  socket.on('find_friend_name', function(data)
  {
    console.log("User: "+data[1]);
    console.log("wants to add " + data[0]+" as friend");
    // data[1] send friend request to data[0]
    var request_from = data[1];
    var to_user = data[0];

    // check whether is already friend
    for(var i = 0; i < USER_FRIENDS[request_from].length; i++)
    {
      if(USER_FRIENDS[request_from][i] === to_user)
      {
         socket.emit("is_already_friend", to_user);
          return;
      }
    }
   
    if (to_user in USER_PASSWD) // user exists
    {
      if(typeof(USER_FRIEND_REQUSET[to_user]) == "undefined")
        return;
      // add friend request
      if(request_from in USER_FRIEND_REQUSET[to_user])
      {

      }
      else{
        USER_FRIEND_REQUSET[to_user].push(request_from); // update user_friend_request
      }

      socket.emit("successfully_send_friend_request",[]); // send friend request to the friend u want to add
      if(SOCKET_ID[to_user])
        SOCKET_ID[to_user].emit("have_friend_request", [request_from, USER_FRIEND_REQUSET[to_user] ]); // send request to friend

      // update data base
      db.users.update({name:to_user},{$set: {friend_request_from: USER_FRIEND_REQUSET[to_user]}})
    }
    else
    {
      socket.emit("user_does_not_exist",[]); // send back to inform user that friend request has been sent
    }
  })

  // user accept friend
  socket.on('accept_friend', function(data)
  {
    // user_ accept accept_ as friend
    var user_ = data[0];
    var accept_ = data[1];

    console.log("User: "+user_ +" accept " + accept_ + " as friend")

    var temp = []
    // remove accept_ from user_ friend request list
    for(var i = 0; i < USER_FRIEND_REQUSET[user_].length; i++)
    {
      if(accept_ === USER_FRIEND_REQUSET[user_][i])
        continue;
      else 
        temp.push(USER_FRIEND_REQUSET[user_][i]);
    }
    USER_FRIEND_REQUSET[user_] = temp;

    // update data base
    db.users.update({name: user_}, {$set: {friend_request_from: USER_FRIEND_REQUSET[user_]}})

    // add friend to both side
    USER_FRIENDS[user_].push(accept_);
    USER_FRIENDS[accept_].push(user_);

    // update data base
    db.users.update({name: user_}, {$set: {friends_list: USER_FRIENDS[user_]}});
    db.users.update({name: accept_}, {$set: {friends_list: USER_FRIENDS[accept_]}});

    // update need_update_friend_list_or_notifications
    SOCKET_ID[user_].emit("need_update_friend_list_or_notifications", []);
    SOCKET_ID[accept_].emit("need_update_friend_list_or_notifications", []);
  })

  // user reject friend
  socket.on('reject_friend', function(data)
  {
    // user_ accept accept_ as friend
    var user_ = data[0];
    var accept_ = data[1];

    console.log("User: "+user_ +" reject " + accept_ + " as friend")


    var temp = []
    // remove accept_ from user_ friend request list
    for(var i = 0; i < USER_FRIEND_REQUSET[user_].length; i++)
    {
      if(accept_ === USER_FRIEND_REQUSET[user_][i])
        continue;
      else 
        temp.push(USER_FRIEND_REQUSET[user_][i]);
    }
    USER_FRIEND_REQUSET[user_] = temp;

    // update data base
    db.users.update({name: user_}, {$set: {friend_request_from: USER_FRIEND_REQUSET[user_]}})


  })

  // user request to get information about notifications
  socket.on('request_notifications_information', function(user_name)
  {
    socket.emit("receive_notifications_information", USER_FRIEND_REQUSET[user_name] );
  })

  socket.on("send_ur_location_to_friend", function(data)
  {
    var user_name = data[0];
    var longitude = data[1];
    var latitude = data[2];

    if(user_name === "") return; // invalid user name

    USER_LONGITUDE[user_name] = longitude;
    USER_LATITUDE[user_name] = latitude;

    for(var i = 0; i < USER_FRIENDS[user_name].length; i++)
    {
      if(typeof(SOCKET_ID[USER_FRIENDS[user_name][i]]) === 'undefined') continue;
      SOCKET_ID[USER_FRIENDS[user_name][i]].emit("update_friend_location", [longitude, latitude, user_name]);
    }
  })

  // user request friend list information
  socket.on('request_friend_list_information', function(user_name)
  {
    var user_friends = USER_FRIENDS[user_name]; 
    // check online friends and offline friends
    var online_friends = [];
    var offline_friends = [];
    for(var i = 0; i < user_friends.length; i++)
    {
      if(user_friends[i] in CURRENT_ONLINE_USERS)
        online_friends.push(user_friends[i])
      else
        offline_friends.push(user_friends[i])
    }
    socket.emit("receive_friend_list_information", [online_friends, offline_friends]);
  })

  socket.on("ask_friends_to_update_friends_list_and_notifications", function(user_name)
  {
    for(var i = 0; i < USER_FRIENDS[user_name].length; i++)
    {
      if(typeof(SOCKET_ID[USER_FRIENDS[user_name][i]]) === 'undefined') continue;
      SOCKET_ID[USER_FRIENDS[user_name][i]].emit("need_update_friend_list_or_notifications",[])
    }
  })

  socket.on('get_friend_location', function(user_name)
  {
    if(typeof(USER_LONGITUDE[user_name]) === 'undefined') 
      socket.emit('cannot_get_friend_location', []);
    else
      socket.emit('receive_friend_location', [USER_LONGITUDE[user_name], USER_LATITUDE[user_name]]);
  })

    // user disconnect
  socket.on('disconnect', function()
  {
    console.log("USER_DISCONNECT");
    console.log("Socket ID: " + socket.id);

    var user_name = SOCKET_ID_TO_USER_NAME[socket.id];
    if(typeof(user_name) === "undefined") return;
    console.log("USER_NAME: "+user_name);
    // delete USER_LONGITUDE
    // delete USER_LATITUDE
    delete USER_LONGITUDE[user_name];
    delete USER_LATITUDE[user_name];
    delete CURRENT_ONLINE_USERS[user_name];

    for(var i = 0; i < USER_FRIENDS[user_name].length; i++)
    {
      if(typeof(SOCKET_ID[USER_FRIENDS[user_name][i]]) === 'undefined') continue;
      SOCKET_ID[USER_FRIENDS[user_name][i]].emit("update_friend_location", [0, 0, user_name]);     // remove from friend's map

      SOCKET_ID[USER_FRIENDS[user_name][i]].emit("need_update_friend_list_or_notifications",[])
    }

  })
});








































