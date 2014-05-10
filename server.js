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

// var io = require('socket.io').listen(4040);
// require('socket.io').listen(4040);

// var conntectedClients = 0;
// var CPU_LOAD_INTERVAL, SYS_INFO_INTERVAL;
// io.sockets.on('connection', function(socket) {

//     conntectedClients++;
// 	console.log('new client connected, online:', conntectedClients);

//     //start broadcasting
//     if(conntectedClients === 100){

//         //CPU LOAD
//         CPU_LOAD_INTERVAL = setInterval(function(){
//             io.sockets.emit('cpu-load', cpuLoad.getLoad());
//         }, 1000);
//         // /CPU LOAD


//         //SYSINFO
//         SYS_INFO_INTERVAL = setInterval(function(){
//             sysInfo.getInfo(function(data){

//                 io.sockets.emit('overall-info', data);

//             })
//         }, 5000);
//         sysInfo.getInfo(function(data){

//             io.sockets.emit('overall-info', data);

//         })
//         // /SYSINFO

//     }

//     socket.on('disconnect', function(socket) {
// 		console.log('new client disconnected, online:', conntectedClients);
//         conntectedClients--;

//         if(conntectedClients === 0){
        	
//             clearInterval(CPU_LOAD_INTERVAL);
//             clearInterval(SYS_INFO_INTERVAL);

//         }
//     });
// });