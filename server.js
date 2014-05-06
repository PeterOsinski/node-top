var express         = require('express');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var app             = express();
var exphbs          = require('express3-handlebars');
var fs              = require('fs');

var cpuLoad         = require('./cpu-load.js');
var sysInfo         = require('./sys-info.js');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/static', express.static(__dirname + '/static'));

app.use(cookieParser('keyboard cat'));
app.use(session({ secret: 'keyboard cat', key: 'sid', cookie: { secure: false }}));
app.use(bodyParser());
 

require('./routes.js')(app);

app.listen(4000, function(){
    console.log('Server running...');
});

// http://justgage.com/
var io = require('socket.io').listen(4040);

var conntectedClients = 0;
io.sockets.on('connection', function(socket) {

    conntectedClients++;
	console.log('new client connected, online:', conntectedClients);

    //start broadcasting
    if(conntectedClients === 1){

    	cpuLoad.startLogging(500, function(usageData){
    		io.sockets.emit('cpu-load', usageData);
    	});

        sysInfo.startLogging(5000, function(info){
            io.sockets.emit('overall-info', info);
        });

    }

    socket.on('disconnect', function(socket) {
		console.log('new client disconnected, online:', conntectedClients);
        conntectedClients--;

        if(conntectedClients === 0){
        	
        	cpuLoad.stopLogging();
            sysInfo.stopLogging();

        }
    });
});