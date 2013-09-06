var express = require("express");
var fs = require("fs");

var app = express();
app.use(express.logger());

app.use(express.static(__dirname + '/static'));

app.get('/', function(request, response) {
 	
	 fs.readFile('index.html',function(err,contents){

                        response.write(contents);
						
           		response.end();
        });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
