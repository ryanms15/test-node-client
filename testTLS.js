/*var tls = require('tls');
var host = "google.com";
console.log('Starting test!');
var stream = tls.connect(443, host, {'rejectUnauthorized': false}, function() {
		console.log('tls.connect - stream');
		console.log(stream)
		console.log('Finished connecting to SSL.')
	});*/

tls = require('tls');
var i = 0;
var stuff;
//var array = [];
// callback for when secure connection established
function connected(stream) {
    if (stream) {
       // socket connected
       console.log('Stream:');
       console.log(stream);
      stream.write("GET / HTTP/1.0\n\rHost: encrypted.google.com:443\n\r\n\r");  
    } else {
      console.log("Connection failed");
    }
}
 
// needed to keep socket variable in scope
var dummy = this;
 
// try to connect to the server
dummy.socket = tls.connect(443, 'encrypted.google.com', function() {
   // callback called only after successful socket connection
   dummy.connected = true;
   if (dummy.socket.authorized) {
      // authorization successful
      dummy.socket.setEncoding('utf-8');
      connected(dummy.socket);
   } else {
      // authorization failed
     console.log(dummy.socket.authorizationError);
     connected(null);
   }
});
 
dummy.socket.addListener('data', function(data) {
   // received data
   if (data.length == 1024){
   		stuff += data;
   		i++;
   		console.log('Captured 1k bits!');
   }
   if (data.length !== 1024){
   		console.log('Captured ' + data.length + 'bits!');
   		stuff += data;
   		var loopI = i * 1024;
   		var total = loopI + data.length;
 	  console.log('LENGTH OF DATA: ' +  total);
 	  //console.log('DATA TYPE: ' + typeof data);
 	  console.log(data);
 	  i = 0;
}
});
 
dummy.socket.addListener('error', function(error) {
   if (!dummy.connected) {
     // socket was not connected, notify callback
     connected(null);
   }
   console.log("FAIL");
   console.log(error);
});
 
dummy.socket.addListener('close', function() {
 // do something
});