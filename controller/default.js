var io 			= require('socket.io').listen(4040);
var cpuLoad     = require('./../parsers/cpu-load.js');
var sysInfo     = require('./../parsers/sys-info.js');
var ifconfig     = require('./../parsers/ifconfig.js');
var _ = require('underscore');

exports.index = function(req, res){

	res.render('default_index');
	
}


exports.endpoint = function(req, res){
	var params = req.body;

	// console.log(_.keys(params));

	io.sockets.emit('payload', processPayload(params));

	res.send();
}

var dataProcessing = {
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
	}
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