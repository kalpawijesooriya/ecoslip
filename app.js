/*var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('A user connected');
  //Send a message when 
  setTimeout(function(){
	  //Sending an object when emmiting an event
	socket.send('testerEvent', { description: 'A custom event named testerEvent!'});
	}, 4000);
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});
const PORT = process.env.PORT || 3000;
http.listen(PORT, function(){
  console.log('listening on localhost:'+PORT);
});*/


const PORT = process.env.PORT || 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
	console.log(">>>>"+req.query);
});

users = [];
io.on('connection', function(socket){
  console.log('A user connected');
  socket.on('setUsername', function(data){
    console.log(data);
    if(users.indexOf(data) > -1){
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    }
    else{
      users.push(data);
      socket.emit('userSet', {username: data});
    }
  });
  socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.emit('newmsg', data);
  });
   socket.on('unitest', function(data){
      //Send message to everyone
      io.sockets.emit('unitest_rec', data);
	console.log("unitest"+data);
  });

});
app.get("/page/:id",function(request, response){
    var id = request.params.id;
    // do something with id
    // send a response to user based on id
    var obj = { id : id, Content : "" +id.slice(",")[1] };
 	io.sockets.emit('unitest_rec',JSON.stringify(obj));
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(obj));
});
http.listen(PORT, function(){
  console.log('listening on localhost:'+PORT);
});
