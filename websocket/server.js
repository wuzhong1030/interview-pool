var server = require('http').createServer()
var io = require('socket.io')(server)
io.on('connection', function(client){
	console.log(client)
  client.on('event', function(data){
  	console.log(data)
  })
  client.on('disconnect', function(){

  })
});
server.listen(3000, function () {
	console.log('listen on 3000')
});