var express = require("express");
var fs = require("fs");

var app = express();
app.use(express.logger());

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

io.sockets.on('connection', function(client) {

  console.log("Client connected...");

  client.on('join', function(name) { 
		
		client.set('nickname', name); 

	      console.log("Client's nickname :"+name);
	}); 
	

    client.on('messages', function (data) {
		
	client.get('nickname', function(err, name) {

			client.broadcast.emit("chat", name + ": " + data);

			});

		});



});
