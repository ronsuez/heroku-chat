var express = require("express");
var fs = require("fs");

var app = express();
app.use(express.logger('env'));

// New call to compress content
app.use(express.compress());

app.use("/static",express.static(__dirname + '/static'));
	

app.get('/', function(req, res){
	
		 fs.readFile('index.html',function(err,contents){

                        res.write(contents);
						
           		res.end();
        });

});
var port = process.env.PORT || 5000;

var io_server = app.listen(port, function() {
  console.log("Listening on " + port);
});


var io = require("socket.io").listen(io_server,{log: false});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

var users = [];

io.sockets.on('connection', function(client) {

  console.log("Client connected...");

  client.on('join', function(name) { 
		
	      client.set('nickname', name); 
		
	      users.push(name);

	      console.log("Client's nickname :"+name);
          
          client.broadcast.emit("new-user",name);

          for(i = 0; i < users.length ; i++){
          		if(users[i] != name)
          		client.broadcast.emit("new-user",users[i]);
          }
       
	      console.log("Clients connected :"+users.length);
	}); 
	

    client.on('messages', function (data) {
		
	client.get('nickname', function(err, name) {
			
			console.log("Message:"+ name +":"+data);
             
			client.broadcast.emit("chat",name + ": " + data);

			});

		});

	client.on('disconnect', function (name) {
      	
	console.log('socket closed,removing user :'+name);
      	
	var index = users.indexOf(name);
	
		users.splice(index,1);

	 console.log("Clients connected :"+users.length);
    });
});
