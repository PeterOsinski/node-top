var io 			= require('socket.io').listen(4040, {log: false});
var cpuLoad     = require('./../parsers/cpu-load.js');
var sysInfo     = require('./../parsers/sys-info.js');
var ifconfig    = require('./../parsers/ifconfig.js');
var _ 			= require('underscore');
var debug		= require('debug')('nt:controller')


var dataProcessing = {
	ps: function(d){
		return d;
	},
	df: function(d){
		return d;
	},
	loadavg: function(d){
		return d;
	},
	load: function(d){
		return cpuLoad.parseLoad(d);
	},
	mem: function(d){
		return sysInfo.parseMem(d);
	},
	ifconfig: function(d){
		return ifconfig.parseIfconfig(d);
	},
	cputemp: function(d){
		return d;
	},
	diskstat: function(d){
		debug(d)
		return d;
	}
}


// BELOW THIS LINE EDIT IF NEEDED
// --------------------------------------------
exports.index = function(req, res){

	res.render('default_index');
	
}

io.sockets.on('connection', function (socket) {
  
  io.sockets.emit('payload', processPayload(payloadCache));

})

var payloadCache = {};
exports.endpoint = function(req, res){
	var params = req.body;

	var n = _.keys(params);
	_.each(n, function(p){
		payloadCache[p] = params[p];
	})

	io.sockets.emit('payload', processPayload(params));

	res.send();
}


var processPayload = function(params){

	var payload = {};
	_.each(params, function(param, name){

		if(dataProcessing[name]){
			payload[name] = dataProcessing[name](param);
		}

	});

	return payload;

}