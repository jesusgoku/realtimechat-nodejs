var express = require('express');
var app = express();
var port = process.env.PORT || 3700;

app.use(express.logger());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.configure('development', function () {
	app.use(express.errorHandler());
	app.locals.pretty = true;
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (res, res) {
	// -- With raw
	// res.send('It works!');
	// -- With Jade Engine
	res.render('page')
});

// -- With out Socket.io
// app.listen(port);
// -- With Socket.io
var io = require('socket.io').listen( app.listen(port) );
console.log('Listen on port ' + port);

io.configure(function () {
	io.set("transports", ["xhr-polling"]); 
	io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'welcome to the chat' });
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});