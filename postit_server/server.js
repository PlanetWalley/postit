var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(9001);
var information = {}
var inforindow_marker_count = 0


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
  console.log("User Connected") // user connected

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






});