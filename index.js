var http = require("http");
var url=require('url');
fs = require('fs');

var port = 18099;

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  var pathname=url.parse(request.url).pathname;
  switch(pathname){

    case '/map':
      fs.readFile('rsc/maps/cornell_basic.json', 'utf8', function (err,data) {
        if (err) {
          return response.write("error!!");  
        }
        response.write(data);
        response.end();
      });
      break;

    default:
      response.end('default');
      break;
  }
}).listen(port);
