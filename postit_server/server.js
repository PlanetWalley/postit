var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(9001);


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
  console.log("User Connected")
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('User_Sent_Message',function(data){
    console.log("Get Post Message")
    io.sockets.emit('Update_Map', data);
  })
});